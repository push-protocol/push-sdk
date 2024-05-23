import type { IFeeds, IMessageIPFSWithCID, ParsedResponseType, PushAPI, Rules } from '@pushprotocol/restapi';
import { Bytes, TypedDataDomain, TypedDataField, providers } from 'ethers';
import type { ReactElement } from 'react';
import type { ENV } from '../config';

export interface IMessageIPFS {
  cid?: string;
  chatId?: string;
  event?: string;
  from?: string;
  message?: IMessage;
  meta?: any;
  origin?: string;
  reference?: string;
  to?: string[];
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
  encryptedSecret: string | null;
  icon?: ReactElement<string | any>;
}

interface IMessage {
  content: string | undefined;
  type: string | undefined;
}

export interface AccountEnvOptionsType {
  env?: ENV;
  account: string;
  signer: SignerType;
  user: PushAPI;
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
  signMessage: (args: { message: any; account: any; [key: string]: any }) => Promise<`0x${string}`>;
  account: { [key: string]: any };
  privateKey?: string;
  provider?: any;
};

export type SignerType = ethersV5SignerType | ethersV6SignerType | viemSignerType;

export type ParsedNotificationType = ParsedResponseType & {
  channel: string;
};

export type NotificationFeedsType = { [key: string]: ParsedNotificationType };
export type ChatFeedsType = { [key: string]: IFeeds };
export interface Web3NameListType {
  [key: string]: string;
}
export const PUSH_TABS = {
  CHATS: 'CHATS',
  APP_NOTIFICATIONS: 'APP_NOTIFICATIONS',
} as const;

export const SOCKET_TYPE = {
  CHAT: 'chat',
  NOTIFICATION: 'notification',
} as const;

export const PUSH_SUB_TABS = {
  REQUESTS: 'REQUESTS',
  SPAM: 'SPAM',
} as const;

export const LOCAL_STORAGE_KEYS = {
  CHATS: 'CHATS',
} as const;

export const SIDEBAR_PLACEHOLDER_KEYS = {
  CHAT: 'CHAT',
  SEARCH: 'SEARCH',
  NOTIFICATION: 'NOTIFICATION',
  NEW_CHAT: 'NEW_CHAT',
} as const;

export type SidebarPlaceholderKeys = typeof SIDEBAR_PLACEHOLDER_KEYS[keyof typeof SIDEBAR_PLACEHOLDER_KEYS];

export type LocalStorageKeys = typeof LOCAL_STORAGE_KEYS[keyof typeof LOCAL_STORAGE_KEYS];
export type PushTabs = typeof PUSH_TABS[keyof typeof PUSH_TABS];
export type PushSubTabs = typeof PUSH_SUB_TABS[keyof typeof PUSH_SUB_TABS];
export type SocketType = typeof SOCKET_TYPE[keyof typeof SOCKET_TYPE];

export interface FileMessageContent {
  content: string;
  name: string;
  type: string;
  size: number;
}
export type Messagetype = {
  messages: IMessageIPFS[];
  lastThreadHash: string | null;
};

export interface IGroup {
  members: {
    wallet: string;
    publicKey: string;
    isAdmin: boolean;
    image: string;
  }[];
  pendingMembers: {
    wallet: string;
    publicKey: string;
    isAdmin: boolean;
    image: string;
  }[];
  contractAddressERC20: string | null;
  numberOfERC20: number;
  contractAddressNFT: string | null;
  numberOfNFTTokens: number;
  verificationProof: string;
  groupImage: string | null;
  groupName: string;
  isPublic: boolean;
  groupDescription: string | null;
  groupCreator: string;
  chatId: string;
  groupType?: string | undefined;
  rules?: Rules | null;
}

export const MODAL_BACKGROUND_TYPE = {
  OVERLAY: 'OVERLAY',
  BLUR: 'BLUR',
  TRANSPARENT: 'TRANSPARENT',
} as const;

export type ModalBackgroundType = keyof typeof MODAL_BACKGROUND_TYPE;

export const MODAL_POSITION_TYPE = {
  RELATIVE: 'RELATIVE',
  GLOBAL: 'GLOBAL',
} as const;

export type ModalPositionType = keyof typeof MODAL_POSITION_TYPE;
export interface IFrameButton {
  index: string;
  content: string;
  action?: string;
  target?: string;
  post_url?: string;
}
export interface FrameDetails {
  version: string | null;
  image: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogType: string | null;
  ogImage: string | null;
  siteURL: string | null;
  postURL: string | null;
  buttons: IFrameButton[];
  inputText?: string | null;
  state?: string | null;
  ofProtocolIdentifier?: string | null;
}

export interface IFrame {
  isValidFrame: boolean;
  frameType: string;
  frameDetails?: FrameDetails;
  message?: string;
}

export interface IReactionsForChatMessages {
  [key: string]: IMessageIPFSWithCID[]; // key is the message CID, value is an array of reactions
}

export type WalletType = {
  name: string;
  url: string;
};

export type AppMetaDataType = {
  name: string;
  logo: string;
  icon: string;
  description: string;
  recommendedInjectedWallets: WalletType[];
};
export type ChainType = {
  id: string; // Assuming all IDs are in hexadecimal string format
  token: string;
  label: string;
  rpcUrl: string;
};
