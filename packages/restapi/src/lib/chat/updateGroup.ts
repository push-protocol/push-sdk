import { getAPIBaseUrls } from '../helpers';
import Constants from '../constants';
import {
  ChatStatus,
  EnvOptionsType,
  GroupDTO,
  Rules,
  SignerType,
} from '../types';
import {
  IUpdateGroupRequestPayload,
  updateGroupPayload,
  getWallet,
  IPGPHelper,
  PGPHelper,
  getConnectedUserV2Core,
  getAccountAddress,
  getUserDID,
  updateGroupRequestValidator,
} from './helpers';
import * as CryptoJS from 'crypto-js';
import { axiosPut } from '../utils/axiosUtil';
import { getGroup } from './getGroup';
import * as AES from '../chat/helpers/aes';
import { getGroupMemberStatus } from './getGroupMemberStatus';
import { handleError } from '../errors/ValidationError';

export interface ChatUpdateGroupType extends EnvOptionsType {
  account?: string | null;
  signer?: SignerType | null;
  chatId: string;
  groupName: string;
  members: Array<string>;
  admins: Array<string>;
  groupImage?: string | null;
  groupDescription?: string | null;
  pgpPrivateKey?: string | null;
  scheduleAt?: Date | null;
  scheduleEnd?: Date | null;
  status?: ChatStatus | null;
  // If meta is not passed, old meta is not affected
  // If passed as null will update to null
  // If passed as string will update to that value
  meta?: string | null;
  rules?: Rules | null;
}

/**
 * Update Group information
 */

export const updateGroup = async (options: ChatUpdateGroupType) => {
  return await updateGroupCore(options, PGPHelper);
};

export const updateGroupCore = async (
  options: ChatUpdateGroupType,
  pgpHelper: IPGPHelper
): Promise<GroupDTO> => {
  const {
    chatId,
    groupName,
    groupImage,
    groupDescription,
    members,
    admins,
    account = null,
    signer = null,
    env = Constants.ENV.PROD,
    pgpPrivateKey = null,
    scheduleAt,
    scheduleEnd,
    status,
    meta,
    rules,
  } = options || {};
  try {
    if (account == null && signer == null) {
      throw new Error(`At least one from account or signer is necessary!`);
    }

    const wallet = getWallet({ account, signer });
    const address = await getAccountAddress(wallet);
    updateGroupRequestValidator(
      chatId,
      groupName,
      members,
      admins,
      address,
      groupDescription
    );

    const connectedUser = await getConnectedUserV2Core(
      wallet,
      pgpPrivateKey,
      env,
      pgpHelper
    );
    const convertedMembersPromise = members.map(async (each) => {
      return getUserDID(each, env);
    });
    const convertedAdminsPromise = admins.map(async (each) => {
      return getUserDID(each, env);
    });
    const convertedMembers = await Promise.all(convertedMembersPromise);
    const convertedAdmins = await Promise.all(convertedAdminsPromise);

    const groupChat = await getGroup({ chatId, env });

    // Compare members array with updateGroup.members array. If they have all the same elements then return true
    const updatedParticipants = new Set(
      convertedMembers.map((participant) => participant.toLowerCase())
    );

    const participantStatus = await getGroupMemberStatus({
      chatId,
      did: connectedUser.did,
      env,
    });

    let sameMembers = true;

    groupChat.members.map((element) => {
      if (!updatedParticipants.has(element.wallet.toLowerCase())) {
        sameMembers = false;
      }
    });

    let encryptedSecret: string | null = null;
    if ((!sameMembers || !participantStatus.isMember) && !groupChat.isPublic) {
      const secretKey = AES.generateRandomSecret(15);

      const publicKeys: string[] = [];
      // This will now only take keys of non-removed members
      groupChat.members.map((element) => {
        if (updatedParticipants.has(element.wallet.toLowerCase())) {
          publicKeys.push(element.publicKey);
        }
      });

      // This is autoJoin Case
      if (!participantStatus.isMember) {
        publicKeys.push(connectedUser.publicKey);
      }

      // Encrypt secret key with group members public keys
      encryptedSecret = await pgpHelper.pgpEncrypt({
        plainText: secretKey,
        keys: publicKeys,
      });
    }

    const bodyToBeHashed = {
      groupName: groupName,
      groupDescription: groupDescription == undefined ? null : groupDescription,
      groupImage: groupImage == undefined ? null : groupImage,
      members: convertedMembers,
      admins: convertedAdmins,
      chatId: chatId,
    };
    const hash = CryptoJS.SHA256(JSON.stringify(bodyToBeHashed)).toString();
    const signature: string = await pgpHelper.sign({
      message: hash,
      signingKey: connectedUser.privateKey!,
    });
    const sigType = 'pgp';
    const verificationProof: string = sigType + ':' + signature + ':' + account;
    const API_BASE_URL = getAPIBaseUrls(env);
    const apiEndpoint = `${API_BASE_URL}/v1/chat/groups/${chatId}`;
    const body: IUpdateGroupRequestPayload = updateGroupPayload(
      groupName,
      convertedMembers,
      convertedAdmins,
      connectedUser.did,
      verificationProof,
      encryptedSecret,
      groupDescription,
      groupImage,
      scheduleAt,
      scheduleEnd,
      status,
      meta,
      rules
    );

    const response = await axiosPut<GroupDTO>(apiEndpoint, body);
    return response.data;
  } catch (err) {
    throw handleError(err, updateGroup.name);
  }
};
