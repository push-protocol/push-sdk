/**
 * This file defines the type for message property for a Push Chat message
 */
import { MessageType } from '../constants';

export enum META_ACTION {
  /**
   * DEFAULT GROUP ACTIONS
   */
  CREATE_GROUP = 1,
  ADD_MEMBER = 2,
  REMOVE_MEMBER = 3,
  PROMOTE_TO_ADMIN = 4,
  DEMOTE_FROM_ADMIN = 5,
  /**
   * SHARED ACTIONS
   */
  CHANGE_IMAGE_OR_DESC = 6,
  CHANGE_META = 7,
  /**
   * SPACES ACTIONS
   */
  CREATE_SPACE = 8,
  ADD_LISTENER = 9,
  REMOVE_LISTENER = 10,
  PROMOTE_TO_SPEAKER = 11,
  DEMOTE_FROM_SPEARKER = 12,
  PROMOTE_TO_COHOST = 13,
  DEMOTE_FROM_COHOST = 14,
  USER_INTERACTION = 15, // For MIC_ON | MIC_OFF | RAISE_HAND | EMOJI REACTION | or any other user activity
  ADD_SPEAKER = 16,
  REMOVE_SPEAKER = 17
}

export enum REACTION_TYPE {
  THUMBS_UP,
  THUMBS_DOWN,
  HEART,
  CLAP,
  LAUGHING_FACE,
  SAD_FACE,
  ANGRY_FACE,
  SURPRISED_FACE,
  CLAPPING_HANDS,
  FIRE,
}

// Create a mapping object that associates reaction types with their Unicode escape sequences
export const REACTION_SYMBOL: Record<REACTION_TYPE, string> = {
  [REACTION_TYPE.THUMBS_UP]: '\u{1F44D}',
  [REACTION_TYPE.THUMBS_DOWN]: '\u{1F44E}',
  [REACTION_TYPE.HEART]: '\u{2764}\u{FE0F}',
  [REACTION_TYPE.CLAP]: '\u{1F44F}',
  [REACTION_TYPE.LAUGHING_FACE]: '\u{1F602}',
  [REACTION_TYPE.SAD_FACE]: '\u{1F622}',
  [REACTION_TYPE.ANGRY_FACE]: '\u{1F621}',
  [REACTION_TYPE.SURPRISED_FACE]: '\u{1F632}',
  [REACTION_TYPE.CLAPPING_HANDS]: '\u{1F44F}\u{1F44F}',
  [REACTION_TYPE.FIRE]: '\u{1F525}',
};

export interface BaseMessage<T> {
  type: T;
  content: string;
}

export interface MetaMessage extends BaseMessage<MessageType.META> {
  action: META_ACTION;
  info: {
    affected: string[];
    arbitrary?: {
      [key: string]: any;
    };
  };
}

export interface ReactionMessage extends BaseMessage<MessageType.REACTION> {
  action: REACTION_TYPE;
  reference?: string | null;
}

export type BaseMessageTypes =
  | MessageType.TEXT
  | MessageType.IMAGE
  | MessageType.FILE
  | MessageType.MEDIA_EMBED
  | MessageType.GIF;

export type Message =
  | BaseMessage<BaseMessageTypes>
  | MetaMessage
  | ReactionMessage;

/**
 * @deprecated
 */
export type MessageObj =
  | Omit<BaseMessage<BaseMessageTypes>, 'type'>
  | Omit<MetaMessage, 'type'>
  | Omit<ReactionMessage, 'type'>;
