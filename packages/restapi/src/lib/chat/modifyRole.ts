import { ALPHA_FEATURE_CONFIG } from '../config';
import Constants, { PACKAGE_BUILD } from '../constants';
import { handleError } from '../errors/validationError';
import { EnvOptionsType, SignerType, GroupInfoDTO } from '../types';
import {
  GroupMemberUpdateOptions,
  updateGroupMembers,
} from './updateGroupMembers';

export interface ModifyRolesType extends EnvOptionsType {
  chatId: string;
  newRole: 'ADMIN' | 'MEMBER';
  members: Array<string>;
  account?: string | null;
  signer?: SignerType | null;
  pgpPrivateKey?: string | null;
  overrideSecretKeyGeneration?: boolean;
  perChain?: boolean;
  chainId?: string;
}

export const modifyRoles = async (
  options: ModifyRolesType
): Promise<GroupInfoDTO> => {
  const {
    chatId,
    newRole,
    members,
    account = null,
    signer = null,
    env = Constants.ENV.PROD,
    pgpPrivateKey = null,
    overrideSecretKeyGeneration = !ALPHA_FEATURE_CONFIG[
      PACKAGE_BUILD
    ].feature.includes(Constants.ALPHA_FEATURES.SCALABILITY_V2),
    perChain,
    chainId,
  } = options || {};

  try {
    if (account == null && signer == null) {
      throw new Error(`At least one from account or signer is necessary!`);
    }

    if (!members || members.length === 0) {
      throw new Error('Members array cannot be empty!');
    }

    const upsertPayload = {
      admins: newRole === 'ADMIN' ? members : [],
      members: newRole === 'MEMBER' ? members : [],
    };

    const groupMemberUpdateOptions: GroupMemberUpdateOptions = {
      chatId: chatId,
      upsert: upsertPayload,
      remove: [],
      account: account,
      signer: signer,
      pgpPrivateKey: pgpPrivateKey,
      env: env,
      overrideSecretKeyGeneration,
      perChain,
      chainId,
    };

    return await updateGroupMembers(groupMemberUpdateOptions);
  } catch (err) {
    throw handleError(err, modifyRoles.name);
  }
};
