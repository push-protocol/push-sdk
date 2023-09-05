import Constants, { ENV } from '../constants';
import { ChatStatus, ProgressHookType, Rules } from '../types';
import {GetAliasInfoOptionsType} from "../alias"
export enum ChatListType {
  CHATS = 'CHATS',
  REQUESTS = 'REQUESTS',
}
export interface PushAPIInitializeProps {
  env?: ENV;
  progressHook?: (progress: ProgressHookType) => void;
  account?: string | null;
  version?: typeof Constants.ENC_TYPE_V1 | typeof Constants.ENC_TYPE_V3;
  versionMeta?: { NFTPGP_V1?: { password: string } };
  autoUpgrade?: boolean;
  origin?: string;
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

export type FeedsOptions = {
  user?: string;
  page?: number;
  limit?: number;
  spam?: boolean;
  raw?: boolean;
}

export type SubscriptionOptions = {
  user?: string;
}

export type ChannelInfoOptions = {
  channel?: string;
}

export type ChannelSearchOptions = {
  query: string,
  page?: number;
  limit?: number;
}

export type SubscribeUnsubscribeOptions = {
  channelAddress: string;
  verifyingContractAddress?: string;
  onSuccess?: () => void
  onError?: (err: Error) => void,
}

export type AliasOptions = Omit<GetAliasInfoOptionsType, "env">