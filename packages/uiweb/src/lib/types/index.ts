import React, { ReactElement } from 'react';
import { ENV } from '../config';
import { ethers } from 'ethers';
import { MessageType } from '@pushprotocol/restapi';

export interface IMessageIPFS {
  fromCAIP10: string;
  toCAIP10: string;
  fromDID: string;
  toDID: string;
  messageType: MessageType;
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
