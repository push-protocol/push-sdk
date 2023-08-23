import { produce } from 'immer';
import sendLiveSpaceData from './helpers/sendLiveSpaceData';
import { META_ACTION } from '../types/messageObjectTypes';
import { pCAIP10ToWallet } from '../helpers';

import type Space from './Space';

export interface RejectPromotionRequestType {
  promoteeAddress: string;
}

export async function rejectPromotionRequest(
  this: Space,
  options: RejectPromotionRequestType
) {
  const { promoteeAddress } = options || {};

  // reject the promotion request
  this.disconnect({
    peerAddress: pCAIP10ToWallet(promoteeAddress),
  });

  // update live space info
  const updatedLiveSpaceData = produce(
    this.spaceSpecificData.liveSpaceData,
    (draft) => {
      const listnerIndex =
        this.spaceSpecificData.liveSpaceData.listeners.findIndex(
          (listener) => listener.address === pCAIP10ToWallet(promoteeAddress)
        );
      if (listnerIndex > -1) draft.listeners[listnerIndex].handRaised = false;
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
    action: META_ACTION.USER_INTERACTION, // TODO: Add a reject request type
  });
}
