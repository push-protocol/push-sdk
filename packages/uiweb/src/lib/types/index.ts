import type { ReactElement } from 'react';
import React from 'react';
import type { ENV } from '../config';
import type { ethers } from 'ethers';
import type { ParsedResponseType, IFeeds, } from '@pushprotocol/restapi';

export interface IMessageIPFS {
  fromCAIP10: string;
  toCAIP10: string;
  fromDID: string;
  toDID: string;
  messageType: string;
  messageContent: string;
  signature: string;
  sigType: string;
  link: string | null;
  timestamp?: number;
  encType: string;
  encryptedSecret: string;
  icon?: ReactElement<string | any>;
}

export interface AccountEnvOptionsType {
  env?: ENV;
  account: string;
  signer: SignerType;
}

export interface ITheme {
  bgColorPrimary?: string;
  bgColorSecondary?: string;
  textColorPrimary?: string;
  textColorSecondary?: string;
  btnColorPrimary?: string;
  btnColorSecondary?: string;
  border?: string;
  borderRadius?: string;
  moduleColor?: string;
}

export type SignerType = ethers.Signer & {
  _signTypedData?: (domain: any, types: any, value: any) => Promise<string>;
  privateKey?: string;
};

export type ParsedNotificationType = ParsedResponseType & {
  channel:string;
};

export type NotificationFeedsType = { [key: string]:ParsedNotificationType};
export type ChatFeedsType = { [key: string]:IFeeds};
export interface Web3NameListType {
  [key: string]: string;
}
export const PUSH_TABS = {
  CHATS: 'CHATS',
  APP_NOTIFICATIONS: 'APP_NOTIFICATIONS'
} as const;

export const PUSH_SUB_TABS = {
  REQUESTS: 'REQUESTS',
  SPAM:'SPAM'
} as const;

export const LOCAL_STORAGE_KEYS = {
  CHATS: 'CHATS',
} as const;

export const SIDEBAR_PLACEHOLDER_KEYS = {
  CHAT: 'CHAT',
  SEARCH: 'SEARCH',
  NOTIFICATION: 'NOTIFICATION'
} as const;

export type SidebarPlaceholderKeys = (typeof SIDEBAR_PLACEHOLDER_KEYS)[keyof typeof SIDEBAR_PLACEHOLDER_KEYS];

export type LocalStorageKeys = (typeof LOCAL_STORAGE_KEYS)[keyof typeof LOCAL_STORAGE_KEYS];
export type PushTabs = (typeof PUSH_TABS)[keyof typeof PUSH_TABS];
export type PushSubTabs = (typeof PUSH_SUB_TABS)[keyof typeof PUSH_SUB_TABS];
export interface FileMessageContent {
  content: string
  name: string
  type: string
  size: number
}