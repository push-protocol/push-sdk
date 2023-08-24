import type Space from './Space';
import { SPACE_DISCONNECT_TYPE } from '../payloads/constants';
import { produce } from 'immer';
import getLiveSpaceData from './helpers/getLiveSpaceData';
import sendLiveSpaceData from './helpers/sendLiveSpaceData';
import { META_ACTION } from '../types/metaTypes';
import { pCAIP10ToWallet } from '../helpers';
import { ListenerPeer } from '../types';
export interface IDemoteSpeaker {
    demoteeAddress: string;
}

export async function demoteSpeaker(this: Space, options: IDemoteSpeaker) {
    const { demoteeAddress } = options || {};

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

    //add logic to make isSpeaker false

    // broadcast the demotion across the space
    const oldLiveSpaceData = await getLiveSpaceData({
        localAddress: this.data.local.address,
        pgpPrivateKey: this.pgpPrivateKey,
        env: this.env,
        spaceId: this.spaceSpecificData.spaceId,
    });

    const updatedLiveSpaceData = produce(oldLiveSpaceData, (draft) => {
        const speakerIndex = draft.speakers.findIndex((speaker) => speaker.address === pCAIP10ToWallet(demoteeAddress));

        // convert speaker to listener type (AdminPeer -> ListenerPeer)
        const demotedSpeaker: ListenerPeer = {
            address: draft.speakers[speakerIndex].address,
            emojiReactions: draft.speakers[speakerIndex].emojiReactions,
            handRaised: false,
        }

        // remove user from speaker array
        draft.speakers.splice(speakerIndex, 1);

        // add user to speaker array
        draft.listeners.push(demotedSpeaker);
    });

    await sendLiveSpaceData({
        liveSpaceData: updatedLiveSpaceData,
        pgpPrivateKey: this.pgpPrivateKey,
        env: this.env,
        spaceId: this.spaceSpecificData.spaceId,
        signer: this.signer,
        action: META_ACTION.USER_INTERACTION,
    });

    this.setSpaceSpecificData(() => ({
        ...this.spaceSpecificData,
        liveSpaceData: updatedLiveSpaceData,
    }));
}
