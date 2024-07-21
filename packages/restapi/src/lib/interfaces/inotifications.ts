export interface INotificationActionResponseV2 {
  success: boolean;
  raw?: {
    tx?: string;
  };
}

export interface ChannelInfoResponseV2 {
  channel: string;
  ipfshash: string;
  name: string;
  info: string;
  url: string;
  icon: string;
  alias: string;
  blocked: number;
  activated: number;
  verified: number;
  timestamp: string;
  settings: ISubscriberSettings[] | null;
  subscribers: number;
}

export interface IAliasInfoResponseV2 {
  channel: string;
  alias: string;
  aliasVerified: number;
  blocked: number;
  activated: number;
}

export interface ISubscriberSettings {
  type: number;
  user: number;
  description: string;
  data?: {
    lower: number;
    upper: number;
    enabled: boolean;
    ticker: number;
  };
}

export interface ISubscriber {
  subscriber: string;
  settings: ISubscriberSettings[] | null;
}

export interface ISubscribersResponseV2 {
  itemcount: number;
  subscribers: ISubscriber[];
}

export interface IChannelSubscription {
  channel: string;
  user_settings: ISubscriberSettings[] | null;
}

export interface IChannelSubscriptionResponseV2 {
  subscriptions: IChannelSubscription[];
}

export interface IDelegatesResponseV2 {
  delegates: string[];
}
