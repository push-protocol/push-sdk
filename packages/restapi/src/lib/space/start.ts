import { EnvOptionsType, SignerType, ChatStatus } from '../types';
import {
  groupDtoToSpaceDto,
  getSpacesMembersList,
  getSpaceAdminsList,
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
import { SPACE_REQUEST_TYPE } from '../payloads/constants';

export async function start(this: Space): Promise<void> {
  try {
    const space = await get({
      spaceId: this.spaceSpecificData.spaceId,
      env: this.env,
    });

    if (space.status !== ChatStatus.PENDING) {
      throw new Error(
        'Unable to start the space as it is not in the pending state'
      );
    }

    const convertedMembers = getSpacesMembersList(
      space.members,
      space.pendingMembers
    );
    const convertedAdmins = getSpaceAdminsList(
      space.members,
      space.pendingMembers
    );

    const group = await updateGroup({
      chatId: this.spaceSpecificData.spaceId,
      groupName: space.spaceName,
      groupImage: space.spaceImage,
      groupDescription: space.spaceDescription,
      members: convertedMembers,
      admins: convertedAdmins,
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
        - Try calling all the speakers (admins)
        - Create a mesh based webRTC connection with all those who pick up
    */
    this.request({
      senderAddress: this.data.local.address,
      recipientAddress: [...convertedAdmins],
      chatId: this.spaceSpecificData.spaceId,
      details: {
        type: SPACE_REQUEST_TYPE.JOIN,
        data: {},
      },
    });

    // if this peer is the host then start the livepeer playback and store the playback URL group meta
    // send a notification to all the added listeners (members) telling the space has started
  } catch (err) {
    console.error(`[Push SDK] - API  - Error - API ${start.name} -:  `, err);
    throw Error(`[Push SDK] - API  - Error - API ${start.name} -: ${err}`);
  }
}
