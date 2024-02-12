import { ALPHA_FEATURE_CONFIG } from '../config';
import Constants, { PACKAGE_BUILD } from '../constants';
import { handleError } from '../errors/ValidationError';
import { EnvOptionsType, SignerType, GroupInfoDTO } from '../types';
import { updateGroupMembers } from './updateGroupMembers';
import { GroupMemberUpdateOptions } from './updateGroupMembers';
export interface AddMembersToGroupType extends EnvOptionsType {
  chatId: string;
  members: Array<string>;
  account?: string | null;
  signer?: SignerType | null;
  pgpPrivateKey?: string | null;
  overrideSecretKeyGeneration?: boolean;
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
    overrideSecretKeyGeneration = !ALPHA_FEATURE_CONFIG[
      PACKAGE_BUILD
    ].feature.includes(Constants.ALPHA_FEATURES.SCALABILITY_V2),
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
      admins: [],
    };

    const groupMemberUpdateOptions: GroupMemberUpdateOptions = {
      chatId: chatId,
      upsert: upsertPayload,
      remove: [], // No members to remove in this case
      account: account,
      signer: signer,
      pgpPrivateKey: pgpPrivateKey,
      env: env,
      overrideSecretKeyGeneration,
    };
    return await updateGroupMembers(groupMemberUpdateOptions);
  } catch (err) {
        throw handleError(err, addMembers.name);
  }
};
