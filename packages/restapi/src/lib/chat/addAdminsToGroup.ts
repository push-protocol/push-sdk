import axios from 'axios';
import { getAPIBaseUrls, isValidETHAddress, walletToPCAIP10 } from '../helpers';
import Constants from '../constants';
import { EnvOptionsType, SignerType, GroupDTO } from '../types';
import {
  IUpdateGroupRequestPayload,
  updateGroupPayload,
  sign,
  getWallet,
  getAccountAddress,
  getMembersList,
  getAdminsList,
  getConnectedUserV2
} from './helpers';
import * as CryptoJS from 'crypto-js';
import {
  getGroup
} from './getGroup';
export interface AddAdminsToGroupType extends EnvOptionsType {
  chatId: string;
  admins: Array<string>;
  account?: string;
  signer?: SignerType;
  pgpPrivateKey?: string;
}

/**
 * Update Group information
 */
export const addAdminsToGroup = async (
  options: AddAdminsToGroupType
): Promise<GroupDTO> => {
  const {
    chatId,
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

    const group = await getGroup({
        chatId: chatId,
        env,
    })

    // TODO: change to getConnectedUserV2
    const connectedUser = await getConnectedUserV2(wallet, pgpPrivateKey, env);

    // TODO: look at user did in updateGroup
    const convertedMembers = getMembersList(
        group.members, group.pendingMembers
    );

        // TODO: look at user did in updateGroup
    const adminsToBeAdded = admins.map((admin) => walletToPCAIP10(admin));

    adminsToBeAdded.forEach((admin) => {
      if (!convertedMembers.includes(admin)) {
        convertedMembers.push(admin);
      }
    });

    const convertedAdmins = getAdminsList(
        group.members, group.pendingMembers
    );

    adminsToBeAdded.forEach((admin) => {
      if (convertedAdmins.includes(admin)) {
        throw new Error(`Admin ${admin} already exists in the list`);
      }
    });

    convertedAdmins.push(...adminsToBeAdded);

    const bodyToBeHashed = {
      groupName: group.groupName,
      groupDescription: group.groupDescription,
      groupImage: group.groupImage,
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
      group.groupName,
      group.groupImage,
      group.groupDescription,
      convertedMembers,
      convertedAdmins,
      walletToPCAIP10(address), // Dont call, this use did. look at group update
      verificationProof
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
      `[Push SDK] - API  - Error - API ${addAdminsToGroup.name} -:  `,
      err
    );
    throw Error(
      `[Push SDK] - API  - Error - API ${addAdminsToGroup.name} -: ${err}`
    );
  }
};
