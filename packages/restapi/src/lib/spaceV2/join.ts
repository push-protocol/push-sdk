import { ChatStatus } from '../types';
import { approve } from './approve';
import { get } from './get';
import getPlainAddress from './helpers/getPlainAddress';
import { SpaceV2 } from './SpaceV2';

/**
 *
 * @param options
 */
export async function join(this: SpaceV2) {
  try {
    const space = await get({
      spaceId: this.data.spaceInfo.spaceId,
      env: this.env,
    });

    if (space.status !== ChatStatus.ACTIVE)
      throw new Error('Space not active yet');

    // checking what is the current role of caller address

    let isSpeaker = false;
    let isListener = false;
    const localAddress = getPlainAddress(this.data.local.address);
    space.members.forEach((member) => {
      if (getPlainAddress(member.wallet) === localAddress) {
        if (member.isSpeaker) {
          isSpeaker = true;
          return;
        } else {
          isListener = true;
          return;
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
        return;
      }
    });

    console.log(
      'ISSPEAKER',
      isSpeaker,
      'isListener',
      isListener,
      'isSpeakerPending',
      isSpeakerPending
    );

    // acc to the found role (speaker or listner), executing req logic

    // if speaker is pending then approve first or if listner is pending/not found then approve first
    if (!isSpeaker && !isListener) {
      console.log('CALLING APPROVE');
      await approve({
        signer: this.signer,
        pgpPrivateKey: this.pgpPrivateKey,
        senderAddress: this.data.spaceInfo.spaceId,
        env: this.env,
      });
    }

    if (isSpeaker || isSpeakerPending) {
      // Call joinSpeaker
    } else {
      // Call joinListener
    }

    const updatedSpaceInfo = await get({
      spaceId: this.data.spaceInfo.spaceId,
      env: this.env,
    });

    console.log('UPDATED SPACE', updatedSpaceInfo);
    // update space specific data
    this.setSpaceV2Data(() => ({
      ...this.data,
      spaceInfo: updatedSpaceInfo
    }));
  } catch (err) {
    console.error(`[Push SDK] - API  - Error - API ${join.name} -:  `, err);
    throw Error(`[Push SDK] - API  - Error - API ${join.name} -: ${err}`);
  }
}
