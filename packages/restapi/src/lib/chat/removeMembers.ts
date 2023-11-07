import Constants from '../constants';
import { EnvOptionsType, SignerType, GroupInfoDTO } from '../types';
import {
  GroupMemberUpdateOptions,
  updateGroupMembers,
} from './updateGroupMembers';
export interface RemoveMembersFromGroupType extends EnvOptionsType {
  chatId: string;
  members: Array<string>;
  account?: string | null;
  signer?: SignerType | null;
  pgpPrivateKey?: string | null;
}

export const removeMembers = async (
  options: RemoveMembersFromGroupType
): Promise<GroupInfoDTO> => {
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
      throw new Error('Member address array cannot be empty!');
    }

    const groupMemberUpdateOptions: GroupMemberUpdateOptions = {
      chatId: chatId,
      upsert: {},
      remove: members,
      account: account,
      signer: signer,
      pgpPrivateKey: pgpPrivateKey,
      env: env,
    };
    return await updateGroupMembers(groupMemberUpdateOptions);
  } catch (err) {
    console.error(
      `[Push SDK] - API  - Error - API ${removeMembers.name} -:  `,
      err
    );
    throw Error(
      `[Push SDK] - API  - Error - API ${removeMembers.name} -: ${err}`
    );
  }
};
