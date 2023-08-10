import { produce } from 'immer';

import type Space from './Space';
import { addSpeakers } from './addSpeakers';
import getLiveSpaceData from './helpers/getLiveSpaceData';
import sendLiveSpaceData from './helpers/sendLiveSpaceData';

import { pCAIP10ToWallet } from '../helpers';
import {
  SPACE_ACCEPT_REQUEST_TYPE,
  SPACE_INVITE_ROLES,
} from '../payloads/constants';
import { META_ACTION } from '../types/metaTypes';
import { AdminPeer } from '../types';

export interface IAcceptPromotionRequestType {
  signalData: any;
  promoteeAddress: string;
  role: SPACE_INVITE_ROLES;
  spaceId: string;
}

export async function acceptPromotionRequest(
  this: Space,
  options: IAcceptPromotionRequestType
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

  // get old live space data
  const oldLiveSpaceData = await getLiveSpaceData({
    localAddress: this.data.local.address,
    pgpPrivateKey: this.pgpPrivateKey,
    env: this.env,
    spaceId: this.spaceSpecificData.spaceId,
  });

  // update the metamessage
  const updatedLiveSpaceData = produce(oldLiveSpaceData, (draft) => {
    const listnerIndex = draft.listeners.findIndex((listner) => listner.address === pCAIP10ToWallet(promoteeAddress));
    if (listnerIndex >   -1) draft.listeners[listnerIndex].handRaised = false;

    // convert listener to speaker type (ListenerPeer -> AdminPeer)
    const promotedListener: AdminPeer = {
      address: draft.listeners[listnerIndex].address,
      emojiReactions: draft.listeners[listnerIndex].emojiReactions,
      audio: true,
    }

    // remove listener from speaker array
    draft.listeners.splice(listnerIndex, 1);

    // add listener to speaker array
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
