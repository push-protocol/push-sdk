import { ProgressHookType } from '../types';
import { GetAliasInfoOptionsType } from '../alias';
import { ADDITIONAL_META_TYPE } from '../../lib/payloads/constants';

export type SubscriptionOptions = {
  account?: string;
  page?: number;
  limit?: number;
};
export type ChannelInfoOptions = {
  channel?: string;
};

export type SubscribeUnsubscribeOptions = {
  onSuccess?: () => void;
  onError?: (err: Error) => void;
  settings?: UserSetting[];
};

export type UserSetting = {
  enabled: boolean;
  value?: number;
};

export type AliasOptions = Omit<GetAliasInfoOptionsType, 'env'>;

export enum FeedType {
  INBOX = 'INBOX',
  SPAM = 'SPAM',
}

export type FeedsOptions = {
  account?: string;
  //TODO: change it to string[] once we start supporting multiple channel
  channels?: [string];
  page?: number;
  limit?: number;
  raw?: boolean;
};

export type ChannelSearchOptions = {
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
  index?: {
    index: number;
    value?: number;
  };
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
  type: number;
  default: number;
  description: string;
  data?: {
    upper: number;
    lower: number;
  };
};

export type NotificationSettings = NotificationSetting[];
