import { isValidETHAddress, walletToPCAIP10 } from '../helpers';
import Constants from '../constants';
import { EnvOptionsType, SignerType, GroupDTO } from '../types';
import {
  getMembersList,
  getAdminsList,
} from './helpers';
import {
  getGroup
} from './getGroup';
import {
  updateGroup
} from './updateGroup';
export interface AddAdminsToGroupType extends EnvOptionsType {
  chatId: string;
  admins: Array<string>;
  account?: string | null;
  signer?: SignerType | null;
  pgpPrivateKey?: string | null; 
}

export const addAdmins = async (
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

    const group = await getGroup({
        chatId: chatId,
        env,
    })

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

    return await updateGroup({
        chatId: chatId,
        groupName: group.groupName,
        groupImage: group.groupImage,
        groupDescription: group.groupDescription,
        members: convertedMembers,
        admins: convertedAdmins,
        scheduleAt: group.scheduleAt,
        scheduleEnd: group.scheduleEnd,
        status: group.status,
        account: account,
        signer: signer,
        env: env,
        pgpPrivateKey: pgpPrivateKey
    });
  } catch (err) {
    console.error(
      `[Push SDK] - API  - Error - API ${addAdmins.name} -:  `,
      err
    );
    throw Error(
      `[Push SDK] - API  - Error - API ${addAdmins.name} -: ${err}`
    );
  }
};
