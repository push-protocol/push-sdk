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
