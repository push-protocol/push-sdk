import { ethers } from 'ethers';
import { IDENTITY_TYPE, NOTIFICATION_TYPE } from '../../lib/payloads/constants';
import { ENV } from '../constants';
import { EthEncryptedData } from '@metamask/eth-sig-util';

// the type for the the response of the input data to be parsed
export type ApiNotificationType = {
  payload_id: number;
  channel: string;
  epoch: string;
  payload: {
    apns: {
      payload: {
        aps: {
          category: string;
          'mutable-content': number;
          'content-available': number;
        };
      };
      fcm_options: {
        image: string;
      };
    };
    data: {
      app: string;
      sid: string;
      url: string;
      acta: string;
      aimg: string;
      amsg: string;
      asub: string;
      icon: string;
      type: string;
      epoch: string;
      appbot: string;
      hidden: string;
      secret: string;
    };
    android: {
      notification: {
        icon: string;
        color: string;
        image: string;
        default_vibrate_timings: boolean;
      };
    };
    notification: {
      body: string;
      title: string;
    };
  };
  source: string;
};

// The output response from parsing a notification object
export type ParsedResponseType = {
  cta: string;
  title: string;
  message: string;
  icon: string;
  url: string;
  sid: string;
  app: string;
  image: string;
  blockchain: string;
  secret: string;
  notification: {
    title: string;
    body: string;
  };
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
    metadata?: any;
    additionalMeta?: any;
  };
  recipients?: string | string[]; // CAIP or plain ETH
  channel: string; // CAIP or plain ETH
  expiry?: number;
  hidden?: boolean;
  graph?: {
    id: string;
    counter: number;
  };
  ipfsHash?: string;
  env?: ENV;
  chatId?: string;
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
}
export interface IFeeds {
  msg: IMessageIPFS;
  did: string;
  wallets: string;
  profilePicture: string | null;
  publicKey: string | null;
  about: string | null;
  threadhash: string | null;
  intent: string | null;
  intentSentBy: string | null;
  intentTimestamp: Date;
  combinedDID: string;
  cid?: string;
  chatId?: string;
  groupInformation?: GroupDTO;
  deprecated?: boolean; // scope only at sdk level
  deprecatedCode?: string; // scope only at sdk level
}
export interface IUser {
  did: string;
  wallets: string;
  profilePicture: string | null;
  publicKey: string;
  encryptedPrivateKey: string;
  encryptionType: string;
  signature: string;
  sigType: string;
  about: string | null;
  name: string | null;
  encryptedPassword: string | null;
  nftOwner: string | null;
  numMsg: number;
  allowedNumMsg: number;
  linkedListHash?: string | null;
  nfts?: [] | null;
}

export interface Member {
  wallet: string;
  publicKey: string;
}

export enum ChatStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  ENDED = 'ENDED'
}
export interface GroupDTO {
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
}

export interface InternalGroupDTO {
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
  scheduleAt?: Date | null;
  scheduleEnd?: Date | null;
  groupType: string;
  status: ChatStatus | null;
}

export interface SpaceDTO {
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
  spaceImage: string | null;
  spaceName: string;
  isPublic: boolean;
  spaceDescription: string | null;
  spaceCreator: string;
  spaceId: string;
  scheduleAt?: Date | null;
  scheduleEnd?: Date | null;
  status: ChatStatus | null;
}

export interface Subscribers {
  itemcount: number;
  subscribers: Array<string>;
}
export interface IConnectedUser extends IUser {
  privateKey: string | null;
}

export interface IMessageIPFSWithCID extends IMessageIPFS {
  cid: string;
}

export interface AccountEnvOptionsType extends EnvOptionsType {
  /**
   * Environment variable
   */
  account: string;
}

export interface ChatOptionsType extends AccountEnvOptionsType {
  messageContent?: string;
  messageType?: 'Text' | 'Image' | 'File' | 'GIF' | 'MediaURL';
  receiverAddress: string;
  pgpPrivateKey?: string;
  connectedUser: IConnectedUser;
  /**
   * Api key is now optional
   */
  apiKey?: string;
}

export interface ChatSendOptionsType {
  messageContent?: string;
  messageType?: 'Text' | 'Image' | 'File' | 'GIF' | 'MediaURL';
  receiverAddress: string;
  pgpPrivateKey?: string;
  /**
   * Api key is now optional
   */
  apiKey?: string;
  env?: ENV;
  account?: string;
  signer?: SignerType;
}

export interface ConversationHashOptionsType extends AccountEnvOptionsType {
  conversationId: string;
}

export interface UserInfo {
  wallets: string;
  publicKey: string;
  name: string;
  image: string;
  isAdmin: boolean;
}

export type SignerType = ethers.Signer & {
  _signTypedData?: (domain: any, types: any, value: any) => Promise<string>;
  privateKey?: string;
};

export type EnvOptionsType = {
  env?: ENV;
};

export type walletType = {
  account: string | null;
  signer: SignerType | null;
};

export type encryptedPrivateKeyTypeV1 = EthEncryptedData;

export type encryptedPrivateKeyTypeV2 = {
  ciphertext: string;
  version?: string;
  salt?: string;
  nonce: string;
  preKey?: string;
  encryptedPassword?: encryptedPrivateKeyTypeV2;
};

export type encryptedPrivateKeyType = {
  version?: string;
  nonce: string;
  ephemPublicKey?: string;
  ciphertext: string;
  salt?: string;
  preKey?: string;
  encryptedPassword?: encryptedPrivateKeyTypeV2;
};

export type ProgressHookType = {
  progressId: string;
  progressTitle: string;
  progressInfo: string;
  level: 'INFO' | 'SUCCESS' | 'WARN' | 'ERROR';
};

export type MessageWithCID = {
  cid: string;
  chatId: string;
  link: string;
  fromCAIP10: string;
  toCAIP10: string;
  fromDID: string;
  toDID: string;
  messageType: string;
  messageContent: string;
  signature: string;
  sigType: string;
  timestamp?: number;
  encType: string;
  encryptedSecret: string;
  verificationProof?: string;
};
