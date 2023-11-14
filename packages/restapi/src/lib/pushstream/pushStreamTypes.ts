import { Rules } from "../types";
import Constants, { ENV } from '../constants';

export type PushStreamInitializeProps = {
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
  overrideAccount?: string;
};

export enum STREAM {
  PROFILE = 'STREAM.PROFILE',
  ENCRYPTION = 'STREAM.ENCRYPTION',
  NOTIF = 'STREAM.NOTIF',
  NOTIF_OPS = 'STREAM.NOTIF_OPS',
  CHAT = 'STREAM.CHAT',
  CHAT_OPS = 'STREAM.CHAT_OPS',
  CONNECT = 'STREAM.CONNECT',
  DISCONNECT = 'STREAM.DISCONNECT',
}

export enum NotificationEventType {
  INBOX = 'notification.inbox',
  SPAM = 'notification.spam',
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

export enum ProposedEventNames {
  Message = 'chat.message',
  Request = 'chat.request',
  Accept = 'chat.accept',
  Reject = 'chat.reject',
  LeaveGroup = 'chat.group.participant.leave',
  JoinGroup = 'chat.group.participant.join',
  CreateGroup = 'chat.group.create',
  UpdateGroup = 'chat.group.update',
  Remove = 'chat.group.participant.remove',
}


export interface Profile {
  image: string;
  publicKey: string;
}

export interface GroupMember {
  address: string;
  profile: Profile;
}

export interface Pending {
  members: GroupMember[];
  admins: GroupMember[];
}

export interface GroupMeta {
  name: string;
  description: string;
  image: string;
  owner: string;
  members: GroupMember[];
  admins: GroupMember[];
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
  event: GroupEventType | MessageEventType;
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

export interface RequestEvent extends GroupMemberEventBase {
  event: MessageEventType.Request;
  meta: {
    group: boolean;
  };
}

export interface RemoveEvent extends GroupMemberEventBase {
  event: GroupEventType.Remove;
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

export const NOTIFICATION = {
  TYPE: {
    BROADCAST: 1,
    TARGETTED: 3,
    SUBSET: 4,
  },
} as const;

export type NotificationType = keyof typeof NOTIFICATION.TYPE;



export interface NotificationEvent {
  event: NotificationEventType;
  origin: 'other' | 'self';
  timestamp: string;
  from: string;
  to: string[];
  notifID: string;
  channel: {
    name: string;
    icon: string;
    url: string;
  };
  meta: {
    type: string;
  };
  message: {
    notification: {
      title: string;
      body: string;
    };
    payload?: {
      title?: string;
      body?: string;
      cta?: string;
      embed?: string;
      meta?: {
        domain?: string;
        type: string;
        data: string;
      };
    };
  };
  config?: {
    expiry?: number;
    silent?: boolean;
    hidden?: boolean;
  };
  advanced?: {
    chatid?: string;
  };
  source: string;
  raw?: {
    verificationProof: string;
  };
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