import { isValidETHAddress } from '../../helpers';
import { VIDEO_NOTIFICATION_ACCESS_TYPE } from '../../payloads/constants';
import { VideoPeerInfo } from '../../types';

export const validatePeerInfo = (peerInfo: VideoPeerInfo) => {
  const { signal, address, meta } = peerInfo;

  if (!signal) {
    throw new Error('Invalid signal data received');
  }

  if (!isValidETHAddress(address)) {
    throw new Error('Invalid address received');
  }

  if (
    meta.rules.access.type === VIDEO_NOTIFICATION_ACCESS_TYPE.PUSH_CHAT &&
    !meta.rules.access.data.chatId
  ) {
    throw new Error('ChatId not found in meta.rules');
  }
};
