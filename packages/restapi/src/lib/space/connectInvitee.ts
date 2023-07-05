import { produce } from 'immer';
import type Space from './Space';

export interface ConnectInviteeType {
  signalData: any;
  inviteeAddress: string;
}

export async function connectInvitee(this: Space, options: ConnectInviteeType) {
  const { signalData, inviteeAddress } = options || {};

  // check for invalid invite
  if (
    !this.spaceSpecificData?.inviteeDetails ||
    !Object.keys(this.spaceSpecificData.inviteeDetails).includes(inviteeAddress)
  ) {
    return Promise.resolve();
  }

  const role = this.spaceSpecificData.inviteeDetails[inviteeAddress];
  this.setSpaceSpecificData((oldData) => {
    return produce(oldData, (draft) => {
      if (draft.inviteeDetails) delete draft.inviteeDetails[inviteeAddress];
    });
  });
  // TODO: On backend change the role of inviteeAddress

  // complete the webRTC connection
  this.connect({ signalData, peerAddress: inviteeAddress });
}
