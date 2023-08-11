import type { IMessageIPFS } from '@pushprotocol/restapi';

export interface IMessageListProps {
  chatId: string;
  limit?: number;
}

export interface IMessageContainerProps {
  typebar?: boolean;
  messageList?: boolean;
  profile?: boolean; //name needs to change
  chatId: string; //need confirmation on this
  limit?: number;
  emoji?: boolean;
  gif?: boolean;
  file?: boolean;
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
  emoji?: boolean;
  gif?: boolean;
  file?: boolean;
}

export { IChatTheme } from './theme';
