/**
 * This file defines the type for meta property for a Push Chat message
 */

const enum META_ACTION {
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
}

export type META_MESSAGE_META = {
  action: META_ACTION;
  info: {
    affected: string[];
    arbitrary?: {
      [key: string]: any;
    };
  };
};

// TODO
// export type REPLY_MESSAGE_META = {};
// export type COMPOSITE_MESSAGE_META = {};
// export type PAYMENT_MESSAGE_META = {};
