import { produce } from 'immer';
import type Space from './Space';
import getLiveSpaceData from './helpers/getLiveSpaceData';
import sendLiveSpaceData from './helpers/sendLiveSpaceData';
import { META_ACTION } from '../types/messageTypes';
import { pCAIP10ToWallet } from '../helpers';

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
  const oldLiveSpaceData = await getLiveSpaceData({
    localAddress: this.data.local.address,
    pgpPrivateKey: this.pgpPrivateKey,
    env: this.env,
    spaceId: this.spaceSpecificData.spaceId,
  });
  const updatedLiveSpaceData = produce(oldLiveSpaceData, (draft) => {
    const listnerIndex = draft.listeners.findIndex(
      (listner) => listner.address === pCAIP10ToWallet(promoteeAddress)
    );
    if (listnerIndex > -1) draft.listeners[listnerIndex].handRaised = false;
  });
  await sendLiveSpaceData({
    liveSpaceData: updatedLiveSpaceData,
    pgpPrivateKey: this.pgpPrivateKey,
    env: this.env,
    spaceId: this.spaceSpecificData.spaceId,
    signer: this.signer,
    action: META_ACTION.USER_INTERACTION, // TODO: Add a reject request type
  });
  this.setSpaceSpecificData(() => ({
    ...this.spaceSpecificData,
    liveSpaceData: updatedLiveSpaceData,
  }));
}
