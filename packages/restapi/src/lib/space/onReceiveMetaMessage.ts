import { MessageType } from '../constants';
import { IMessageIPFS, LiveSpaceData } from '../types';
import { META_MESSAGE_OBJECT } from '../types/messageObjectTypes';
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
    !(receivedMetaMessage?.messageObj as META_MESSAGE_OBJECT)?.info?.arbitrary
  ) {
    return;
  }

  const receivedLiveSpaceData = (
    receivedMetaMessage.messageObj as META_MESSAGE_OBJECT
  ).info.arbitrary as LiveSpaceData;

  console.log('RECEIVED LIVE SPACE DATA', receivedLiveSpaceData);

  this.setSpaceSpecificData(() => ({
    ...this.spaceSpecificData,
    liveSpaceData: receivedLiveSpaceData,
  }));
}
