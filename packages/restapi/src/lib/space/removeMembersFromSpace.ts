import axios from 'axios';
import { getAPIBaseUrls, isValidETHAddress, walletToPCAIP10 } from '../helpers';
import Constants from '../constants';
import { EnvOptionsType, SignerType, GroupDTO, SpaceDTO } from '../types';
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
export interface RemoveMembersFromSpaceType extends EnvOptionsType {
  spaceId: string;
  members: Array<string>;
  account?: string;
  signer?: SignerType;
  pgpPrivateKey?: string;
}

/**
 * Update Group information
 */
export const removeMembersFromSpace = async (
  options: RemoveMembersFromSpaceType
): Promise<SpaceDTO> => {
  const {
    spaceId,
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

    const space = await get({
        spaceId: spaceId,
        env,
    })

    const connectedUser = await getConnectedUser(wallet, pgpPrivateKey, env);

    let convertedMembers = getMembersList(
        space.members, space.pendingMembers
    );

    const membersToBeRemoved = members.map((member) => walletToPCAIP10(member));

    membersToBeRemoved.forEach((member) => {
      if (!convertedMembers.includes(member)) {
        throw new Error(`Member ${member} not present in the list`);
      }
    });

    convertedMembers = convertedMembers.filter(
      (member) => !membersToBeRemoved.includes(member)
    );

    const convertedAdmins = getAdminsList(
        space.members, space.pendingMembers
    );
    
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
      `[Push SDK] - API  - Error - API ${removeMembersFromSpace.name} -:  `,
      err
    );
    throw Error(
      `[Push SDK] - API  - Error - API ${removeMembersFromSpace.name} -: ${err}`
    );
  }
};
