import { ChatStatus } from '../types';
import {
  getSpaceAdminsList,
  getSpacesMembersList,
  groupDtoToSpaceDto,
} from './../chat/helpers';
import { updateGroup } from '../chat/updateGroup';
import { get } from './get';

import type Space from './Space';

export interface ChatUpdateSpaceType {
  spaceName?: string;
  spaceImage?: string | null;
  spaceDescription?: string;
  scheduleAt?: Date;
  scheduleEnd?: Date | null;
}

export async function update(
  this: Space,
  options: ChatUpdateSpaceType
): Promise<void> {
  const { spaceName, spaceImage, spaceDescription, scheduleAt, scheduleEnd } =
    options || {};
  try {
    const space = await get({
      spaceId: this.spaceSpecificData.spaceId,
      env: this.env,
    });

    const convertedMembers = getSpacesMembersList(
      space.members,
      space.pendingMembers
    );
    const convertedAdmins = getSpaceAdminsList(
      space.members,
      space.pendingMembers
    );

    if (space.status === ChatStatus.ACTIVE && scheduleAt) {
      throw new Error('Unable change the start date/time of an active space');
    }

    if (space.status === ChatStatus.ENDED && scheduleEnd) {
      throw new Error('Unable change the end date/time of an ended space');
    }

    const group = await updateGroup({
      chatId: this.spaceSpecificData.spaceId,
      groupName: spaceName ? spaceName : space.spaceName,
      groupImage: spaceImage ? spaceImage : space.spaceImage,
      groupDescription: spaceDescription
        ? spaceDescription
        : space.spaceDescription,
      members: convertedMembers,
      admins: convertedAdmins,
      signer: this.signer,
      env: this.env,
      pgpPrivateKey: this.pgpPrivateKey,
      scheduleAt: scheduleAt ? scheduleAt : space.scheduleAt,
      scheduleEnd: scheduleEnd ? scheduleEnd : space.scheduleEnd,
    });

    // update space specific data
    this.setSpaceSpecificData(() => groupDtoToSpaceDto(group));
  } catch (err) {
    console.error(`[Push SDK] - API  - Error - API ${update.name} -:  `, err);
    throw Error(`[Push SDK] - API  - Error - API ${update.name} -: ${err}`);
  }
}
