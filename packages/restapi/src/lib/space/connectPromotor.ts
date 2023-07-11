import type Space from './Space';

export interface ConnectPromotorType {
  signalData: any;
  promotorAddress: string;
}

export async function connectPromotor(this: Space, options: ConnectPromotorType) {
  const { signalData, promotorAddress } = options || {};

  // complete the webRTC connection
  this.connect({ signalData, peerAddress: promotorAddress });
}
