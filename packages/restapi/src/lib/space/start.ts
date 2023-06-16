import { EnvOptionsType, SignerType, ChatStatus } from '../types';
import {
  groupDtoToSpaceDto,
  getMembersList,
  getAdminsList,
} from './../chat/helpers';
import { get } from './get';
import { updateGroup } from '../chat/updateGroup';
export interface StartSpaceType extends EnvOptionsType {
  spaceId: string;
  account?: string;
  signer?: SignerType;
  pgpPrivateKey?: string;
}

import type Space from './Space';

export async function start(this: Space): Promise<void> {
  try {
    if (this.signer === null) {
      throw new Error(`Signer is necessary!`);
    }

    const space = await get({
      spaceId: this.spaceSpecificData.spaceId,
      env: this.env,
    });

    if (space.status !== ChatStatus.PENDING) {
      throw new Error(
        'Unable to start the space as it is not in the pending state'
      );
    }

    const convertedMembers = getMembersList(
      space.members,
      space.pendingMembers
    );
    const convertedAdmins = getAdminsList(space.members, space.pendingMembers);

    const group = await updateGroup({
      chatId: this.spaceSpecificData.spaceId,
      groupName: space.spaceName,
      groupImage: space.spaceImage,
      groupDescription: space.spaceDescription,
      members: convertedMembers,
      admins: convertedAdmins,
      account: null,
      signer: this.signer,
      env: this.env,
      pgpPrivateKey: this.pgpPrivateKey,
      scheduleAt: space.scheduleAt,
      scheduleEnd: space.scheduleEnd,
      status: ChatStatus.ACTIVE,
    });

    // update space specific data
    this.setSpaceSpecificData(() => groupDtoToSpaceDto(group));

    /*
        - Try calling all the members + co hosts (broadcast)
        - Create a mesh based webRTC connection with all those who pick up
    */
    this.request({
      senderAddress: this.data.local.address,
      recipientAddress: [...convertedAdmins, ...convertedMembers],
      chatId: this.spaceSpecificData.spaceId,
    });
  } catch (err) {
    console.error(`[Push SDK] - API  - Error - API ${start.name} -:  `, err);
    throw Error(`[Push SDK] - API  - Error - API ${start.name} -: ${err}`);
  }
}
