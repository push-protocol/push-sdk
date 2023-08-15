import type { IMessageIPFS } from '@pushprotocol/restapi';
import { IChatTheme } from "./theme";
import { IGroup } from '../../types'

export interface IMessageListProps {
  conversationHash: string;
  limit?: number;
}

export interface TwitterFeedReturnType {
  tweetId: string;
  messageType: string;
}

export type IMessagePayload = IMessageIPFS;

export const CHAT_THEME_OPTIONS = {
  LIGHT: 'light',
  DARK: 'dark',
} as const;


export type GIFType = {
  url: string;
  width: number;
  height: number;
};

export interface TypeBarProps {
  chatId: string;
  Emoji?: boolean;
  GIF?: boolean;
  File?: boolean;
  Image?: boolean;
}

export type UpdateGroupType = {
  groupInfo: IGroup,
  connectedUser: User,
  adminList: Array<string>,
  memberList: Array<string>,
}

export type MemberListContainerType = {
  key?: number;
  memberData: User;
  handleMemberList: (member: User) => void;
  handleMembers?: (value: User[]) => void;
  lightIcon: any;
  darkIcon: any;
  memberList?: any;
};

export interface WalletProfileContainerProps {
  id?: any;
  background?: any;
  border?: any;

};

export interface MessageIPFS {
  fromCAIP10: string
  toCAIP10: string
  fromDID: string
  toDID: string
  messageType: string
  messageContent: string
  signature: string
  sigType: string
  link: string | null
  timestamp?: number
  encType: string
  encryptedSecret: string
}

export interface Feeds {
  chatId?: string;
  msg: MessageIPFS;
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
  groupInformation?: IGroup
}

export interface User {
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
  numMsg: number;
  allowedNumMsg: number;
  linkedListHash?: string | null;
  isAdmin?:boolean;
}

export interface ShadowedProps {
   setPosition: boolean;
};

export interface ModalButtonProps {
  memberListCount?: boolean;
  theme?: IChatTheme;
  isLoading?: boolean;
};


export {IChatTheme} from './theme';
