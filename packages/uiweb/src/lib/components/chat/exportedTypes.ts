import type {  IMessageIPFS } from '@pushprotocol/restapi';

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

export type ChatThemeOptions = (typeof CHAT_THEME_OPTIONS)[keyof typeof CHAT_THEME_OPTIONS];
export {IChatTheme} from './theme';
