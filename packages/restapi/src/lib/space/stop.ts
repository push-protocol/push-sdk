import axios from 'axios';
import { getAPIBaseUrls, walletToPCAIP10 } from '../helpers';
import Constants from '../constants';
import { EnvOptionsType, SpaceDTO, SignerType, ChatStatus } from '../types';
import {
  IUpdateGroupRequestPayload,
  updateGroupPayload,
  getConnectedUser,
  sign,
  getWallet,
  getAccountAddress,
  groupDtoToSpaceDto,
  getMembersList,
  getAdminsList
} from '../chat/helpers';
import * as CryptoJS from 'crypto-js';
import {
  get
} from './get';
export interface StopSpaceType extends EnvOptionsType {
  spaceId: string;
  account?: string;
  signer?: SignerType;
  pgpPrivateKey?: string;
}

/**
 * Update Group information
 */
export const stop = async (
  options: StopSpaceType
): Promise<SpaceDTO> => {
  const {
    spaceId,
    account = null,
    signer = null,
    env = Constants.ENV.PROD,
    pgpPrivateKey = null,
  } = options || {};
  try {
    if (account == null && signer == null) {
      throw new Error(`At least one from account or signer is necessary!`);
    }

    const wallet = getWallet({ account, signer });
    const address = await getAccountAddress(wallet);

    const space = await get({
        spaceId: spaceId,
        env,
    })

    if (space.status === ChatStatus.ENDED) {
      throw new Error("Space already ended");
    }
 
    const connectedUser = await getConnectedUser(wallet, pgpPrivateKey, env);

    const convertedMembers = getMembersList(
        space.members, space.pendingMembers
    );
    const convertedAdmins = getAdminsList(
        space.members, space.pendingMembers
    );;
    const bodyToBeHashed = {
      groupName: space.spaceName,
      groupDescription: space.spaceDescription,
      groupImage: space.spaceImage,
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
      space.spaceName,
      space.spaceImage,
      space.spaceDescription,
      convertedMembers,
      convertedAdmins,
      walletToPCAIP10(address),
      verificationProof,
      space.scheduleAt,
      space.scheduleEnd,
      ChatStatus.ENDED,
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
      `[Push SDK] - API  - Error - API ${stop.name} -:  `,
      err
    );
    throw Error(
      `[Push SDK] - API  - Error - API ${stop.name} -: ${err}`
    );
  }
};
