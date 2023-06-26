import { ethers } from 'ethers';
import {
  ADDITIONAL_META_TYPE,
  IDENTITY_TYPE,
  NOTIFICATION_TYPE,
} from '../../lib/payloads/constants';
import { ENV } from '../constants';
import { EthEncryptedData } from '@metamask/eth-sig-util';

export type Env = typeof ENV[keyof typeof ENV];

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
  deprecated?: boolean; // scope only at sdk level
  deprecatedCode?: string; // scope only at sdk level
}
export interface IFeeds {
  msg: IMessageIPFS;
  did: string;
  wallets: string;
  profilePicture: string | null;
  name: string | null;
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

export interface Member {
  wallet: string;
  publicKey: string;
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
  scheduleAt?: Date | null;
  scheduleEnd?: Date | null;
  groupType: string;
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
export type ProgressHookTypeFunction = (...args: any[]) => ProgressHookType;

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

export type IMediaStream = MediaStream | null;

export enum VideoCallStatus {
  UNINITIALIZED,
  INITIALIZED,
  RECEIVED,
  CONNECTED,
  DISCONNECTED,
  RETRY_INITIALIZED,
  RETRY_RECEIVED,
}

export type PeerData = {
  stream: IMediaStream;
  audio: boolean | null;
  video: boolean | null;
  address: string;
  status: VideoCallStatus;
  retryCount: number;
};

export type VideoCallData = {
  meta: {
    chatId: string;
    initiator: {
      address: string;
      signal: any;
    };
    broadcast?: {
      livepeerInfo: any;
      hostAddress: string;
      coHostAddress: string;
    };
  };
  local: {
    stream: IMediaStream;
    audio: boolean | null;
    video: boolean | null;
    address: string;
  };
  incoming: [PeerData];
};

export type VideoCreateInputOptions = {
  video?: boolean;
  audio?: boolean;
  stream?: MediaStream; // for backend use
};

export type VideoRequestInputOptions = {
  senderAddress: string;
  recipientAddress: string;
  chatId: string;
  onReceiveMessage?: (message: string) => void;
  retry?: boolean;
};

export type VideoAcceptRequestInputOptions = {
  signalData: any;
  senderAddress: string;
  recipientAddress: string;
  chatId: string;
  onReceiveMessage?: (message: string) => void;
  retry?: boolean;
};

export type VideoConnectInputOptions = {
  signalData: any;
};

export type EnableVideoInputOptions = {
  state: boolean;
};

export type EnableAudioInputOptions = {
  state: boolean;
};
