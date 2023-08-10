import type { IMessageIPFS } from '@pushprotocol/restapi';

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
  conversationId: string;
  Emoji?: boolean;
  GIF?: boolean;
  File?: boolean;
  Image?: boolean;
}

export interface SendMessageParams {
  message: string;
  receiver: string;
  messageType?: 'Text' | 'Image' | 'File' | 'GIF' | 'MediaEmbed';
}
export {IChatTheme} from './theme';
