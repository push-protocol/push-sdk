import { ENV, MessageType, ALPHA_FEATURES, ENCRYPTION_TYPE } from './constants';
import { ChatListType } from './pushapi/pushAPITypes';
import { STREAM, VideoEventType } from './pushstream/pushStreamTypes';
import {
  ConditionType,
  GROUP_INVITER_ROLE,
  GROUP_RULES_CATEGORY,
  GROUP_RULES_PERMISSION,
  GROUP_RULES_SUB_CATEGORY,
  VideoCallStatus,
} from './types';
import { initVideoCallData } from './video';

// TODO: Change this do . type
// TODO: Add Notif type.
// TODO: Add Notif settings, boolean and slider
// TODO: Notification alias chain
const CONSTANTS = {
  ENV: ENV,
  STREAM: STREAM,
  CHAT: {
    LIST_TYPE: ChatListType,
    MESSAGE_TYPE: MessageType,
    GROUP: {
      RULES: {
        CONDITION_TYPE: ConditionType,
        CATEGORY: GROUP_RULES_CATEGORY,
        SUBCATEGORY: GROUP_RULES_SUB_CATEGORY,
        PERMISSION: GROUP_RULES_PERMISSION,
        INVITER_ROLE: GROUP_INVITER_ROLE,
      },
    },
  },
  VIDEO: {
    EVENT: VideoEventType,
    STATUS: VideoCallStatus,
    INITIAL_DATA: initVideoCallData
  },
  ALPHA_FEATURES: ALPHA_FEATURES,
  USER: { ENCRYPTION_TYPE: ENCRYPTION_TYPE },
};

export default CONSTANTS;
