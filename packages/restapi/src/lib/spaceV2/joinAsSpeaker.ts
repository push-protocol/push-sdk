/**
 * @file joinAsSpeaker
 * defines a function that allows a user to join a space as a speaker in the SpaceV2 implmentation
 */

import { get } from './get';
import { SpaceV2 } from './SpaceV2';
import { approve } from './approve';
import getIncomingIndexFromAddress from './helpers/getIncomingIndexFromAddress';
import sendMetaMessage from './helpers/sendMetaMessage'

import { ChatStatus, META_ACTION } from '../types';
import getPlainAddress from '../spaceV2/helpers/getPlainAddress';

export async function joinAsSpeaker(this: SpaceV2) {
    try {
        const space = await get({
            spaceId: this.data.spaceInfo.spaceId,
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

        console.log("🚀 ~ file: joinAsSpeaker.ts:34 ~ space.members.forEach ~ isSpeaker:", isSpeaker)

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
                senderAddress: this.data.spaceInfo.spaceId,
                env: this.env,
            });
        }

        // send meta message to host
        await sendMetaMessage({
            pgpPrivateKey: this.pgpPrivateKey,
            env: this.env,
            spaceId: this.data.spaceInfo.spaceId,
            signer: this.signer,
            // TODO: add relevant meta message later
            action: META_ACTION.ADD_MEMBER,
        });

        /* rest logic to be implemented here after host has called the approve/reject call */

        const updatedSpace = await get({
            spaceId: this.data.spaceInfo.spaceId,
            env: this.env,
        });

        // update space specific data
        this.setSpaceV2Data(() => ({
            ...this.data,
            spaceInfo: updatedSpace
        }));
    } catch (err) {
        console.error(`[Push SDK] - API  - Error - API ${joinAsSpeaker.name} -:  `, err);
        throw Error(`[Push SDK] - API  - Error - API ${joinAsSpeaker.name} -: ${err}`);
    }
};
