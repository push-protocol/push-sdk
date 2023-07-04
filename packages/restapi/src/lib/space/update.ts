import Constants from '../constants';
import { ChatStatus, EnvOptionsType } from '../types';
import {
  getAdminsList,
  getMembersList,
  groupDtoToSpaceDto,
} from './../chat/helpers';
import { updateGroup } from '../chat/updateGroup';
import { get } from './get';

import type Space from './Space';

export interface ChatUpdateSpaceType extends EnvOptionsType {
  spaceName: string;
  spaceImage: string | null;
  spaceDescription: string;
  scheduleAt?: Date;
  scheduleEnd?: Date | null;
}

// add speaker and co-host

export async function update(
  this: Space,
  options: ChatUpdateSpaceType
): Promise<void> {
  const {
    spaceName,
    spaceImage,
    spaceDescription,
    env = Constants.ENV.PROD,
    scheduleAt,
    scheduleEnd,
  } = options || {};
  try {
    const space = await get({
      spaceId: this.spaceSpecificData.spaceId,
      env: this.env,
    });

    const convertedMembers = getMembersList(
      space.members,
      space.pendingMembers
    );
    const convertedAdmins = getAdminsList(space.members, space.pendingMembers);

    if (space.status === ChatStatus.ACTIVE && scheduleAt) {
      throw new Error('Unable change the start date/time of an active space');
    }

    if (space.status === ChatStatus.ENDED && scheduleEnd) {
      throw new Error('Unable change the end date/time of an ended space');
    }

    //

    const group = await updateGroup({
      chatId: this.spaceSpecificData.spaceId,
      groupName: spaceName,
      groupImage: spaceImage,
      groupDescription: spaceDescription,
      members: convertedMembers,
      admins: convertedAdmins,
      signer: this.signer,
      env: env,
      pgpPrivateKey: this.pgpPrivateKey,
      scheduleAt: scheduleAt,
      scheduleEnd: scheduleEnd,
    });

    // update space specific data
    this.setSpaceSpecificData(() => groupDtoToSpaceDto(group));
  } catch (err) {
    console.error(`[Push SDK] - API  - Error - API ${update.name} -:  `, err);
    throw Error(`[Push SDK] - API  - Error - API ${update.name} -: ${err}`);
  }
}
