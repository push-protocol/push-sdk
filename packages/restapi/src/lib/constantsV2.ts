import { ENV, MessageType } from "./constants";
import { ChatListType } from "./pushapi/pushAPITypes";
import { STREAM } from "./pushstream/pushStreamTypes";
import { ConditionType, GROUP_INVITER_ROLE, GROUP_RULES_CATEGORY, GROUP_RULES_PERMISSION, GROUP_RULES_SUB_CATEGORY } from "./types";



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
};

export default CONSTANTS;
