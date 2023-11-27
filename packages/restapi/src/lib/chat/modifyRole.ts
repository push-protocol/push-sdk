import Constants from '../constants';
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
    overrideSecretKeyGeneration = true,
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
    };

    return await updateGroupMembers(groupMemberUpdateOptions);
  } catch (err) {
    console.error(
      `[Push SDK] - API  - Error - API ${modifyRoles.name} -:  `,
      err
    );
    throw Error(
      `[Push SDK] - API  - Error - API ${modifyRoles.name} -: ${err}`
    );
  }
};
