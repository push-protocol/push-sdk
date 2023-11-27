import Constants from '../constants';
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
    overrideSecretKeyGeneration = true,
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
    console.error(
      `[Push SDK] - API  - Error - API ${removeAdmins.name} -:  `,
      err
    );
    throw Error(
      `[Push SDK] - API  - Error - API ${removeAdmins.name} -: ${err}`
    );
  }
};
