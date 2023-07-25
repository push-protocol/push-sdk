import {
  SPACE_ACCEPT_REQUEST_TYPE,
  SPACE_INVITE_ROLES,
} from '../payloads/constants';
import type Space from './Space';
import { addSpeakers } from './addSpeakers';

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

  await addSpeakers({
    spaceId: this.spaceSpecificData.spaceId,
    signer: this.signer,
    pgpPrivateKey: this.pgpPrivateKey,
    speakers: [promoteeAddress],
  });

  // accept the promotion request
  this.acceptRequest({
    signalData,
    senderAddress: this.data.local.address,
    recipientAddress: promoteeAddress,
    chatId: spaceId,
    details: {
      type: SPACE_ACCEPT_REQUEST_TYPE.ACCEPT_PROMOTION,
      data: {},
    },
  });
}
