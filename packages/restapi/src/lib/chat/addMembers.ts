import Constants from '../constants';
import { EnvOptionsType, SignerType, GroupInfoDTO } from '../types';
import { updateGroupMembers } from './updateGroupMembers';
import { GroupMemberUpdateOptions } from './updateGroupMembers';
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
export const addMembers = async (
  options: AddMembersToGroupType
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

    const upsertPayload = {
      members: members,
    };

    const groupMemberUpdateOptions: GroupMemberUpdateOptions = {
      chatId: chatId,
      upsert: upsertPayload,
      remove: [], // No members to remove in this case
      account: account,
      signer: signer,
      pgpPrivateKey: pgpPrivateKey,
      env: env,
    };
    return await updateGroupMembers(groupMemberUpdateOptions);
  } catch (err) {
    console.error(
      `[Push SDK] - API  - Error - API ${addMembers.name} -:  `,
      err
    );
    throw Error(`[Push SDK] - API  - Error - API ${addMembers.name} -: ${err}`);
  }
};
