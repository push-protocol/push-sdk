import { ChatStatus, GroupAccess, IFeeds, MessageObj, Rules } from '../types';
import { IProfileData } from './iprofile';

export interface IGroupProfile {
  name: string | null;
  desc: string | null;
  image: string | null;
}

export interface ChatMessageResponseV2 {
  timestamp: string;
  chatId: string;
  from: {
    wallet: string;
    profile: IProfileData;
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
    decrypted: boolean;
    group: {
      exist: boolean;
      profile: IGroupProfile;
    } | null;
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

export interface ChatMessagesListResponseV2 {
  messages: ChatMessageResponseV2[];
}

export interface ISendMessageResponseV2 {
  timestamp: string;
  chatId: string;
  reference: string;
  raw?: {
    msgVerificationProof: string;
  };
}

export interface GroupResponseV2 {
  group: {
    profile: IGroupProfile;
    rules?: Rules | null;
    public: boolean;
    type: string;
    creator: string;
    config: {
      meta: string | null;
      scheduleAt: Date | null;
      scheduleEnd: Date | null;
      status: ChatStatus | null;
    };
  };
  chatId: string;
  raw?: {
    verificationProof?: string | null;
    profileVerificationProof?: string | null;
    configVerificationProof?: string | null;
  };
}
export interface GroupAccessResponseV2 extends GroupAccess {
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
  profile: IProfileData;
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

export interface UserBlockedResponseV2 {
  blocked: boolean;
  raw?: {
    actionVerificationProof?: string | null;
  };
}
export interface UserUnblockedResponseV2 {
  unblocked: boolean;
  raw?: {
    actionVerificationProof?: string | null;
  };
}

export interface ChatRejectionResponseV2 {
  rejected: boolean;
  raw?: {
    actionVerificationProof?: string | null;
  };
}

export interface ChatAcceptResponseV2 {
  accepted: true;
  raw?: {
    actionVerificationProof?: string | null;
  };
}

export interface GroupRejectResponseV2 {
  rejected: boolean;
  raw?: {
    actionVerificationProof?: string | null;
  };
}

export interface GroupLeaveResponseV2 {
  left: boolean;
  raw?: {
    actionVerificationProof?: string | null;
  };
}

export interface GroupJoinResponseV2 {
  joined: boolean;
  raw?: {
    actionVerificationProof?: string | null;
  };
}

export interface GroupAddResponseV2 {
  added: boolean;
  raw?: {
    actionVerificationProof?: string | null;
  };
}

export interface GroupRemoveResponseV2 {
  removed: boolean;
  raw?: {
    actionVerificationProof?: string | null;
  };
}

export interface GroupModifyResponseV2 {
  modified: boolean;
  raw?: {
    actionVerificationProof?: string | null;
  };
}
