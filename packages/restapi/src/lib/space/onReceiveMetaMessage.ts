import { MessageType } from '../constants';
import { IMessageIPFS, LiveSpaceData } from '../types';
import type Space from './Space';

export interface OnReceiveMetaMessageType {
  receivedMetaMessage: IMessageIPFS;
}

export async function onReceiveMetaMessage(
  this: Space,
  options: OnReceiveMetaMessageType
) {
  const { receivedMetaMessage } = options || {};

  if (
    receivedMetaMessage.messageType !== MessageType.META ||
    typeof receivedMetaMessage.messageObj !== 'object' ||
    !receivedMetaMessage?.messageObj?.meta?.info?.arbitrary
  ) {
    return;
  }

  const receivedLiveSpaceData = receivedMetaMessage.messageObj.meta.info
    .arbitrary as LiveSpaceData;

  console.log('RECEIVED LIVE SPACE DATA', receivedLiveSpaceData);

  this.setSpaceSpecificData(() => ({
    ...this.spaceSpecificData,
    liveSpaceData: receivedLiveSpaceData,
  }));
}
