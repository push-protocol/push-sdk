import {
  SPACE_ACCEPT_REQUEST_TYPE,
  SPACE_REQUEST_TYPE,
} from '../payloads/constants';
import { ChatStatus } from '../types';
import { VideoDataType } from '../video/helpers/sendVideoCallNotification';
import { approve } from './approve';
import { get } from './get';
import type Space from './Space';

/**
 *
 * @param options
 *  recievedVideoData: only required when joining as a speaker
 */
export async function join(this: Space) {
  try {
    const space = await get({
      spaceId: this.spaceSpecificData.spaceId,
      env: this.env,
    });

    if (space.status !== ChatStatus.ACTIVE)
      throw new Error('Space not active yet');

    // checking what is the current role of caller address

    let isSpeaker = false;
    let isListner = false;
    space.members.forEach((member) => {
      if (member.wallet === this.data.local.address) {
        if (member.isSpeaker) {
          isSpeaker = true;
        } else {
          isListner = true;
        }
      }
    });
    let isSpeakerPending = false;
    space.pendingMembers.forEach((pendingMember) => {
      if (
        pendingMember.wallet === this.data.local.address &&
        pendingMember.isSpeaker
      ) {
        isSpeakerPending = true;
      }
    });

    // acc to the found role (speaker or listner), executing req logic

    // if speaker is pending then approve first or if listner is pending/not found then approve first
    if (isSpeakerPending || !isListner) {
      await approve({
        signer: this.signer,
        pgpPrivateKey: this.pgpPrivateKey,
        senderAddress: this.spaceSpecificData.spaceId,
        env: this.env,
      });
    }

    if (isSpeaker || isSpeakerPending) {
      // Call the host and join the mesh connection
      const hostAddress = space.spaceCreator.replace('eip155:', '');
      await this.request({
        senderAddress: this.data.local.address,
        recipientAddress: hostAddress,
        chatId: this.spaceSpecificData.spaceId,
        details: {
          type: SPACE_REQUEST_TYPE.JOIN_SPEAKER,
          data: {},
        },
      });
    }

    const updatedSpace = await get({
      spaceId: this.spaceSpecificData.spaceId,
      env: this.env,
    });
    // update space specific data
    this.setSpaceSpecificData(() => updatedSpace);
  } catch (err) {
    console.error(`[Push SDK] - API  - Error - API ${join.name} -:  `, err);
    throw Error(`[Push SDK] - API  - Error - API ${join.name} -: ${err}`);
  }
}
