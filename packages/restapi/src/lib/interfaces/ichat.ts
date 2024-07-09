import { ChatStatus, GroupAccess, IFeeds, MessageObj, Rules } from '../types';
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
    content: MessageObj['content'];
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

export interface ISendMessageResponseV2 {
  timestamp: string;
  chatId: string;
  reference: string;
  raw?: {
    msgVerificationProof: string;
  };
}

export interface IGroupResponseV2 {
  group: {
    profile: IGroupProfile;
    rules?: Rules | null;
    public: boolean;
    type: string;
    creator: string;
  };
  config: {
    meta: string | null;
    scheduleAt: Date | null;
    scheduleEnd: Date | null;
    status: ChatStatus | null;
  };
  chatId: string;
  raw?: {
    verificationProof?: string | null;
    profileVerificationProof?: string | null;
    configVerificationProof?: string | null;
  };
}
export interface IGroupAccessResponseV2 extends GroupAccess {
  raw?: {
    verificationProof?: string | null;
    profileVerificationProof?: string | null;
    configVerificationProof?: string | null;
  };
}

export interface ChatMemberProfileV2 {
  did: string;
  wallets: string;
  origin?: string | null;
  profile: IUserProfile;
  publicKey: string | null;
  config: {
    blockedUsers: string[] | null;
  };
  raw?: {
    verificationProof: string;
    profileVerificationProof?: string | null;
    configVerificationProof?: string | null;
  };
}

export interface IGroupParticipantsResponseV2 {
  members: ChatMemberProfileV2[];
}

export interface GroupActionResponse {
  success: boolean;
  raw?: {
    actionVerificationProof?: string | null;
  };
}

export interface ChatActionResponse {
  success: boolean;
  raw?: {
    actionVerificationProof?: string | null;
  };
}
