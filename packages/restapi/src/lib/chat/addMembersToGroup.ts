import axios from 'axios';
import { getAPIBaseUrls, isValidETHAddress, walletToPCAIP10 } from '../helpers';
import Constants from '../constants';
import { EnvOptionsType, SignerType, GroupDTO } from '../types';
import {
  IUpdateGroupRequestPayload,
  updateGroupPayload,
  getConnectedUser,
  sign,
  getWallet,
  getAccountAddress,
  getMembersList,
  getAdminsList
} from './helpers';
import * as CryptoJS from 'crypto-js';
import {
  getGroup
} from './getGroup';
export interface AddMembersToGroupType extends EnvOptionsType {
  chatId: string;
  members: Array<string>;
  account?: string;
  signer?: SignerType;
  pgpPrivateKey?: string;
}

/**
 * Update Group information
 */
export const addMembersToGroup = async (
  options: AddMembersToGroupType
): Promise<GroupDTO> => {
  const {
    chatId,
    members,
    account = null,
    signer = null,
    env = Constants.ENV.PROD,
    pgpPrivateKey = null,
  } = options || {};
  try {
    if (account == null && signer == null) {
      throw new Error(`At least one from account or signer is necessary!`);
    }
  
    if (!members || members.length === 0) {
      throw new Error("Member address array cannot be empty!");
    }
  
    members.forEach((member) => {
      if (!isValidETHAddress(member)) {
        throw new Error(`Invalid member address: ${member}`);
      }
    });

    const wallet = getWallet({ account, signer });
    const address = await getAccountAddress(wallet);

    const group = await getGroup({
        chatId: chatId,
        env,
    })

    const connectedUser = await getConnectedUser(wallet, pgpPrivateKey, env);

    const convertedMembers = getMembersList(
        group.members, group.pendingMembers
    );

    const membersToBeAdded = members.map((member) => walletToPCAIP10(member));

    membersToBeAdded.forEach((member) => {
      if (convertedMembers.includes(member)) {
        throw new Error(`Member ${member} already exists in the list`);
      }
    });

    convertedMembers.push(...membersToBeAdded);

    const convertedAdmins = getAdminsList(
        group.members, group.pendingMembers
    );

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
      walletToPCAIP10(address),
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
      `[Push SDK] - API  - Error - API ${addMembersToGroup.name} -:  `,
      err
    );
    throw Error(
      `[Push SDK] - API  - Error - API ${addMembersToGroup.name} -: ${err}`
    );
  }
};
