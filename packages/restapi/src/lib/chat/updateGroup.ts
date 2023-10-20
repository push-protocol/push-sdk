import axios from 'axios';
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
  sign,
  getAccountAddress,
  getUserDID,
  getConnectedUserV2,
  updateGroupRequestValidator,
} from './helpers';
import * as CryptoJS from 'crypto-js';

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

export const updateGroup = async (
  options: ChatUpdateGroupType
) => {
  return await updateGroupCore(options, PGPHelper);
}

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
    const connectedUser = await getConnectedUserV2Core(wallet, pgpPrivateKey, env, pgpHelper);
    const convertedMembersPromise = members.map(async (each) => {
      return getUserDID(each, env);
    });
    const convertedAdminsPromise = admins.map(async (each) => {
      return getUserDID(each, env);
    });
    const convertedMembers = await Promise.all(convertedMembersPromise);
    const convertedAdmins = await Promise.all(convertedAdminsPromise);
    const bodyToBeHashed = {
      groupName: groupName,
      groupDescription: groupDescription,
      groupImage: groupImage,
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
      groupDescription,
      groupImage,
      scheduleAt,
      scheduleEnd,
      status,
      meta,
      rules
    );

    return axios
      .put(apiEndpoint, body)
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        if (err?.response?.data) throw new Error(err?.response?.data);
        throw new Error(err);
      });
  } catch (err) {
    console.error(
      `[Push SDK] - API  - Error - API ${updateGroup.name} -:  `,
      err
    );
    throw Error(
      `[Push SDK] - API  - Error - API ${updateGroup.name} -: ${err}`
    );
  }
};
