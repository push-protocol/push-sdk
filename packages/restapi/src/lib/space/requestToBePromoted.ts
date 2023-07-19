import { SPACE_INVITE_ROLES, SPACE_REQUEST_TYPE } from '../payloads/constants';
import type Space from './Space';

export interface RequestToBePromotedType {
  role: SPACE_INVITE_ROLES;
  promotorAddress: string; 
}

export async function requestToBePromoted(
  this: Space,
  options: RequestToBePromotedType
) {
  const { role, promotorAddress } = options || {};

  // requesting host to include local computer into the mesh connection
  this.request({
    senderAddress: this.data.local.address,
    recipientAddress: promotorAddress,
    chatId: this.spaceSpecificData.spaceId,
    details: {
      type: SPACE_REQUEST_TYPE.REQUEST_TO_PROMOTE,
      data: {
        role,
      },
    },
  });
}
