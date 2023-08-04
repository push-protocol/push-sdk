import { IMessageIPFS } from "../../types";

export interface TwitterFeedReturnType {
    tweetId: string;
    messageType: string;
}

export type IMessagePayload = IMessageIPFS;