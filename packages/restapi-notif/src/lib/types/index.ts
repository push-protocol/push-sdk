// for namespace TYPES
/* eslint-disable @typescript-eslint/no-namespace */

import { TypedDataDomain, TypedDataField } from 'ethers';
import { ENV, MessageType } from '../constants';

export type Env = typeof ENV[keyof typeof ENV];

export type ApiSubscriptionType = {
  channel: string,
  user_settings: string | null
}

export type NotificationSettingType = {
  type: number;
  default?: number | { upper: number; lower: number };
  description: string;
  data?: {
    upper: number;
    lower: number;
    ticker?: number;
  };
  userPreferance?: {
    value: number | { upper: number; lower: number },
    enabled: boolean
  }
};

export interface ISendNotificationInputOptions {
  senderType?: 0 | 1;
  signer: any;
  type: NOTIFICATION_TYPE;
  identityType: IDENTITY_TYPE;
  notification?: {
    title: string;
    body: string;
  };
  payload?: {
    sectype?: string;
    title: string;
    body: string;
    cta: string;
    img: string;
    hidden?: boolean;
    etime?: number;
    silent?: boolean;
    additionalMeta?:
      | {
          /**
           * type = ADDITIONAL_META_TYPE+VERSION
           * VERSION > 0
           */
          type: `${ADDITIONAL_META_TYPE}+${number}`;
          data: string;
          domain?: string;
        }
      | string;
    /**
     * @deprecated
     * use additionalMeta instead
     */
    metadata?: any;
    index?: string;
  };
  recipients?: string | string[]; // CAIP or plain ETH
  channel: string; // CAIP or plain ETH
  /**
   * @deprecated
   * use payload.etime instead
   */
  expiry?: number;
  /**
   * @deprecated
   * use payload.hidden instead
   */
  hidden?: boolean;
  graph?: {
    id: string;
    counter: number;
  };
  ipfsHash?: string;
  env?: ENV;
  /** @deprecated - Use `rules` object instead */
  chatId?: string;
  rules?: SendNotificationRules;
  pgpPrivateKey?: string;
}

export interface INotificationPayload {
  notification: {
    title: string;
    body: string;
  };
  data: {
    acta: string;
    aimg: string;
    amsg: string;
    asub: string;
    type: string;
    etime?: number;
    hidden?: boolean;
    sectype?: string;
  };
  recipients: any;
}


export interface IUser {
  msgSent: number;
  maxMsgPersisted: number;
  did: string;
  wallets: string;
  profile: {
    name: string | null;
    desc: string | null;
    picture: string | null;
    profileVerificationProof: string | null;
    blockedUsersList: Array<string> | null;
  };
  encryptedPrivateKey: string;
  publicKey: string;
  verificationProof: string;
  origin?: string | null;

  /**
   * @deprecated Use `profile.name` instead.
   */
  name: string | null;
  /**
   * @deprecated Use `profile.desc` instead.
   */
  about: string | null;
  /**
   * @deprecated Use `profile.picture` instead.
   */
  profilePicture: string | null;
  /**
   * @deprecated Use `msgSent` instead.
   */
  numMsg: number;
  /**
   * @deprecated Use `maxMsgPersisted` instead.
   */
  allowedNumMsg: number;
  /**
   * @deprecated Use `encryptedPrivateKey.version` instead.
   */
  encryptionType: string;
  /**
   * @deprecated Use `verificationProof` instead.
   */
  signature: string;
  /**
   * @deprecated Use `verificationProof` instead.
   */
  sigType: string;
  /**
   * @deprecated Use `encryptedPrivateKey.encryptedPassword` instead.
   */
  encryptedPassword: string | null;
  /**
   * @deprecated
   */
  nftOwner: string | null;
  /**
   * @deprecated Not recommended to be used anywhere
   */
  linkedListHash?: string | null;
  /**
   * @deprecated Not recommended to be used anywhere
   */
  nfts?: [] | null;
}


export type Data = {
  contract?: string;
  amount?: number;
  decimals?: number;
  id?: string;
  role?: string;
  url?: string;
  comparison?: '>' | '<' | '>=' | '<=' | '==' | '!=' | 'all' | 'any';
};


export type ProgressHookType = {
  progressId: string;
  progressTitle: string;
  progressInfo: string;
  level: 'INFO' | 'SUCCESS' | 'WARN' | 'ERROR';
};
export type ProgressHookTypeFunction = (...args: any[]) => ProgressHookType;


export type ethersV5SignerType = {
  _signTypedData: (
    domain: TypedDataDomain,
    types: Record<string, Array<TypedDataField>>,
    value: Record<string, any>
  ) => Promise<string>;
  getAddress: () => Promise<string>;
  signMessage: (message: Uint8Array | string) => Promise<string>;
  privateKey?: string;
  provider?: any;
};

export type ethersV6SignerType = {
  signTypedData: (
    domain: TypedDataDomain,
    types: Record<string, Array<TypedDataField>>,
    value: Record<string, any>
  ) => Promise<string>;
  getAddress: () => Promise<string>;
  signMessage: (message: Uint8Array | string) => Promise<string>;
  privateKey?: string;
  provider?: any;
};

export type viemSignerType = {
  signTypedData: (args: {
    account: any;
    domain: any;
    types: any;
    primaryType: any;
    message: any;
  }) => Promise<`0x${string}`>;
  getChainId: () => Promise<number>;
  signMessage: (args: {
    message: any;
    account: any;
    [key: string]: any;
  }) => Promise<`0x${string}`>;
  account: { [key: string]: any };
  privateKey?: string;
  provider?: any;
};

export type SignerType =
  | ethersV5SignerType
  | ethersV6SignerType
  | viemSignerType;
