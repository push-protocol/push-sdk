import axios from 'axios';
import { getAPIBaseUrls, isValidETHAddress, walletToPCAIP10 } from '../helpers';
import Constants from '../constants';
import { EnvOptionsType, SignerType, SpaceDTO } from '../types';
import {
  IUpdateGroupRequestPayload,
  updateGroupPayload,
  getConnectedUser,
  sign,
  getWallet,
  getAccountAddress,
  getMembersList,
  getAdminsList,
  groupDtoToSpaceDto
} from './../chat/helpers';
import * as CryptoJS from 'crypto-js';
import {
  get
} from './get';
export interface AddAdminsToSpaceType extends EnvOptionsType {
  spaceId: string;
  admins: Array<string>;
  account?: string;
  signer?: SignerType;
  pgpPrivateKey?: string;
}

/**
 * Update Group information
 */
export const addAdminsToSpace = async (
  options: AddAdminsToSpaceType
): Promise<SpaceDTO> => {
  const {
    spaceId,
    admins,
    account = null,
    signer = null,
    env = Constants.ENV.PROD,
    pgpPrivateKey = null,
  } = options || {};
  try {
    if (account == null && signer == null) {
      throw new Error(`At least one from account or signer is necessary!`);
    }
  
    if (!admins || admins.length === 0) {
      throw new Error("Admin address array cannot be empty!");
    }
  
    admins.forEach((admin) => {
      if (!isValidETHAddress(admin)) {
        throw new Error(`Invalid admin address: ${admin}`);
      }
    });

    const wallet = getWallet({ account, signer });
    const address = await getAccountAddress(wallet);

    const space = await get({
        spaceId: spaceId,
        env,
    })

    const connectedUser = await getConnectedUser(wallet, pgpPrivateKey, env);

    const convertedMembers = getMembersList(
        space.members, space.pendingMembers
    );

    const adminsToBeAdded = admins.map((admin) => walletToPCAIP10(admin));

    adminsToBeAdded.forEach((admin) => {
      if (!convertedMembers.includes(admin)) {
        convertedMembers.push(admin);
      }
    });

    const convertedAdmins = getAdminsList(
        space.members, space.pendingMembers
    );

    adminsToBeAdded.forEach((admin) => {
      if (convertedAdmins.includes(admin)) {
        throw new Error(`Admin ${admin} already exists in the list`);
      }
    });

    convertedAdmins.push(...adminsToBeAdded);

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
      verificationProof
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
      `[Push SDK] - API  - Error - API ${addAdminsToSpace.name} -:  `,
      err
    );
    throw Error(
      `[Push SDK] - API  - Error - API ${addAdminsToSpace.name} -: ${err}`
    );
  }
};
