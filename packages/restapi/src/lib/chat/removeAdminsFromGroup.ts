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
export interface RemoveAdminsFromGroupType extends EnvOptionsType {
  chatId: string;
  admins: Array<string>;
  account?: string | null;
  signer?: SignerType | null;
  pgpPrivateKey?: string | null; 
}

/**
 * Update Group information
 */
export const removeAdminsFromGroup = async (
  options: RemoveAdminsFromGroupType
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

    const group = await getGroup({
        chatId: chatId,
        env,
    })

    let convertedMembers = getMembersList(
        group.members, group.pendingMembers
    );

    const adminsToBeRemoved = admins.map((admin) => walletToPCAIP10(admin));

    adminsToBeRemoved.forEach((admin) => {
      if (!convertedMembers.includes(admin)) {
        throw new Error(`Member ${admin} not present in the list`);
      }
    });

    let convertedAdmins = getAdminsList(
        group.members, group.pendingMembers
    );

    adminsToBeRemoved.forEach((admin) => {
      if (!convertedAdmins.includes(admin)) {
        throw new Error(`Admin ${admin} not present in the list`);
      }
    });

    convertedMembers = convertedMembers.filter(
      (member) => !adminsToBeRemoved.includes(member)
    );

    convertedAdmins = convertedAdmins.filter(
      (member) => !adminsToBeRemoved.includes(member)
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
      `[Push SDK] - API  - Error - API ${removeAdminsFromGroup.name} -:  `,
      err
    );
    throw Error(
      `[Push SDK] - API  - Error - API ${removeAdminsFromGroup.name} -: ${err}`
    );
  }
};
