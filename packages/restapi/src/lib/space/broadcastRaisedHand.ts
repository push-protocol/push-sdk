import { produce } from 'immer';
import sendLiveSpaceData from './helpers/sendLiveSpaceData';
import { META_ACTION } from '../types/messageObjectTypes';
import { pCAIP10ToWallet } from '../helpers';

import type Space from './Space';

export interface BroadcastRaisedHandType {
  promoteeAddress: string;
}

export async function broadcastRaisedHand(
  this: Space,
  options: BroadcastRaisedHandType
) {
  const { promoteeAddress } = options || {};

  console.log('BROADCAST RAISE HAND', options);

  // update live space info
  const updatedLiveSpaceData = produce(
    this.spaceSpecificData.liveSpaceData,
    (draft) => {
      const listenerIndex =
        this.spaceSpecificData.liveSpaceData.listeners.findIndex(
          (listener) =>
            pCAIP10ToWallet(listener.address) ===
            pCAIP10ToWallet(promoteeAddress)
        );
      if (listenerIndex !== -1)
        draft.listeners[listenerIndex].handRaised = true;
    }
  );
  this.setSpaceSpecificData(() => ({
    ...this.spaceSpecificData,
    liveSpaceData: updatedLiveSpaceData,
  }));
  await sendLiveSpaceData({
    liveSpaceData: updatedLiveSpaceData,
    pgpPrivateKey: this.pgpPrivateKey,
    env: this.env,
    spaceId: this.spaceSpecificData.spaceId,
    signer: this.signer,
    action: META_ACTION.USER_INTERACTION,
  });
}
