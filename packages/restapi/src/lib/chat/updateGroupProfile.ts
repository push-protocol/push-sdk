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
  sign,
  getWallet,
  getAccountAddress,
  getConnectedUserV2,
  updateGroupRequestValidator,
} from './helpers';
import * as CryptoJS from 'crypto-js';
import { getGroup } from './getGroup';

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
    /**
     * VALIDATIONS
     */
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

    const group = await getGroup({
      chatId,
      env,
    });

    /**
     * CREATE PROFILE VERIFICATION PROOF
     */
    const bodyToBeHashed = {
      chatId: chatId,
      groupName: groupName,
      groupDescription: groupDescription,
      groupImage: groupImage,
      meta: meta,
      scheduleAt: scheduleAt,
      scheduleEnd: scheduleEnd,
      rules: rules,
      status: status,
      isPublic: group.isPublic,
      groupType: group.groupType,
    };

    const hash = CryptoJS.SHA256(JSON.stringify(bodyToBeHashed)).toString();
    const connectedUser = await getConnectedUserV2(wallet, pgpPrivateKey, env);
    const signature: string = await sign({
      message: hash,
      signingKey: connectedUser.privateKey!,
    });
    const sigType = 'pgpv2';
    // Account is need to verify the signature at any future point
    const verificationProof: string =
      sigType + ':' + signature + ':' + connectedUser.did;

    /**
     * API CALL TO PUSH NODES
     */
    const API_BASE_URL = getAPIBaseUrls(env);
    const apiEndpoint = `${API_BASE_URL}/v1/chat/groups/${chatId}/profile`;

    const {
      chatId: chat_id,
      isPublic: is_public,
      groupType: group_type,
      ...body
    } = bodyToBeHashed;
    (body as any).verificationProof = verificationProof;

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
      `[Push SDK] - API  - Error - API ${updateGroupProfile.name} -:  `,
      err
    );
    throw Error(
      `[Push SDK] - API  - Error - API ${updateGroupProfile.name} -: ${err}`
    );
  }
};
