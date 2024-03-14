import { ALPHA_FEATURE_CONFIG } from '../config';
import Constants, { PACKAGE_BUILD } from '../constants';
import { handleError } from '../errors/validationError';
import { EnvOptionsType, SignerType, GroupInfoDTO } from '../types';
import {
  GroupMemberUpdateOptions,
  updateGroupMembers,
} from './updateGroupMembers';

export interface RemoveAdminsFromGroupType extends EnvOptionsType {
  chatId: string;
  admins: Array<string>;
  account?: string | null;
  signer?: SignerType | null;
  pgpPrivateKey?: string | null;
  overrideSecretKeyGeneration?: boolean;
}

/**
 * Update Group information
 */
export const removeAdmins = async (
  options: RemoveAdminsFromGroupType
): Promise<GroupInfoDTO> => {
  const {
    chatId,
    admins,
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

    if (!admins || admins.length === 0) {
      throw new Error('Admin address array cannot be empty!');
    }

    const groupMemberUpdateOptions: GroupMemberUpdateOptions = {
      chatId: chatId,
      upsert: {
        members: [],
        admins: [],
      },
      remove: admins,
      account: account,
      signer: signer,
      pgpPrivateKey: pgpPrivateKey,
      env: env,
      overrideSecretKeyGeneration,
    };
    return await updateGroupMembers(groupMemberUpdateOptions);
  } catch (err) {
      throw handleError(err, removeAdmins.name);
  }
};
