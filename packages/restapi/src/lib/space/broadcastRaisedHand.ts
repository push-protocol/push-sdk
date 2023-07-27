import { produce } from 'immer';
import type Space from './Space';
import getLiveSpaceData from './helpers/getLiveSpaceData';
import sendLiveSpaceData from './helpers/sendLiveSpaceData';
import { META_ACTION } from '../types/metaTypes';
import { pCAIP10ToWallet } from '../helpers';

export interface BroadcastRaisedHandType {
  promoteeAddress: string;
}

export async function broadcastRaisedHand(
  this: Space,
  options: BroadcastRaisedHandType
) {
  const { promoteeAddress } = options || {};

  console.log('BROADCAST RAISE HAND', promoteeAddress);

  // update live space info
  const oldLiveSpaceData = await getLiveSpaceData({
    localAddress: this.data.local.address,
    pgpPrivateKey: this.pgpPrivateKey,
    env: this.env,
    spaceId: this.spaceSpecificData.spaceId,
  });
  const updatedLiveSpaceData = produce(oldLiveSpaceData, (draft) => {
    const listenerIndex = draft.listeners.findIndex(
      (listner) =>
        pCAIP10ToWallet(listner.address) === pCAIP10ToWallet(promoteeAddress)
    );
    if (listenerIndex !== -1) draft.listeners[listenerIndex].handRaised = true;
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
