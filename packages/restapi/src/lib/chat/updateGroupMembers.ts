import axios from 'axios';
import { getAPIBaseUrls } from '../helpers';
import Constants from '../constants';
import {
  getWallet,
  PGPHelper,
  getConnectedUserV2Core,
  getAccountAddress,
  getUserDID,
  validateGroupMemberUpdateOptions,
  pgpEncrypt,
} from './helpers';
import * as CryptoJS from 'crypto-js';
import {
  ChatMemberProfile,
  EnvOptionsType,
  GroupInfoDTO,
  SignerType,
} from '../types';
import { getGroupInfo } from './getGroupInfo';
import { getGroupMembers } from './getGroupMembers';
import { getGroupMemberStatus } from './getGroupMemberStatus';
import * as AES from '../chat/helpers/aes';
import { Chat } from '../pushapi/chat';

export interface GroupMemberUpdateOptions extends EnvOptionsType {
  chatId: string;
  upsert: {
    [role: string]: Array<string>;
  };
  remove: Array<string>;
  account?: string | null;
  signer?: SignerType | null;
  pgpPrivateKey?: string | null;
}

export const updateGroupMembers = async (
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
  } = options;
  try {
    validateGroupMemberUpdateOptions(options);
    const wallet = getWallet({ account, signer });
    const address = await getAccountAddress(wallet);

    const connectedUser = await getConnectedUserV2Core(
      wallet,
      pgpPrivateKey,
      env,
      PGPHelper
    );

    const convertedUpsertPromise = Object.entries(upsert).map(
      async ([role, userDIDs]) => {
        const userIDs = await Promise.all(
          userDIDs.map((userDID) => getUserDID(userDID, env))
        );
        return [role, userIDs];
      }
    );
    const convertedUpsert = Object.fromEntries(
      await Promise.all(convertedUpsertPromise)
    );
    const convertedRemove = await Promise.all(
      remove.map((userDID) => getUserDID(userDID, env))
    );

    let sessionKey: string | null = null;
    let encryptedSecret: string | null = null;

    const group = await getGroupInfo({ chatId, env });
    if (!group) {
      throw new Error(`Group not found`);
    }

    if (!group.isPublic) {
      const { isMember } = await getGroupMemberStatus({
        chatId,
        did: connectedUser.did,
        env,
      });

      // Fetch All Group Members
      const groupMembers: ChatMemberProfile[] = [];
      let page = 1;
      const limit = 5000;
      const MAX_LIMIT = 4;
      while (page <= MAX_LIMIT) {
        const { members: fetchMembers } = await getGroupMembers({
          chatId,
          env,
          page,
          limit,
        });
        if (fetchMembers.length === 0) break;
        else {
          groupMembers.push(...fetchMembers);
          page++;
        }
      }

      const removeParticipantSet = new Set(
        convertedRemove.map((participant) => participant.toLowerCase())
      );
      let sameMembers = true;

      groupMembers.map((element) => {
        if (
          element.intent &&
          removeParticipantSet.has(element.address.toLowerCase())
        ) {
          sameMembers = false;
        }
      });

      if (!sameMembers || !isMember) {
        const secretKey = AES.generateRandomSecret(15);

        const publicKeys: string[] = [];
        // This will now only take keys of non-removed members
        groupMembers.map((element) => {
          if (
            element.intent &&
            !removeParticipantSet.has(element.address.toLowerCase())
          ) {
            publicKeys.push(element.userInfo.publicKey as string);
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

        sessionKey = CryptoJS.SHA256(encryptedSecret).toString();
      }
    }

    const bodyToBeHashed = {
      upsert: convertedUpsert,
      remove: convertedRemove,
      sessionKey,
      encryptedSecret,
    };

    const hash = CryptoJS.SHA256(JSON.stringify(bodyToBeHashed)).toString();
    const signature = await PGPHelper.sign({
      message: hash,
      signingKey: connectedUser.privateKey!,
    });
    const sigType = 'pgpv2';
    const verificationProof = `${sigType}:${signature}:${connectedUser.did}`;
    const API_BASE_URL = getAPIBaseUrls(env);
    const apiEndpoint = `${API_BASE_URL}/v1/chat/groups/${chatId}/members`;

    const body = {
      upsert: convertedUpsert,
      remove: convertedRemove,
      sessionKey,
      encryptedSecret,
      verificationProof,
    };
    return axios
      .post(apiEndpoint, body)
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        if (err?.response?.data) throw new Error(err?.response?.data);
        throw new Error(err);
      });
  } catch (err) {
    console.error(
      `[Push SDK] - API  - Error - API ${updateGroupMembers.name} -:  `,
      err
    );
    throw Error(
      `[Push SDK] - API  - Error - API ${updateGroupMembers.name} -: ${err}`
    );
  }
};
