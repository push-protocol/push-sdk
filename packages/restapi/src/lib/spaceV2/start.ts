import { produce } from 'immer';

import { get } from './get';
import { SpaceV2 } from './SpaceV2';

import { pCAIP10ToWallet } from '../helpers';
import { ChatStatus } from '../types';

// chat imports
import { updateGroup } from '../chat/updateGroup';
import {
  groupDtoToSpaceDto,
  getSpacesMembersList,
  getSpaceAdminsList,
} from './../chat/helpers';

// ToDo: Add a liveSpaceData in data as well, and figure out on how to broadcast it and populate it on a new node's side as well
export async function start(this: SpaceV2): Promise<void> {
  try {
    // host should have there audio stream
    if (!this.data.local.stream) {
      throw new Error('Local audio stream not found');
    }

    const space = await get({
      spaceId: this.data.spaceInfo.spaceId,
      env: this.env,
    });

    if (space.status !== ChatStatus.PENDING) {
      throw new Error(
        'Unable to start the space as it is not in the pending state'
      );
    }

    // Only host is allowed to start a space
    if (this.data.local.address !== pCAIP10ToWallet(space.spaceCreator)) {
      throw new Error('Only host is allowed to start a space');
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
      chatId: this.data.spaceInfo.spaceId,
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

    // update space data
    this.setSpaceV2Data((oldSpaceData) => {
      return produce(oldSpaceData, (draft) => {
        draft.spaceInfo = groupDtoToSpaceDto(group);
      });
    });
  } catch (err) {
    console.error(`[Push SDK] - API  - Error - API ${start.name} -:  `, err);
    throw Error(`[Push SDK] - API  - Error - API ${start.name} -: ${err}`);
  }
}
