import { produce } from 'immer';

import type Space from './Space';
import { addSpeakers } from './addSpeakers';
import sendLiveSpaceData from './helpers/sendLiveSpaceData';

import { pCAIP10ToWallet } from '../helpers';
import {
  SPACE_ACCEPT_REQUEST_TYPE,
  SPACE_INVITE_ROLES,
} from '../payloads/constants';
import { CHAT } from '../types';

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
    env: this.env,
  });

  const modifiedLiveSpaceData = produce(
    this.spaceSpecificData.liveSpaceData,
    (draft) => {
      const listenerIndex =
        this.spaceSpecificData.liveSpaceData.listeners.findIndex(
          (listener) =>
            pCAIP10ToWallet(listener.address) ===
            pCAIP10ToWallet(promoteeAddress)
        );

      draft.listeners.splice(listenerIndex, 1);

      draft.speakers.push({
        address: pCAIP10ToWallet(promoteeAddress),
        emojiReactions: null,
        audio: null,
      });
    }
  );

  await sendLiveSpaceData({
    spaceId: this.spaceSpecificData.spaceId,
    pgpPrivateKey: this.pgpPrivateKey,
    env: this.env,
    signer: this.signer,
    liveSpaceData: modifiedLiveSpaceData,
    action: CHAT.META.SPACE.SPEAKER.PRVILEGE,
  });

  // accept the promotion request
  // this.acceptRequest({
  //   signalData,
  //   senderAddress: this.data.local.address,
  //   recipientAddress: pCAIP10ToWallet(promoteeAddress),
  //   chatId: spaceId,
  //   details: {
  //     type: SPACE_ACCEPT_REQUEST_TYPE.ACCEPT_PROMOTION,
  //     data: {},
  //   },
  // });
}
