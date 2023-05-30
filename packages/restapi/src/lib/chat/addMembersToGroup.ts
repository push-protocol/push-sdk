import { isValidETHAddress, walletToPCAIP10 } from '../helpers';
import Constants from '../constants';
import { EnvOptionsType, SignerType, GroupDTO } from '../types';
import {
  getWallet,
  getMembersList,
  getAdminsList
} from './helpers';
import {
  getGroup
} from './getGroup';
import {
  updateGroup
} from './updateGroup';
export interface AddMembersToGroupType extends EnvOptionsType {
  chatId: string;
  members: Array<string>;
  account?: string | null;
  signer?: SignerType | null;
  pgpPrivateKey?: string | null; 
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

    const group = await getGroup({
        chatId: chatId,
        env,
    })

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

    return await updateGroup({
      chatId: chatId,
      groupName: group.groupName,
      groupImage: group.groupImage,
      groupDescription: group.groupDescription,
      members: convertedMembers,
      admins: convertedAdmins,
      account: account,
      signer: signer,
      env: env,
      pgpPrivateKey: pgpPrivateKey
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
