import { produce } from 'immer';
import { SPACE_INVITE_ROLES, SPACE_REQUEST_TYPE } from '../payloads/constants';
import type Space from './Space';

export interface InviteToPromoteType {
  inviteeAddress: string;
  role: SPACE_INVITE_ROLES;
}

export async function inviteToPromote(
  this: Space,
  options: InviteToPromoteType
) {
  const { inviteeAddress, role } = options || {};

  // adding address to the invitee map
  this.setSpaceSpecificData((oldData) => {
    return produce(oldData, (draft) => {
      if (draft.inviteeDetails) draft.inviteeDetails[inviteeAddress] = role;
    });
  });

  // we send a request to 'inviteeAddress' and try to add them to the mesh connection
  this.request({
    senderAddress: this.data.local.address,
    recipientAddress: inviteeAddress,
    chatId: this.spaceSpecificData.spaceId,
    details: {
      type: SPACE_REQUEST_TYPE.INVITE_TO_PROMOTE,
      data: {
        role,
      },
    },
  });
}
