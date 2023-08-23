import Constants, { ENV } from '../constants';
import { ProgressHookType } from '../types';
export type ChatListType = 'CHATS' | 'REQUESTS';


export type MessageType = 'Text';

export interface SendMessageOptions {
  type?: MessageType;
  content: string;
}

export interface PushAPIInitializeProps {
  env?: ENV;
  progressHook?: (progress: ProgressHookType) => void;
  account?: string;
  version?: typeof Constants.ENC_TYPE_V1 | typeof Constants.ENC_TYPE_V3;
  versionMeta?: { password: string };
  autoUpgrade?: boolean;
  origin?: string;
  chat?: any;
  notification?: any;
  spaces?: any;
}

