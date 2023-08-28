
import type Space from './Space';
import { produce } from 'immer';

import { SPACE_REQUEST_TYPE } from '../payloads/constants';
import { META_ACTION } from '../types/messageTypes';
import { pCAIP10ToWallet } from '../helpers';
import { ListenerPeer, SignerType } from '../types';

import sendLiveSpaceData from './helpers/sendLiveSpaceData';
import { removeSpeakers } from './removeSpeakers';
import { addListeners } from './addListeners';

export interface IMuteSpeaker {
    mutedAddress: string;
    spaceId: string;
    listeners: Array<string>;
    signer: SignerType;
}

export async function muteSpeaker(this: Space, options: IMuteSpeaker) {
    const { mutedAddress, spaceId, signer } = options || {};

    try {
        // logic for mute speaker using webRTC
    } catch (err) {
        console.error(`[Push SDK] - API  - Error - API ${stop.name} -:  `, err);
        throw Error(`[Push SDK] - API  - Error - API ${stop.name} -: ${err}`);
    }


    // broadcast the demotion across the space
    const updatedLiveSpaceData = produce(
        this.spaceSpecificData.liveSpaceData,
        (draft) => {
            const speakerIndex = this.spaceSpecificData.liveSpaceData.speakers.findIndex(
                (speaker) => speaker.address === pCAIP10ToWallet(mutedAddress)
            );

            const demotedSpeaker: ListenerPeer = {
                address: draft.speakers[speakerIndex].address,
                emojiReactions: draft.speakers[speakerIndex].emojiReactions,
                handRaised: false,
            }

            // remove user from speaker array
            draft.speakers.splice(speakerIndex, 1);

            // add user to speaker array
            draft.listeners.push(demotedSpeaker);
        }
    );

    this.setSpaceSpecificData(() => ({
        ...this.spaceSpecificData,
        liveSpaceData: updatedLiveSpaceData,
    }));

    try {
        await sendLiveSpaceData({
            liveSpaceData: updatedLiveSpaceData,
            pgpPrivateKey: this.pgpPrivateKey,
            env: this.env,
            spaceId: this.spaceSpecificData.spaceId,
            signer: this.signer,
            action: META_ACTION.USER_INTERACTION,
        });
    } catch (error) {
        console.error(`[Push SDK] - API  - Error - API ${sendLiveSpaceData.name} -:  `, error);
        throw Error(`[Push SDK] - API  - Error - API ${sendLiveSpaceData.name} -: ${error}`);
    }
}