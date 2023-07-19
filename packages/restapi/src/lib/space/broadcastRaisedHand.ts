import { produce } from 'immer';
import type Space from './Space';
import getLiveSpaceData from './helpers/getLiveSpaceData';
import sendLiveSpaceData from './helpers/sendLiveSpaceData';
import { META_ACTION } from '../types/metaTypes';

export interface BroadcastRaisedHandType {
  promoteeAddress: string;
}

export async function broadcastRaisedHand(
  this: Space,
  options: BroadcastRaisedHandType
) {
  const { promoteeAddress } = options || {};

  // update live space info
  const oldLiveSpaceData = await getLiveSpaceData({
    localAddress: this.data.local.address,
    pgpPrivateKey: this.pgpPrivateKey,
    env: this.env,
    spaceId: this.spaceSpecificData.spaceId,
  });
  const updatedLiveSpaceData = produce(oldLiveSpaceData, (draft) => {
    const listnerIndex = draft.listeners.findIndex(listner => listner.address === promoteeAddress);
    draft.listeners[listnerIndex].handRaised = true;
  });
  await sendLiveSpaceData({
    liveSpaceData: updatedLiveSpaceData,
    pgpPrivateKey: this.pgpPrivateKey,
    env: this.env,
    spaceId: this.spaceSpecificData.spaceId,
    signer: this.signer,
    action: META_ACTION.USER_INTERACTION,
  });
  this.setSpaceSpecificData(() => ({
    ...this.spaceSpecificData,
    liveSpaceData: updatedLiveSpaceData,
  }));
}
