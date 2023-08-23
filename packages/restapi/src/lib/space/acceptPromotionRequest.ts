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
import { META_ACTION } from '../types/messageObjectTypes';
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
    env: this.env,
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
