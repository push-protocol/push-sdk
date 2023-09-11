/**
 * @file joinAsSpeaker
 * defines a function that allows a user to join a space as a speaker in the SpaceV2 implmentation
 */

import { get } from './get';
import { SpaceV2 } from './SpaceV2';
import sendMetaMessage from './helpers/sendMetaMessage'

import { META_ACTION } from '../types';

export async function joinAsSpeaker(this: SpaceV2) {
    try {
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
