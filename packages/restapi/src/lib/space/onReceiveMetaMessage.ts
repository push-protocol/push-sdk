import { LiveSpaceData } from '../types';
import type Space from './Space';

export interface OnReceiveMetaMessageType {
  receivedLiveSpaceData: LiveSpaceData;
}

export async function onReceiveMetaMessage(
  this: Space,
  options: OnReceiveMetaMessageType
) {
  const { receivedLiveSpaceData } = options || {};

  this.setSpaceSpecificData(() => ({
    ...this.spaceSpecificData,
    liveSpaceData: receivedLiveSpaceData,
  }));
}
