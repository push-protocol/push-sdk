import { ENCRYPTION_TYPE, ENV } from '../constants';
import { PushStreamInitializeProps } from '../pushstream/pushStreamTypes';
import { ChatStatus, ProgressHookType, Rules } from '../types';

export enum ChatListType {
  CHATS = 'CHATS',
  REQUESTS = 'REQUESTS',
}
export interface PushAPIInitializeProps {
  env?: ENV;
  progressHook?: (progress: ProgressHookType) => void;
  account?: string | null;
  version?: `${ENCRYPTION_TYPE}`;
  versionMeta?: { NFTPGP_V1?: { password: string } };
  autoUpgrade?: boolean;
  origin?: string;
  streamOptions?: PushStreamInitializeProps;
}

export interface GroupCreationOptions {
  description?: string;
  image?: string;
  members?: string[];
  admins?: string[];
  private?: boolean;
  rules?: Rules | null;
}

export interface ManageGroupOptions {
  role: 'ADMIN' | 'MEMBER';
  accounts: string[];
}

export interface GroupUpdateOptions {
  name?: string;
  description?: string;
  image?: string;
  scheduleAt?: Date | null;
  scheduleEnd?: Date | null;
  status?: ChatStatus | null;
  meta?: string | null;
  rules?: Rules | null;
}
