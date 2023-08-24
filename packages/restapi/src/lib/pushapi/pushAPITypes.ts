import Constants, { ENV } from '../constants';
import { ChatStatus, ProgressHookType, Rules } from '../types';
export type ChatListType = 'CHATS' | 'REQUESTS';

export type MessageType = 'Text';

export interface SendMessageOptions {
  type?: MessageType;
  content: string;
}

export interface PushAPIInitializeProps {
  env?: ENV;
  progressHook?: (progress: ProgressHookType) => void;
  account?: string | null;
  version?: typeof Constants.ENC_TYPE_V1 | typeof Constants.ENC_TYPE_V3;
  versionMeta?: { password: string };
  autoUpgrade?: boolean;
  origin?: string;
  chat?: any;
  notification?: any;
  spaces?: any;
}

export interface GroupCreationOptions {
  description?: string;
  image?: string;
  members?: string[];
  admins?: string[];
  private?: boolean;
  rules?: {
    entry?: {
      conditions: any[];
    };
    chat?: {
      conditions: any[];
    };
  };
}

export interface ManageGroupOptions {
  chatid: string;
  role: string;
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
