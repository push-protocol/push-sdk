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
    peerAddress: promoteeAddress,
  });
}
