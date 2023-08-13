import type { IMessageIPFS } from '@pushprotocol/restapi';

export interface IMessageListProps {
  conversationHash: string;
  limit?: number;
  isConnected?: boolean;
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
  isConnected?: boolean;
}

export { IChatTheme } from './theme';
