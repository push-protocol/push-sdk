import Constants, { ENV } from '../constants';
import { ChatStatus, ProgressHookType, Rules, SignerType } from '../types';

export enum ChatListType {
  CHATS = 'CHATS',
  REQUESTS = 'REQUESTS',
}
export interface PushAPIInitializeProps {
  env?: ENV;
  progressHook?: (progress: ProgressHookType) => void;
  account?: string | null;
  version?: typeof Constants.ENC_TYPE_V1 | typeof Constants.ENC_TYPE_V3;
  versionMeta?: { NFTPGP_V1?: { password: string } };
  autoUpgrade?: boolean;
  origin?: string;
  alpha?: {
    feature: string[];
  };
}

export interface GroupCreationOptions {
  description?: string;
  image?: string;
  members?: string[];
  admins?: string[];
  private?: boolean;
  rules?: Rules | null;
}

export interface ManageGroupOptions {
  role: 'ADMIN' | 'MEMBER';
  accounts: string[];
}

export interface RemoveFromGroupOptions {
  role?: 'ADMIN' | 'MEMBER';
  accounts: string[];
}

export interface GetGroupParticipantsOptions {
  page?: number;
  limit?: number;
  filter?: {
    pending?: boolean;
    role?: string;
  };
}

export interface GroupUpdateOptions {
  name?: string;
  description?: string;
  image?: string;
  scheduleAt?: Date | null;
  scheduleEnd?: Date | null;
  status?: ChatStatus | null;
  meta?: string | null;
  rules?: Rules | null;
}

export interface InfoOptions {
  overrideAccount?: string;
}


export interface ParticipantStatus {
  pending: boolean;
  role: 'ADMIN' | 'MEMBER';
  participant: boolean;
}

export interface VideoInitializeOptions {
  /*
    - If the signer and decryptedPgpPvtKey were not provided during the initialization of the PushAPI class,
    - They can be provided when initializing the video.
  */
  signer?: SignerType;
  decryptedPgpPvtKey?: string;
  media: {
    video?: boolean;
    audio?: boolean;
  };
  stream?: MediaStream;
}
