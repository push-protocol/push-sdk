import { ALPHA_FEATURE_CONFIG } from '../config';
import Constants, { PACKAGE_BUILD } from '../constants';
import { EnvOptionsType, SignerType, GroupInfoDTO } from '../types';
import {
  GroupMemberUpdateOptions,
  updateGroupMembers,
} from './updateGroupMembers';
export interface AddAdminsToGroupType extends EnvOptionsType {
  chatId: string;
  admins: Array<string>;
  account?: string | null;
  signer?: SignerType | null;
  pgpPrivateKey?: string | null;
  overrideSecretKeyGeneration?: boolean;
}

export const addAdmins = async (
  options: AddAdminsToGroupType
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

    const upsertPayload = {
      members: [],
      admins: admins,
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
    console.error(
      `[Push SDK] - API  - Error - API ${addAdmins.name} -:  `,
      err
    );
    throw Error(`[Push SDK] - API  - Error - API ${addAdmins.name} -: ${err}`);
  }
};
