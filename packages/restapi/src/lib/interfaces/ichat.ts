import { IFeeds } from '../types';
import { IUserProfile } from './iuser';

export interface IGroupProfile {
  name: string | null;
  desc: string | null;
  image: string | null;
}

export interface IChatMessage {
  timestamp: string;
  chatId: string;
  from: {
    wallet: string;
    profile: IUserProfile;
  };
  to: {
    wallet: string;
  };
  message: {
    type: string;
    content: string;
  };
  meta: {
    type: string;
    group?: {
      exist: boolean;
      profile: IGroupProfile;
    };
  };
  reference: string;
  previous: string[];
  raw?: {
    msgVerificationProof: string;
    from: {
      profileVerificationProof: string | null;
    };
  };
}

export interface IChatListResponseV2 {
  messages: IChatMessage[];
}

export type IChatListResponse = IFeeds[] | IChatListResponseV2;
