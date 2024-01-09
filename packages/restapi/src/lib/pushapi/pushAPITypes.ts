import Constants, { ENV } from '../constants';
import {
  ChatStatus,
  ProgressHookType,
  Rules,
  SpaceData,
  SpaceRules,
} from '../types';

export enum ChatListType {
  CHATS = 'CHATS',
  REQUESTS = 'REQUESTS',
}

export enum SpaceListType {
  SPACES = 'SPACES',
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

export interface ManageSpaceOptions {
  role: 'SPEAKER' | 'LISTENER';
  accounts: string[];
}

export interface RemoveFromSpaceOptions {
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

export interface SpaceUpdateOptions {
  name?: string;
  description?: string;
  image?: string;
  scheduleAt?: Date | null;
  scheduleEnd?: Date | null;
  status?: ChatStatus | null;
  meta?: string | null;
  rules?: SpaceRules | null;
}

export interface InfoOptions {
  overrideAccount?: string;
}

export interface SpaceCreationOptions {
  description: string;
  image: string;
  participants: {
    speakers: string[];
    listeners: string[];
  };
  schedule: {
    start: Date;
    end?: Date;
  };
  rules?: SpaceRules;
  private: boolean;
}

export interface SpaceQueryOptions {
  page: number;
  limit: number;
}

export interface ParticipantStatus {
  pending: boolean;
  role: 'admin' | 'member';
  participant: boolean;
}

export interface SpaceParticipantStatus {
  pending: boolean;
  role: 'SPEAKER' | 'LISTENER';
  participant: boolean;
}

export interface SpaceInitializeOptions {
  spaceId: string;
  setSpaceData: (fn: (data: SpaceData) => SpaceData) => void;
}
