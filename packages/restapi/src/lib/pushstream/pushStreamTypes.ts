import { ENV } from "../constants";
import { Rules } from "../types";

export type PushStreamInitializeProps = {
  listen: string[];
  filter?: {
    channels?: string[];
    chats?: string[];
  };
  connection?: {
    auto?: boolean;
    retries?: number;
  };
  raw?: boolean;
  env: ENV;
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

type Origin = 'other' | 'self';

export interface Meta {
  name: string;
  description: string;
  image: string;
  owner: string;
  members: string[];
  admins: string[];
  pending: string[];
  private: boolean;
  rules: Rules;
}

export interface GroupEventRawData {
  verificationProof: string;
}

export interface CreateGroupEvent {
  event: 'createGroup';
  origin: Origin;
  timestamp: string;
  chatId: string;
  from: string;
  meta: Meta;
  raw?: GroupEventRawData;
}

export interface UpdateGroupEvent {
  event: 'updateGroup';
  origin: Origin;
  timestamp: string;
  chatId: string;
  from: string;
  meta: Meta;
  raw?: GroupEventRawData;
}

export interface MessageEvent {
  event: 'message';
  origin: 'other' | 'self';
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
  raw?: MessageRawData;
}

export interface MessageRawData {
  fromCAIP10: string;
  toCAIP10: string;
  fromDID: string;
  toDID: string;
  messageObj: string;
  messageContent: string;
  messageType: string;
  timestamp: number;
  encType: string;
  encryptedSecret: string;
  signature: string;
  sigType: string;
  verificationProof: string;
  link: string;
  cid: string;
  chatId: string;
}