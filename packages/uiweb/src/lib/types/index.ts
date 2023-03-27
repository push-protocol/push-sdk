import React, { ReactElement } from "react";
import {  ENV } from '../config';

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
  icon?: ReactElement<string|any>;
}


export interface AccountEnvOptionsType {
  env?:  ENV;
  account: string;
  signer: SignerType
}

export interface ITheme {
  bgColorPrimary?: string,
  bgColorSecondary?: string,
  textColorPrimary?: string,
  textColorSecondary?: string,
  btnColorPrimary?: string,
  btnColorSecondary?: string
  border?:string,
  borderRadius?:string,
  moduleColor?:string,
}

export interface SignerType {
  _signTypedData: (
    domain: any,
    types: any,
    value: any
  ) => Promise<string>;
  getAddress: () => Promise<string>;
  provider?: any;
  publicKey?: string;
  privateKey?: string;
}
