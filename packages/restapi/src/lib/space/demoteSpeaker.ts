import type Space from './Space';
import { SPACE_DISCONNECT_TYPE } from '../payloads/constants';
import { produce } from 'immer';
import getLiveSpaceData from './helpers/getLiveSpaceData';
import sendLiveSpaceData from './helpers/sendLiveSpaceData';
import { META_ACTION } from '../types/messageTypes';
import { pCAIP10ToWallet } from '../helpers';
import { ListenerPeer, SignerType } from '../types';

import { removeSpeakers } from './removeSpeakers';
import { addListeners } from './addListeners';
export interface IDemoteSpeaker {
    demoteeAddress: string;
    spaceId: string;
    listeners: Array<string>;
    signer: SignerType;
}

export async function demoteSpeaker(this: Space, options: IDemoteSpeaker) {
    const { demoteeAddress, spaceId, signer } = options || {};

    try {
        this.disconnect({
            peerAddress: demoteeAddress,
            details: {
                type: SPACE_DISCONNECT_TYPE.DEMOTE_SPEAKER,
                data: {},
            },
        });
    } catch (err) {
        console.error(`[Push SDK] - API  - Error - API ${stop.name} -:  `, err);
        throw Error(`[Push SDK] - API  - Error - API ${stop.name} -: ${err}`);
    }

    try {
        await removeSpeakers({
            spaceId: spaceId,
            speakers: [demoteeAddress],
            signer: signer,
        })
    } catch (error) {
        console.error(`[Push SDK] - API  - Error - API ${removeSpeakers.name} -:  `, error);
        throw Error(`[Push SDK] - API  - Error - API ${removeSpeakers.name} -: ${error}`);
    }

    try {
        await addListeners({
            spaceId: spaceId,
            listeners: [demoteeAddress],
        })
    } catch (error) {
        console.error(`[Push SDK] - API  - Error - API ${addListeners.name} -:  `, error);
        throw Error(`[Push SDK] - API  - Error - API ${addListeners.name} -: ${error}`);
    }


    // broadcast the demotion across the space
    const updatedLiveSpaceData = produce(
        this.spaceSpecificData.liveSpaceData,
        (draft) => {
            const speakerIndex = this.spaceSpecificData.liveSpaceData.speakers.findIndex(
                (speaker) => speaker.address === pCAIP10ToWallet(demoteeAddress)
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
