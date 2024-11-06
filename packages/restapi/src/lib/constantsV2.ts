import { ALPHA_FEATURES, ENCRYPTION_TYPE, ENV, MessageType } from './constants';
import {
  ChannelListOrderType,
  ChannelListSortType,
  ChannelListType,
} from './pushNotification/PushNotificationTypes';
import { ChatListType } from './pushapi/pushAPITypes';
import {
  STREAM,
  SpaceEventType,
  VideoEventType,
} from './pushstream/pushStreamTypes';
import { initSpaceData } from './space';
import {
  ConditionType,
  GROUP_INVITER_ROLE,
  GROUP_RULES_CATEGORY,
  GROUP_RULES_PERMISSION,
  GROUP_RULES_SUB_CATEGORY,
  NotifictaionType,
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
    INITIAL_DATA: initVideoCallData,
  },
  SPACE: {
    EVENT: SpaceEventType,
    INITIAL_DATA: initSpaceData,
  },
  ALPHA_FEATURES: ALPHA_FEATURES,
  USER: { ENCRYPTION_TYPE: ENCRYPTION_TYPE },
  NOTIFICATION: {
    TYPE: NotifictaionType,
    CHANNEL: {
      LIST_TYPE: ChannelListType,
    },
  },
  FILTER: {
    CHANNEL_LIST: {
      SORT: ChannelListSortType,
      ORDER: ChannelListOrderType,
    },
    NOTIFICATION_TYPE: NotifictaionType,
    TAGS: {
      USER: 'USER',
      PUSH: 'PUSH',
      ALL: '*',
    },
  },
};

export default CONSTANTS;
