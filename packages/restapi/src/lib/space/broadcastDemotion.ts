import { produce } from 'immer';
import type Space from './Space';
import getLiveSpaceData from './helpers/getLiveSpaceData';
import sendLiveSpaceData from './helpers/sendLiveSpaceData';
import { META_ACTION } from '../types/metaTypes';
import { pCAIP10ToWallet } from '../helpers';
import { ListenerPeer } from '../types';

export interface IBroadcastDemotion {
    demoteeAddress: string;
}

export async function broadcastDemotion(
    this: Space,
    options: IBroadcastDemotion
) {
    const { demoteeAddress } = options || {};

    console.log('BROADCAST SPEAKER DEMOTION', demoteeAddress);

    // update live space info
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
    
        // remove listener from speaker array
        draft.speakers.splice(speakerIndex, 1);
    
        // add listener to speaker array
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
