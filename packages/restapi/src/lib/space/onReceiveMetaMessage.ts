import { MessageType } from '../constants';
import { IMessageIPFS, LiveSpaceData } from '../types';
import { InfoMessage } from '../types/messageTypes';
import type Space from './Space';

export interface OnReceiveMetaMessageType {
  receivedMetaMessage: IMessageIPFS;
}

export function onReceiveMetaMessage(
  this: Space,
  options: OnReceiveMetaMessageType
) {
  const { receivedMetaMessage } = options || {};

  console.log('ONRECEIVEMETAMESSAGE', receivedMetaMessage);

  if (
    receivedMetaMessage.messageType !== MessageType.META ||
    typeof receivedMetaMessage.messageObj !== 'object' ||
    !(receivedMetaMessage?.messageObj as Omit<InfoMessage, 'type'>)?.info
      ?.arbitrary
  ) {
    return;
  }

  const receivedLiveSpaceData = (
    receivedMetaMessage.messageObj as Omit<InfoMessage, 'type'>
  ).info.arbitrary as LiveSpaceData;

  console.log('RECEIVED LIVE SPACE DATA', receivedLiveSpaceData);

  this.setSpaceSpecificData(() => ({
    ...this.spaceSpecificData,
    liveSpaceData: receivedLiveSpaceData,
  }));
}
