import {
  groupDtoToSpaceDto,
  getSpacesMembersList,
  getSpaceAdminsList,
} from '../chat/helpers';
import { updateGroup } from '../chat/updateGroup';
import { get } from './get';

import type Space from './Space';
import { ChatStatus } from '../types';
import { SPACE_DISCONNECT_TYPE } from '../payloads/constants';

export async function stop(this: Space): Promise<void> {
  try {
    // should be only called by the host

    const space = await get({
      spaceId: this.spaceSpecificData.spaceId,
      env: this.env,
    });

    if (space.status === ChatStatus.ENDED) {
      throw new Error('Space already ended');
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
      status: ChatStatus.ENDED,
    });

    // update space specific data
    this.setSpaceSpecificData(() => ({
      ...groupDtoToSpaceDto(group),
      liveSpaceData: this.spaceSpecificData.liveSpaceData,
    }));

    // stop livepeer playback

    /*
      - disconnect with every incoming peer in the mesh connection
      - other peers should also end their connections as we want to destroy the mesh connection
    */
    this.data.incoming.slice(1).forEach(({ address }) => {
      this.disconnect({
        peerAddress: address,
        details: {
          type: SPACE_DISCONNECT_TYPE.STOP,
          data: {},
        },
      });
    });
  } catch (err) {
    console.error(`[Push SDK] - API  - Error - API ${stop.name} -:  `, err);
    throw Error(`[Push SDK] - API  - Error - API ${stop.name} -: ${err}`);
  }
}
