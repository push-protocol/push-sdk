import {
  SPACE_REQUEST_TYPE,
} from '../payloads/constants';
import { ChatStatus } from '../types';
import { approve } from './approve';
import { get } from './get';
import getIncomingIndexFromAddress from '../video/helpers/getIncomingIndexFromAddress';
import getPlainAddress from './helpers/getPlainAddress';
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
    const localAddress = getPlainAddress(this.data.local.address);
    space.members.forEach((member) => {
      if (getPlainAddress(member.wallet) === localAddress) {
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
        getPlainAddress(pendingMember.wallet) === localAddress &&
        pendingMember.isSpeaker
      ) {
        isSpeakerPending = true;
      }
    });

    const hostAddress = space.spaceCreator.replace('eip155:', '');
    const incomingIndex = getIncomingIndexFromAddress(
      this.data.incoming,
      hostAddress
    );
    console.log("HOST ADDRESS", hostAddress, "INCOMING", this.data.incoming);
    // check if we arent already connected to the host
    if ((isSpeaker || isSpeakerPending) && incomingIndex > -1) {
      return Promise.resolve();
    }

    // acc to the found role (speaker or listner), executing req logic

    // if speaker is pending then approve first or if listner is pending/not found then approve first
    if (!isSpeaker && !isListner) {
      await approve({
        signer: this.signer,
        pgpPrivateKey: this.pgpPrivateKey,
        senderAddress: this.spaceSpecificData.spaceId,
        env: this.env,
      });
    }

    if (isSpeaker || isSpeakerPending) {
      // Call the host and join the mesh connection
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
