import type { GroupDTO, GroupInfoDTO, IMessageIPFS } from '@pushprotocol/restapi';
import { IGroup, ModalBackgroundType, ModalPositionType } from '../../types';
import { IChatTheme } from './theme';

export interface IChatPreviewPayload {
  chatId: string | undefined;
  chatPic: string | null;
  chatParticipant: string;
  chatGroup: boolean;
  chatTimestamp: number | undefined;
  chatMsg?: {
    messageMeta: string;
    messageType: string;
    messageContent: string | object;
  };
}

export interface IChatPreviewProps {
  chatPreviewPayload: IChatPreviewPayload;
  selected?: boolean;
  setSelected?: (chatId: string, chatParticipant: string) => void;
  badge?: {
    count?: number;
  };
  readmode?: boolean;
}
export type Group = GroupInfoDTO | GroupDTO | undefined;

export interface IChatPreviewListProps {
  overrideAccount?: string;
  listType?: 'CHATS' | 'REQUESTS';
  prefillChatPreviewList?: Array<IChatPreviewProps>;
  searchParamter?: string;
  onUnreadCountChange?: (count: number) => void;
  onChatsCountChange?: (count: number) => void;
  onChatSelected?: (chatId: string, chatParticipant: string) => void;
  onPreload?: (chats: Array<IChatPreviewPayload>) => void;
  onPaging?: (chats: Array<IChatPreviewPayload>) => void;
  onLoading?: (loadingData: { loading: boolean; preload: boolean; paging: boolean; finished: boolean }) => void;
}

export interface IChatPreviewSearchListProps {
  overrideAccount?: string;
  prefillChatPreviewList?: Array<IChatPreviewProps>;
  searchParamter?: string;
  onUnreadCountChange?: (count: number) => void;
  onChatsCountChange?: (count: number) => void;
  onChatSelected?: (chatId: string, chatParticipant: string) => void;
  onPreload?: (chats: Array<IChatPreviewPayload>) => void;
  onPaging?: (chats: Array<IChatPreviewPayload>) => void;
  onLoading?: (loadingData: { loading: boolean; preload: boolean; paging: boolean; finished: boolean }) => void;
}

export interface IChatViewListProps {
  chatId: string;
  chatFilterList?: Array<string>;
  limit?: number;
  setReplyPayload?: (payload: IMessagePayload) => void;
}

export interface IChatViewComponentProps {
  messageInput?: boolean;
  chatViewList?: boolean;
  chatFilterList?: Array<string>;
  chatProfile?: boolean; //name needs to change
  chatId?: string; //need confirmation on this
  limit?: number;
  emoji?: boolean;
  gif?: boolean;
  file?: boolean;
  handleReply?: boolean;
  isConnected?: boolean;
  autoConnect?: boolean;
  groupInfoModalBackground?: ModalBackgroundType;
  groupInfoModalPositionType?: ModalPositionType;
  verificationFailModalBackground?: ModalBackgroundType;
  verificationFailModalPosition?: ModalPositionType;
  onVerificationFail?: () => void;
  chatProfileRightHelperComponent?: React.ReactNode;
  chatProfileLeftHelperComponent?: React.ReactNode;
  welcomeComponent?: React.ReactNode;
  closeChatProfileInfoModalOnClickAway?: boolean;
}

export interface IChatProfile {
  chatId: string;
  closeChatProfileInfoModalOnClickAway?: boolean;
  groupInfoModalBackground?: ModalBackgroundType;
  groupInfoModalPositionType?: ModalPositionType;
  chatProfileRightHelperComponent?: React.ReactNode;
  chatProfileLeftHelperComponent?: React.ReactNode;
}

export interface TwitterFeedReturnType {
  tweetId: string;
  isTweet: boolean;
}

export interface IToast {
  message: string;
  status: string;
}

export type IMessagePayload = IMessageIPFS & {
  cid?: string;
  reference?: string;
};

export const CHAT_THEME_OPTIONS = {
  LIGHT: 'light',
  DARK: 'dark',
} as const;

export type GIFType = {
  url: string;
  width: number;
  height: number;
};

export interface MessageInputProps {
  chatId: string;
  emoji?: boolean;
  gif?: boolean;
  file?: boolean;
  replyPayload?: IMessagePayload | null;
  setReplyPayload?: (payload: IMessagePayload | null) => void;
  isConnected?: boolean;
  autoConnect?: boolean;
  verificationFailModalBackground?: ModalBackgroundType;
  verificationFailModalPosition?: ModalPositionType;
  onVerificationFail?: () => void;
}

export interface MessageIPFS {
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
  groupInformation?: IGroup;
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
  isAdmin?: boolean;
}

export interface CreateGroupModalProps {
  onClose: () => void;
  closeModalOnClickAway?: boolean;
  modalBackground?: ModalBackgroundType;
  modalPositionType?: ModalPositionType;
  onSuccess?: (group: GroupInfoDTO | GroupDTO | undefined) => void;
}

export interface UserProfileProps {
  updateUserProfileModalBackground?: ModalBackgroundType;
  updateUserProfileModalPositionType?: ModalPositionType;
  onUserProfileUpdateModalOpen?: (open: boolean) => void;
  closeUserProfileModalOnClickAway?: boolean;
}

export interface ModalButtonProps {
  memberListCount?: boolean;
  theme?: IChatTheme;
  isLoading?: boolean;
}

export type { IChatTheme } from './theme';

export interface ConditionData {
  operator?: string;
  type?: string;
  category?: string;
  subcategory?: string;
  data?: Record<string, any>;
}

export type ConditionArray = ConditionData[];

export enum ChatPreviewListErrorCodes {
  CHAT_PREVIEW_LIST_PRELOAD_ERROR = 'CPL-001',
  CHAT_PREVIEW_LIST_LOAD_ERROR = 'CPL-002',
  CHAT_PREVIEW_LIST_INVALID_SEARCH_ERROR = 'CPL-003',
  CHAT_PREVIEW_LIST_INSUFFICIENT_INPUT = 'CPL-004',
}

export interface IChatPreviewListError {
  code: ChatPreviewListErrorCodes;
  message: string;
}

export enum ChatPreviewSearchListErrorCodes {
  CHAT_PREVIEW_LIST_LOAD_ERROR = 'CPSL-001',
  CHAT_PREVIEW_LIST_INVALID_SEARCH_ERROR = 'CPSL-002',
  CHAT_PREVIEW_LIST_INSUFFICIENT_INPUT = 'CPSL-003',
}

export interface IChatPreviewSearchListError {
  code: ChatPreviewSearchListErrorCodes;
  message: string;
}
