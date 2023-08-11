import { Bytes, TypedDataDomain, TypedDataField, providers } from 'ethers';
import {
  ADDITIONAL_META_TYPE,
  IDENTITY_TYPE,
  NOTIFICATION_TYPE,
  SPACE_ACCEPT_REQUEST_TYPE,
  SPACE_DISCONNECT_TYPE,
  SPACE_INVITE_ROLES,
  SPACE_REQUEST_TYPE,
} from '../../lib/payloads/constants';
import { ENV, MessageType } from '../constants';
import { EthEncryptedData } from '@metamask/eth-sig-util';
import { META_MESSAGE_META } from './metaTypes';

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
  messageObj?:
    | {
        content: string;
        meta?: META_MESSAGE_META;
      }
    | string;
  /**
   * @deprecated - Use messageObj.content instead
   */
  messageContent: string;
  verificationProof?: string;
  /**
   * @deprecated - Use verificationProof instead
   */
  signature: string;
  /**
   * @deprecated - Use verificationProof instead
   */
  sigType: string;
  link: string | null;
  timestamp?: number;
  encType: string;
  encryptedSecret: string;
  /**
   * scope only at sdk level
   */
  deprecated?: boolean;
  /**
   * scope only at sdk level
   */
  deprecatedCode?: string;
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

export interface SpaceIFeeds {
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
  spaceId?: string;
  spaceInformation?: SpaceDTO;
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

export enum ChatStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  ENDED = 'ENDED',
}

export enum ConditionType {
  PUSH = 'PUSH',
  GUILD = 'GUILD',
}

export type Data = {
  address?: string;
  comparison?: string;
  amount?: number;
};

export type Condition = {
  type: ConditionType;
  category: string;
  subcategory: string;
  data: Data;
  any?: Condition[];
  all?: Condition[];
};

export interface Rules {
  groupAccess?: {
    conditions: Condition[];
  };
  chattingAccess?: {
    conditions: Condition[];
  };
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
  groupDescription: string;
  groupCreator: string;
  chatId: string;
  scheduleAt?: Date | null;
  scheduleEnd?: Date | null;
  groupType?: string;
  status?: ChatStatus | null;
  rules?: Rules | null;
}

export interface SpaceDTO {
  members: {
    wallet: string;
    publicKey: string;
    isSpeaker: boolean;
    image: string;
  }[];
  pendingMembers: {
    wallet: string;
    publicKey: string;
    isSpeaker: boolean;
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
  spaceDescription: string;
  spaceCreator: string;
  spaceId: string;
  scheduleAt?: Date | null;
  scheduleEnd?: Date | null;
  status: ChatStatus | null;
  inviteeDetails?: { [key: string]: SPACE_INVITE_ROLES };
  rules?: Rules | null;
}

export interface Peer {
  address: string;
  emojiReactions: {
    emoji: string;
    expiresIn: string;
  } | null;
}

export interface ListenerPeer extends Peer {
  handRaised: boolean;
}

export interface AdminPeer extends Peer {
  audio: boolean | null;
}

export interface LiveSpaceData {
  host: AdminPeer;
  coHosts: AdminPeer[];
  speakers: AdminPeer[];
  listeners: ListenerPeer[];
}

export interface SpaceSpecificData extends SpaceDTO {
  liveSpaceData: LiveSpaceData;
}

export interface SpaceData extends SpaceSpecificData {
  connectionData: VideoCallData;
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

export interface ChatStartOptionsType {
  messageType: `${MessageType}`;
  messageObj: {
    content: string;
    meta?: META_MESSAGE_META;
  };
  /**
   * @deprecated - To be used for now to provide backward compatibility
   */
  messageContent: string;
  receiverAddress: string;
  connectedUser: IConnectedUser;
  env: ENV;
}

/**
 * EXPORTED ( Chat.send )
 */
export interface ChatSendOptionsType {
  messageType?: `${MessageType}`;
  messageObj?: {
    content: string;
    meta?: META_MESSAGE_META;
  };
  /**
   * @deprecated - Use messageObj.content instead
   */
  messageContent?: string;
  receiverAddress: string;
  pgpPrivateKey?: string;
  account?: string;
  signer?: SignerType;
  env?: ENV;
  /**
   * @deprecated APIkey is not needed now
   */
  apiKey?: string;
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

type ethersV5SignerType = {
  _signTypedData: (
    domain: TypedDataDomain,
    types: Record<string, Array<TypedDataField>>,
    value: Record<string, any>
  ) => Promise<string>;
  getChainId: () => Promise<number>;
  getAddress: () => Promise<string>;
  signMessage: (message: Bytes | string) => Promise<string>;
  privateKey?: string;
  provider?: providers.Provider;
};
type viemSignerType = {
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
  provider?: providers.Provider;
};

export type SignerType = ethersV5SignerType | viemSignerType;

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
  messageObj?:
    | {
        content: string;
        meta?: META_MESSAGE_META;
      }
    | string;
  /**
   * @deprecated - Use messageObj.content instead
   */
  messageContent: string;
  /**
   * @deprecated - Use verificationProof instead
   */
  signature: string;
  /**
   * @deprecated - Use VerificationProof instead
   */
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
      coHostAddress?: string;
    };
  };
  local: {
    stream: IMediaStream;
    audio: boolean | null;
    video: boolean | null;
    address: string;
  };
  incoming: PeerData[];
};

export type VideoCreateInputOptions = {
  video?: boolean;
  audio?: boolean;
  stream?: MediaStream; // for backend use
};

export type VideoRequestInputOptions = {
  senderAddress: string;
  recipientAddress: string | string[];
  chatId: string;
  onReceiveMessage?: (message: string) => void;
  retry?: boolean;
  details?: {
    type: SPACE_REQUEST_TYPE;
    data: Record<string, unknown>;
  };
};

export type VideoAcceptRequestInputOptions = {
  signalData: any;
  senderAddress: string;
  recipientAddress: string;
  chatId: string;
  onReceiveMessage?: (message: string) => void;
  retry?: boolean;
  details?: {
    type: SPACE_ACCEPT_REQUEST_TYPE;
    data: Record<string, unknown>;
  };
};

export type VideoConnectInputOptions = {
  signalData: any;
  peerAddress?: string;
};

export type VideoDisconnectOptions = {
  peerAddress: string;
  details?: {
    type: SPACE_DISCONNECT_TYPE;
    data: Record<string, unknown>;
  };
} | null;

export type EnableVideoInputOptions = {
  state: boolean;
};

export type EnableAudioInputOptions = {
  state: boolean;
};
