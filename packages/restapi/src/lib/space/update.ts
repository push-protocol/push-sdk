import axios from 'axios';
import { getAPIBaseUrls, walletToPCAIP10 } from '../helpers';
import Constants from '../constants';
import { EnvOptionsType, SpaceDTO, SignerType, ChatStatus } from '../types';
import {
  IUpdateGroupRequestPayload,
  updateGroupPayload,
  getConnectedUser,
  sign,
  updateGroupRequestValidator,
  getWallet,
  getAccountAddress,
  validateScheduleDates,
  groupDtoToSpaceDto
} from './../chat/helpers';
import * as CryptoJS from 'crypto-js';

export interface ChatUpdateSpaceType extends EnvOptionsType {
  account?: string;
  signer?: SignerType;
  spaceId: string;
  spaceName: string;
  spaceImage: string;
  spaceDescription: string;
  members: Array<string>;
  admins: Array<string>;
  pgpPrivateKey?: string;
  scheduleAt: Date
  scheduleEnd?: Date | null
  status: ChatStatus
}

/**
 * Update Group information
 */
export const update = async (
  options: ChatUpdateSpaceType
): Promise<SpaceDTO> => {
  const {
    spaceId,
    spaceName,
    spaceImage,
    spaceDescription,
    members,
    admins,
    account = null,
    signer = null,
    env = Constants.ENV.PROD,
    pgpPrivateKey = null,
    scheduleAt,
    scheduleEnd,
    status,
  } = options || {};
  try {
    if (account == null && signer == null) {
      throw new Error(`At least one from account or signer is necessary!`);
    }

    const wallet = getWallet({ account, signer });
    const address = await getAccountAddress(wallet);
    updateGroupRequestValidator(
      spaceId,
      spaceName,
      spaceDescription,
      spaceImage,
      members,
      admins,
      address
    );
    validateScheduleDates(scheduleAt, scheduleEnd)
    const connectedUser = await getConnectedUser(wallet, pgpPrivateKey, env);
    const convertedMembers = members.map(walletToPCAIP10);
    const convertedAdmins = admins.map(walletToPCAIP10);
    const bodyToBeHashed = {
      groupName: spaceName,
      groupDescription: spaceDescription,
      groupImage: spaceImage,
      members: convertedMembers,
      admins: convertedAdmins,
      chatId: spaceId,
    };
    const hash = CryptoJS.SHA256(JSON.stringify(bodyToBeHashed)).toString();
    const signature: string = await sign({
      message: hash,
      signingKey: connectedUser.privateKey!,
    });
    const sigType = 'pgp';
    const verificationProof: string = sigType + ':' + signature + ':' + account;
    const API_BASE_URL = getAPIBaseUrls(env);
    const apiEndpoint = `${API_BASE_URL}/v1/chat/groups/${spaceId}`;
    const body: IUpdateGroupRequestPayload = updateGroupPayload(
      spaceName,
      spaceImage,
      spaceDescription,
      convertedMembers,
      convertedAdmins,
      walletToPCAIP10(address),
      verificationProof,
      scheduleAt,
      scheduleEnd,
      status,
    );

    return axios
      .put(apiEndpoint, body)
      .then((response) => {
        return groupDtoToSpaceDto(response.data);
      })
      .catch((err) => {
        if (err?.response?.data) throw new Error(err?.response?.data);
        throw new Error(err);
      });
  } catch (err) {
    console.error(
      `[Push SDK] - API  - Error - API ${update.name} -:  `,
      err
    );
    throw Error(
      `[Push SDK] - API  - Error - API ${update.name} -: ${err}`
    );
  }
};
