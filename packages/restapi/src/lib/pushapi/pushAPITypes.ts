import Constants, { ENV } from '../constants';
import { ChatStatus, ProgressHookType, Rules, ProgressHookTypeFunction } from '../types';
import { GetAliasInfoOptionsType } from '../alias';
import {
  ADDITIONAL_META_TYPE,
  IDENTITY_TYPE,
} from '../../lib/payloads/constants';
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
};

export type SubscriptionOptions = {
  user?: string;
};
export type SubscriptionOptionsV2 = {
  account?: string;
  page?: number;
  limit?: number;
};
export type ChannelInfoOptions = {
  channel?: string;
};

export type ChannelSearchOptions = {
  query: string;
  page?: number;
  limit?: number;
};

export type SubscribeUnsubscribeOptions = {
  channelAddress: string;
  verifyingContractAddress?: string;
  onSuccess?: () => void;
  onError?: (err: Error) => void;
};

export type SubscribeUnsubscribeOptionsV2 = {
  onSuccess?: () => void;
  onError?: (err: Error) => void;
};

export type AliasOptions = Omit<GetAliasInfoOptionsType, 'env'>;

export enum FeedType {
  INBOX = 'INBOX',
  SPAM = 'SPAM',
}

export type FeedsOptionsV2 = {
  account?: string;
  //TODO: change it to string[] once we start supporting multiple channel
  channels?: [string];
  page?: number;
  limit?: number;
  raw?: boolean;
};

export type ChannelSearchOptionsV2 = {
  page?: number;
  limit?: number;
};

// Types related to notification
export type INotification = {
  title: string;
  body: string;
};

export type IPayload = {
  title?: string;
  body?: string;
  cta?: string;
  embed?: string;
  meta?: {
    domain?: string;
    type: `${ADDITIONAL_META_TYPE}+${number}`;
    data: string;
  };
};

export type IConfig = {
  expiry?: number;
  silent?: boolean;
  hidden?: boolean;
};

export type IAdvance = {
  graph?: {
    id: string;
    counter: number;
  };
  ipfs?: string;
  minimal?: string;
  chatid?: string;
  pgpPrivateKey?: string;
};

export type NotificationOptions = {
  notification: INotification;
  payload?: IPayload;
  config?: IConfig;
  advanced?: IAdvance;
  channel?: string;
};

export type CreateChannelOptions = {
  name: string;
  description: string;
  icon: string;
  url: string;
  alias?: string;
  progressHook?: (progress: ProgressHookType) => void;
};

export type NotificationSetting = {
  type: number,
  default: number,
  description: string,
  data?: {
    upper: number;
    lower: number;
  }
}

export type NotificationSettings = NotificationSetting[]