import { SPACE_ACCEPT_REQUEST_TYPE } from '../payloads/constants';
import type Space from './Space';

export interface AcceptPromotionInviteType {
  signalData: any;
  invitorAddress: string;
  spaceId: string;
}

export async function acceptPromotionInvite(
  this: Space,
  options: AcceptPromotionInviteType
) {
  const { signalData, invitorAddress, spaceId } =
    options || {};

  // accept the promotion invite
  this.acceptRequest({
    signalData,
    senderAddress: this.data.local.address,
    recipientAddress: invitorAddress,
    chatId: spaceId,
    details: {
      type: SPACE_ACCEPT_REQUEST_TYPE.ACCEPT_INVITE,
      data: {},
    },
  });
}
