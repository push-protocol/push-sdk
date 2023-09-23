import { ENV } from "../constants";
import { Rules } from "../types";

export type PushStreamInitializeProps = {
  listen?: string[];
  filter?: {
    channels?: string[];
    chats?: string[];
  };
  connection?: {
    auto?: boolean;
    retries?: number;
  };
  raw?: boolean;
  env?: ENV;
};

export enum STREAM {
  CONNECT = 'STREAM.CONNECT',
  PROFILE = 'STREAM.PROFILE',
  ENCRYPTION = 'STREAM.ENCRYPTION',
  NOTIF = 'STREAM.NOTIF',
  NOTIF_OPS = 'STREAM.NOTIF_OPS',
  CHAT = 'STREAM.CHAT',
  CHAT_OPS = 'STREAM.CHAT_OPS',
  DISCONNECT = 'STREAM.DISCONNECT',
}

export enum MessageOrigin {
  Other = 'other',
  Self = 'self',
}

export enum MessageEventType {
  Message = 'message',
  Request = 'request',
  Accept = 'accept',
  Reject = 'reject',
}

export enum GroupEventType {
  CreateGroup = 'createGroup',
  UpdateGroup = 'updateGroup',
  JoinGroup = 'joinGroup',
  LeaveGroup = 'leaveGroup',
  Remove = 'remove',
}

export interface Profile {
  image: string;
  publicKey: string;
}

export interface Member {
  address: string;
  profile: Profile;
}

export interface Pending {
  members: Member[];
  admins: Member[];
}

export interface GroupMeta {
  name: string;
  description: string;
  image: string;
  owner: string;
  members: Member[];
  admins: Member[];
  pending: Pending;
  private: boolean;
  rules: Rules;
}

export interface GroupEventRawData {
  verificationProof: string;
}

export interface GroupEventBase {
  origin: MessageOrigin;
  timestamp: string;
  chatId: string;
  from: string;
  meta: GroupMeta;
  raw?: GroupEventRawData;
  event: GroupEventType;
}

export interface CreateGroupEvent extends GroupEventBase {
  event: GroupEventType.CreateGroup;
}

export interface UpdateGroupEvent extends GroupEventBase {
  event: GroupEventType.UpdateGroup;
}

export interface GroupMemberEventBase {
  event: GroupEventType;
  origin: MessageOrigin;
  timestamp: string;
  chatId: string;
  from: string;
  to: string[];
  raw?: GroupEventRawData;
}

export interface JoinGroupEvent extends GroupMemberEventBase {
  event: GroupEventType.JoinGroup;
}

export interface LeaveGroupEvent extends GroupMemberEventBase {
  event: GroupEventType.LeaveGroup;
}

export interface MessageEvent {
  event: MessageEventType;
  origin: MessageOrigin;
  timestamp: string;
  chatId: string;
  from: string;
  to: string[];
  message: {
    type: string;
    content: string;
  };
  meta: {
    group: boolean;
  };
  reference: string;
  raw?: MessageRawData;
}

export interface MessageRawData {
  fromCAIP10: string;
  toCAIP10: string;
  fromDID: string;
  toDID: string;
  encType: string;
  encryptedSecret: string;
  signature: string;
  sigType: string;
  verificationProof: string;
  previousReference: string;
}