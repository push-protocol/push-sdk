import axios from 'axios';
import {
  convertToValidDID,
  convertToValidDIDV2,
  getAPIBaseUrls,
} from '../helpers';
import Constants, { PACKAGE_BUILD } from '../constants';
import {
  getWallet,
  PGPHelper,
  getConnectedUserV2Core,
  validateGroupMemberUpdateOptions,
  pgpEncrypt,
  getConnectedUserV3Core,
} from './helpers';
import * as CryptoJS from 'crypto-js';
import { EnvOptionsType, GroupInfoDTO, SignerType } from '../types';
import { getGroupInfo } from './getGroupInfo';
import { getGroupMemberStatus } from './getGroupMemberStatus';
import * as AES from '../chat/helpers/aes';
import { getAllGroupMembersPublicKeys } from './getAllGroupMembersPublicKeys';
import { ALPHA_FEATURE_CONFIG } from '../config';
import { axiosPut } from '../utils/axiosUtil';
import { handleError } from '../errors/validationError';

export interface GroupMemberUpdateOptions extends EnvOptionsType {
  chatId: string;
  upsert: {
    [role: string]: Array<string>;
  };
  remove: Array<string>;
  account?: string | null;
  signer?: SignerType | null;
  pgpPrivateKey?: string | null;
  overrideSecretKeyGeneration?: boolean;
  perChain?: boolean;
  chainId?: string;
}

export const updateGroupMembers = async (
  options: GroupMemberUpdateOptions
): Promise<GroupInfoDTO> => {
  if (!options.perChain) {
    return await updateGroupMembersV1(options);
  } else {
    return await updateGroupMembersV2(options);
  }
};

export const updateGroupMembersV1 = async (
  options: GroupMemberUpdateOptions
): Promise<GroupInfoDTO> => {
  const {
    chatId,
    upsert,
    remove,
    account = null,
    signer = null,
    env = Constants.ENV.PROD,
    pgpPrivateKey = null,
    overrideSecretKeyGeneration = !ALPHA_FEATURE_CONFIG[
      PACKAGE_BUILD
    ].feature.includes(Constants.ALPHA_FEATURES.SCALABILITY_V2),
  } = options;
  try {
    validateGroupMemberUpdateOptions(options);
    const wallet = getWallet({ account, signer });

    const connectedUser = await getConnectedUserV2Core(
      wallet,
      pgpPrivateKey,
      env,
      PGPHelper
    );

    const convertedUpsertPromise = Object.entries(upsert).map(
      async ([role, userDIDs]) => {
        const userIDs = await Promise.all(
          userDIDs.map((userDID) => convertToValidDID(userDID, env))
        );
        return [role, userIDs];
      }
    );
    const convertedUpsert = Object.fromEntries(
      await Promise.all(convertedUpsertPromise)
    );
    const convertedRemove = await Promise.all(
      remove.map((userDID) => convertToValidDID(userDID, env))
    );

    let encryptedSecret: string | null = null;

    const group = await getGroupInfo({ chatId, env });
    if (!group) {
      throw new Error(`Group not found`);
    }

    if (!group.isPublic) {
      if (group.encryptedSecret || !overrideSecretKeyGeneration) {
        const { isMember } = await getGroupMemberStatus({
          chatId,
          did: connectedUser.did,
          env,
        });

        const groupMembers = await getAllGroupMembersPublicKeys({
          chatId,
          env,
        });

        const removeParticipantSet = new Set(
          convertedRemove.map((participant) => participant.toLowerCase())
        );
        let sameMembers = true;

        groupMembers.map((element) => {
          if (removeParticipantSet.has(element.did.toLowerCase())) {
            sameMembers = false;
          }
        });

        if (!sameMembers || !isMember) {
          const secretKey = AES.generateRandomSecret(15);

          const publicKeys: string[] = [];
          // This will now only take keys of non-removed members
          groupMembers.map((element) => {
            if (!removeParticipantSet.has(element.did.toLowerCase())) {
              publicKeys.push(element.publicKey as string);
            }
          });

          // This is autoJoin Case
          if (!isMember) {
            publicKeys.push(connectedUser.publicKey);
          }

          // Encrypt secret key with group members public keys
          encryptedSecret = await pgpEncrypt({
            plainText: secretKey,
            keys: publicKeys,
          });
        }
      }
    }

    const bodyToBeHashed = {
      upsert: convertedUpsert,
      remove: convertedRemove,
      encryptedSecret,
    };

    const hash = CryptoJS.SHA256(JSON.stringify(bodyToBeHashed)).toString();
    const signature = await PGPHelper.sign({
      message: hash,
      signingKey: connectedUser.privateKey!,
    });
    const sigType = 'pgpv2';
    const deltaVerificationProof = `${sigType}:${signature}:${connectedUser.did}`;
    const API_BASE_URL = getAPIBaseUrls(env);
    const apiEndpoint = `${API_BASE_URL}/v1/chat/groups/${chatId}/members`;

    const body = {
      upsert: convertedUpsert,
      remove: convertedRemove,
      encryptedSecret,
      deltaVerificationProof,
    };
    const response = await axiosPut(apiEndpoint, body);
    return response.data;
  } catch (error) {
    throw handleError(error, updateGroupMembers.name);
  }
};

