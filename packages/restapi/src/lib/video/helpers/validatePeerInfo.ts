import { isValidETHAddress } from '../../helpers';
import { VideoPeerInfo } from '../../types';

export const validatePeerInfo = (peerInfo: VideoPeerInfo) => {
  const { signal, address, meta } = peerInfo;

  if (!signal) {
    throw new Error('Invalid signal data received');
  }

  if (!isValidETHAddress(address)) {
    throw new Error('Invalid address received');
  }

  // TODO: comparing type should be PUSH_CHAT
  if (meta.rules.access.type === '' && !meta.rules.access.data.chatId) {
    throw new Error('ChatId not found in meta.rules');
  }
};
