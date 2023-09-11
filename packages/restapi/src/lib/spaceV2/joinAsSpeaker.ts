import { ChatStatus, META_ACTION } from '../types';
import { approve } from '../space/approve';
import { get } from '../space/get';
import getIncomingIndexFromAddress from '../video/helpers/getIncomingIndexFromAddress';
import getPlainAddress from '../space/helpers/getPlainAddress';
import type Space from '../space/Space';
import sendLiveSpaceData from '../space/helpers/sendLiveSpaceData';

export async function joinAsSpeaker(this: Space) {
    try {
        const space = await get({
            spaceId: this.spaceSpecificData.spaceId,
            env: this.env,
        });

        if (space.status !== ChatStatus.ACTIVE)
            throw new Error('Space not active yet');

        // checking what is the current role of caller address
        let isSpeaker = false;

        const localAddress = getPlainAddress(this.data.local.address);

        space.members.forEach((member) => {
            if (getPlainAddress(member.wallet) === localAddress) {
                if (member.isSpeaker) {
                    isSpeaker = true;
                }
            }
        });

        console.log("🚀 ~ file: joinAsSpeaker.ts:48 ~ space.members.forEach ~ isSpeaker:", isSpeaker)

        const hostAddress = getPlainAddress(space.spaceCreator);
        const incomingIndex = getIncomingIndexFromAddress(
            this.data.incoming,
            hostAddress
        );

        // check if we arent already connected to the host
        if ((isSpeaker) && incomingIndex > -1) {
            return Promise.resolve();
        }

        // if speaker is pending then approve first or if listner is pending/not found then approve first
        if (!isSpeaker) {
            console.log('CALLING APPROVE');
            await approve({
                signer: this.signer,
                pgpPrivateKey: this.pgpPrivateKey,
                senderAddress: this.spaceSpecificData.spaceId,
                env: this.env,
            });
        }

        // send meta message to host
        await sendLiveSpaceData({
            liveSpaceData: this.spaceSpecificData.liveSpaceData,
            pgpPrivateKey: this.pgpPrivateKey,
            env: this.env,
            spaceId: this.spaceSpecificData.spaceId,
            signer: this.signer,
            // TODO: add relevant meta message later
            action: META_ACTION.ADD_MEMBER,
        });

        /* rest logic to be implemented here after host has called the approve/reject call */

        const updatedSpace = await get({
            spaceId: this.spaceSpecificData.spaceId,
            env: this.env,
        });

        // update space specific data
        this.setSpaceSpecificData(() => ({
            ...updatedSpace,
            liveSpaceData: this.spaceSpecificData.liveSpaceData,
        }));
    } catch (err) {
        console.error(`[Push SDK] - API  - Error - API ${joinAsSpeaker.name} -:  `, err);
        throw Error(`[Push SDK] - API  - Error - API ${joinAsSpeaker.name} -: ${err}`);
    }
};