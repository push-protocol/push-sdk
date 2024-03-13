import { getAPIBaseUrls } from '../helpers';
import Constants from '../constants';
import {
  EnvOptionsType,
  GroupDTO,
  GroupInfoDTO,
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
import { axiosPut } from '../utils/axiosUtil';
import { getGroupInfo } from './getGroupInfo';
import { handleError } from '../errors/ValidationError';

export interface ChatUpdateGroupProfileType extends EnvOptionsType {
  account?: string | null;
  signer?: SignerType | null;
  chatId: string;
  groupName: string;
  groupDescription: string | null;
  groupImage: string | null;
  rules?: Rules | null;
  pgpPrivateKey?: string | null;
}

/**
 * Update Group Profile
 */
export const updateGroupProfile = async (
  options: ChatUpdateGroupProfileType
): Promise<GroupInfoDTO> => {
  const {
    chatId,
    groupName,
    groupImage,
    groupDescription,
    rules,
    account = null,
    signer = null,
    env = Constants.ENV.PROD,
    pgpPrivateKey = null,
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

    const group = await getGroupInfo({
      chatId,
      env,
    });

    /**
     * CREATE PROFILE VERIFICATION PROOF
     */
    const bodyToBeHashed = {
      groupName: groupName,
      groupDescription: groupDescription,
      groupImage: groupImage,
      rules: rules ?? {},
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
    const profileVerificationProof: string =
      sigType + ':' + signature + ':' + connectedUser.did;

    /**
     * API CALL TO PUSH NODES
     */
    const API_BASE_URL = getAPIBaseUrls(env);
    const apiEndpoint = `${API_BASE_URL}/v1/chat/groups/${chatId}/profile`;

    const {
      isPublic: is_public,
      groupType: group_type,
      ...body
    } = bodyToBeHashed;
    (body as any).profileVerificationProof = profileVerificationProof;

    const response = await axiosPut<GroupInfoDTO>(apiEndpoint, body);
    return response.data;
  } catch (err) {
      throw handleError(err, updateGroupProfile.name);
  }
};
