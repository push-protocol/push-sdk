import { VIDEO_NOTIFICATION_ACCESS_TYPE } from '../../payloads/constants';
import { VideoNotificationRules } from '../../types';

export const validateVideoRules = (rules: VideoNotificationRules) => {
  if (
    rules.access.type === VIDEO_NOTIFICATION_ACCESS_TYPE.PUSH_CHAT &&
    (!rules.access.data.chatId || rules.access.data.chatId === '')
  ) {
    throw new Error(
      'Invalid rules object recieved. For access as Push Chat, chatId is required!'
    );
  }
};
