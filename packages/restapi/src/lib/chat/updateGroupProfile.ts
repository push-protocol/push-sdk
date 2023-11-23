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
  sign,
  getWallet,
  getAccountAddress,
  getConnectedUserV2,
  updateGroupRequestValidator,
  getAdminsList,
  getMembersList,
} from './helpers';

import { getGroup } from './getGroup';
import * as CryptoJS from 'crypto-js';
import { axiosPut } from '../utils/axiosUtil';

export interface ChatUpdateGroupProfileType extends EnvOptionsType {
  account?: string | null;
  signer?: SignerType | null;
  chatId: string;
  groupName: string;
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
export const updateGroupProfile = async (
  options: ChatUpdateGroupProfileType
): Promise<GroupDTO> => {
  const {
    chatId,
    groupName,
    groupImage,
    groupDescription,
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
      [],
      [],
      address,
      groupDescription
    );

    const connectedUser = await getConnectedUserV2(wallet, pgpPrivateKey, env);

    const group = await getGroup({
      chatId: chatId,
      env: env,
    });

    // TODO: look at user did in updateGroup
    const convertedMembers = getMembersList(
      group.members,
      group.pendingMembers
    );

    const convertedAdmins = getAdminsList(group.members, group.pendingMembers);

    const bodyToBeHashed = {
      groupName: groupName,
      groupDescription: groupDescription,
      groupImage: groupImage,
      members: convertedMembers,
      admins: convertedAdmins,
      chatId: chatId,
    };
    const hash = CryptoJS.SHA256(JSON.stringify(bodyToBeHashed)).toString();
    const signature: string = await sign({
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

    const response = await axiosPut<GroupDTO>(apiEndpoint, body);
    return response.data;
  } catch (err) {
    console.error(
      `[Push SDK] - API  - Error - API ${updateGroupProfile.name} -:  `,
      err
    );
    throw Error(
      `[Push SDK] - API  - Error - API ${updateGroupProfile.name} -: ${err}`
    );
  }
};