export const updateGroupMembersV2 = async (
  options: GroupMemberUpdateOptions
): Promise<GroupInfoDTO> => {
  const {
    chatId,
    upsert,
    remove,
    account = null,
    signer = null,
    env = Constants.ENV.PROD,
    pgpPrivateKey = null,
    overrideSecretKeyGeneration = !ALPHA_FEATURE_CONFIG[
      PACKAGE_BUILD
    ].feature.includes(Constants.ALPHA_FEATURES.SCALABILITY_V2),
    chainId,
    perChain,
  } = options;
  try {
    validateGroupMemberUpdateOptions(options);
    const wallet = getWallet({ account, signer });

    const connectedUser = await getConnectedUserV3Core(
      wallet,
      pgpPrivateKey,
      env,
      PGPHelper
    );

    const convertedUpsertPromise = Object.entries(upsert).map(
      async ([role, userDIDs]) => {
        const userIDs = await Promise.all(
          userDIDs.map((userDID) => convertToValidDID(userDID, env))
        );
        return [role, userIDs];
      }
    );
    const convertedUpsert = Object.fromEntries(
      await Promise.all(convertedUpsertPromise)
    );

    const convertedUpsertPromiseV2 = Object.entries(upsert).map(
      async ([role, userDIDs]) => {
        const userIDs = await Promise.all(
          userDIDs.map((userDID) =>
            convertToValidDIDV2(userDID, env, options.chainId)
          )
        );
        return [role, userIDs];
      }
    );

    const convertedUpsertV2 = Object.fromEntries(
      await Promise.all(convertedUpsertPromiseV2)
    );

    const convertedRemove = await Promise.all(
      remove.map((userDID) => convertToValidDID(userDID, env))
    );

    const convertedRemoveV2 = await Promise.all(
      remove.map((userDID) =>
        convertToValidDIDV2(userDID, env, options.chainId)
      )
    );

    let encryptedSecret: string | null = null;

    const group = await getGroupInfo({ chatId, env });
    if (!group) {
      throw new Error(`Group not found`);
    }

    if (!group.isPublic) {
      if (group.encryptedSecret || !overrideSecretKeyGeneration) {
        const { isMember } = await getGroupMemberStatus({
          chatId,
          did: connectedUser.did,
          env,
          chainId,
        });

        const groupMembers = await getAllGroupMembersPublicKeys({
          chatId,
          env,
        });

        const removeParticipantSet = new Set(
          convertedRemove.map((participant) => participant.toLowerCase())
        );
        let sameMembers = true;

        groupMembers.map((element) => {
          if (removeParticipantSet.has(element.did.toLowerCase())) {
            sameMembers = false;
          }
        });

        if (!sameMembers || !isMember) {
          const secretKey = AES.generateRandomSecret(15);

          const publicKeys: string[] = [];
          // This will now only take keys of non-removed members
          groupMembers.map((element) => {
            if (!removeParticipantSet.has(element.did.toLowerCase())) {
              publicKeys.push(element.publicKey as string);
            }
          });

          // This is autoJoin Case
          if (!isMember) {
            publicKeys.push(connectedUser.publicKey);
          }

          // Encrypt secret key with group members public keys
          encryptedSecret = await pgpEncrypt({
            plainText: secretKey,
            keys: publicKeys,
          });
        }
      }
    }

    const bodyToBeHashed = {
      upsert: convertedUpsert,
      upsertV2: convertedUpsertV2,
      remove: convertedRemove,
      removeV2: convertedRemoveV2,
      encryptedSecret,
    };

    const hash = CryptoJS.SHA256(JSON.stringify(bodyToBeHashed)).toString();
    const signature = await PGPHelper.sign({
      message: hash,
      signingKey: connectedUser.privateKey!,
    });
    const sigType = 'pgpv3';
    const deltaVerificationProof = `${sigType}:${signature}:${connectedUser.didV2}`;
    const API_BASE_URL = getAPIBaseUrls(env);
    const apiEndpoint = `${API_BASE_URL}/v2/chat/groups/${chatId}/members`;

    const body = {
      upsert: convertedUpsert,
      upsertV2: convertedUpsertV2,
      remove: convertedRemove,
      removeV2: convertedRemoveV2,
      encryptedSecret,
      deltaVerificationProof,
    };

    const response = await axiosPut(apiEndpoint, body);
    return response.data;
  } catch (error) {
    throw handleError(error, updateGroupMembers.name);
  }
};
