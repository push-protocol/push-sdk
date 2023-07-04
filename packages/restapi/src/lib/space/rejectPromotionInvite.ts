import type Space from './Space';

export interface RejectPromotionInviteType {
  invitorAddress: string;
}

export async function rejectPromotionInvite(
  this: Space,
  options: RejectPromotionInviteType
) {
  const { invitorAddress } =
    options || {};

  // reject the promotion invite
  this.disconnect({
    peerAddress: invitorAddress,
  });
}
