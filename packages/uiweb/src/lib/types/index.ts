import React, { ReactElement } from 'react';
import { ENV } from '../config';
import { ethers } from 'ethers';
import { IFeeds } from '@pushprotocol/restapi';

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


export type ChatFeedsType = { [key: string]: IFeeds };
export interface Web3NameListType {
  [key: string]: string;
}
export const PUSH_TABS = {
  CHATS: 'CHATS',
  APP_NOTIFICATIONS: 'APP_NOTIFICATIONS'
} as const;

export const PUSH_SUB_TABS = {
  REQUESTS: 'REQUESTS',
} as const;

export type PushTabs = (typeof PUSH_TABS)[keyof typeof PUSH_TABS];
export type PushSubTabs = (typeof PUSH_SUB_TABS)[keyof typeof PUSH_SUB_TABS];

