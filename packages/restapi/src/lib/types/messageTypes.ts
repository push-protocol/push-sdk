/**
 * This file defines the type for message property for a Push Chat message
 */
import { MessageType } from '../constants';

export const CHAT = {
  META: {
    GROUP: {
      CREATE: 'CREATE_GROUP',
      MEMBER: {
        ADD: 'ADD_MEMBER',
        REMOVE: 'REMOVE_MEMBER',
        PRIVILEGE: 'ASSIGN_MEMBER_PRIVILEGE',
      },
      ADMIN: {
        PRVILEGE: 'ASSIGN_ADMIN_PRIVILEGE',
      },
      // todo: Why do we need update group when we already have profile and meta update
      UPDATE: 'UPDATE_GROUP',
      PROFILE: {
        UPDATE: 'UPDATE_GROUP_PROFILE',
      },
      // todo : this seems to be a wierd name CHAT.META.GROUP.META.UPDATE
      META: {
        UPDATE: 'UPDATE_GROUP_META',
      },
      // todo : Remove this as it comes under UserActivity now ( remove after space changes )
      USER: {
        INTERACTION: 'USER_INTERACTION',
      },
    },
    SPACE: {
      CREATE: 'CREATE_SPACE',
      LISTENER: {
        ADD: 'ADD_LISTENER',
        REMOVE: 'REMOVE_LISTENER',
        PRVILEGE: 'ASSIGN_LISTENER_PRIVILEGE',
      },
      SPEAKER: {
        PRVILEGE: 'ASSIGN_SPEAKER_PRIVILEGE',
      },
      COHOST: {
        PRVILEGE: 'ASSIGN_COHOST_PRIVILEGE',
      },
    },
  },

  REACTION: {
    THUMBSUP: '\u{1F44D}',
    THUMBSDOWN: '\u{1F44E}',
    HEART: '\u{2764}\u{FE0F}',
    CLAP: '\u{1F44F}',
    LAUGH: '\u{1F602}',
    SAD: '\u{1F622}',
    ANGRY: '\u{1F621}',
    SUPRISE: '\u{1F632}',
    FIRE: '\u{1F525}',
  },

  READ_RECEIPT: 'READ_RECEIPT',

  UA: {
    LISTENER: {
      JOIN: 'LISTENER_JOIN',
      LEAVE: 'LISTENER_LEAVE',
    },
    SPEAKER: {
      MICREQUEST: 'SPEAKER_REQUEST_MIC',
    },
  },

  INTENT: {
    ACCEPT: 'ACCEPT_INTENT',
    REJECT: 'REJECT_INTENT',
    JOIN: 'JOIN_GROUP',
    LEAVE: 'LEAVE_GROUP',
  },
};

interface BaseMessage<T> {
  type?: T;
  content: string;
}

export interface MetaMessage extends BaseMessage<`${MessageType.META}`> {
  info: {
    affected: string[];
    arbitrary?: {
      [key: string]: any;
    };
  };
}

interface ReferenceMessage
  extends BaseMessage<
    `${MessageType.REACTION}` | `${MessageType.READ_RECEIPT}`
  > {
  reference: string;
}

type BaseMessageTypes =
  | `${MessageType.TEXT}`
  | `${MessageType.IMAGE}`
  | `${MessageType.VIDEO}`
  | `${MessageType.AUDIO}`
  | `${MessageType.FILE}`
  | `${MessageType.GIF}`
  | `${MessageType.MEDIA_EMBED}`
  | `${MessageType.INTENT}`;

export type Message =
  | BaseMessage<BaseMessageTypes>
  | MetaMessage
  | ReferenceMessage;

/**
 * @deprecated
 */
export type MessageObj =
  | Omit<BaseMessage<BaseMessageTypes>, 'type'>
  | Omit<MetaMessage, 'type'>
  | Omit<ReferenceMessage, 'type'>;
