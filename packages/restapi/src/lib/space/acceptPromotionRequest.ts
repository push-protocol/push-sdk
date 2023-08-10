import { pCAIP10ToWallet } from '../helpers';
import {
  SPACE_ACCEPT_REQUEST_TYPE,
  SPACE_INVITE_ROLES,
} from '../payloads/constants';
import type Space from './Space';
import { addSpeakers } from './addSpeakers';
import { produce } from 'immer';
import { META_ACTION } from '../types/metaTypes';
import getLiveSpaceData from './helpers/getLiveSpaceData';
import sendLiveSpaceData from './helpers/sendLiveSpaceData';
import { AdminPeer, ListenerPeer } from '../types';

export interface AcceptPromotionRequestType {
  signalData: any;
  promoteeAddress: string;
  role: SPACE_INVITE_ROLES;
  spaceId: string;
}

export async function acceptPromotionRequest(
  this: Space,
  options: AcceptPromotionRequestType
) {
  const { signalData, promoteeAddress, spaceId, role } = options || {};

  console.log(
    'acceptPromotionRequest options',
    options,
    'local stream',
    this.data.local.stream
  );

  await addSpeakers({
    spaceId: this.spaceSpecificData.spaceId,
    signer: this.signer,
    pgpPrivateKey: this.pgpPrivateKey,
    speakers: [pCAIP10ToWallet(promoteeAddress)],
    env: this.env
  });

  const oldLiveSpaceData = await getLiveSpaceData({
    localAddress: this.data.local.address,
    pgpPrivateKey: this.pgpPrivateKey,
    env: this.env,
    spaceId: this.spaceSpecificData.spaceId,
  });

  const updatedLiveSpaceData = produce(oldLiveSpaceData, (draft) => {
    const listnerIndex = draft.listeners.findIndex((listner) => listner.address === pCAIP10ToWallet(promoteeAddress));
    if (listnerIndex >   -1) draft.listeners[listnerIndex].handRaised = false;

    const promotedListener: AdminPeer = {
      address: draft.listeners[listnerIndex].address,
      emojiReactions: draft.listeners[listnerIndex].emojiReactions,
      audio: true,
    }

    draft.listeners.splice(listnerIndex, 1);

    draft.speakers.push(promotedListener);
  });

  await sendLiveSpaceData({
    liveSpaceData: updatedLiveSpaceData,
    pgpPrivateKey: this.pgpPrivateKey,
    env: this.env,
    spaceId: this.spaceSpecificData.spaceId,
    signer: this.signer,
    action: META_ACTION.PROMOTE_TO_SPEAKER,
  });

  // accept the promotion request
  this.acceptRequest({
    signalData,
    senderAddress: this.data.local.address,
    recipientAddress: pCAIP10ToWallet(promoteeAddress),
    chatId: spaceId,
    details: {
      type: SPACE_ACCEPT_REQUEST_TYPE.ACCEPT_PROMOTION,
      data: {},
    },
  });
}
