import { produce } from 'immer';
import type Space from './Space';
import getLiveSpaceData from './helpers/getLiveSpaceData';
import sendLiveSpaceData from './helpers/sendLiveSpaceData';
import { META_ACTION } from '../types/metaTypes';
import { pCAIP10ToWallet } from '../helpers';

export interface BroadcastEmojiType {
    reactorAddress: string;
    emoji: string;
}

export async function broadcastEmoji(
    this: Space,
    options: BroadcastEmojiType
) {
    const { reactorAddress, emoji } = options || {};

    console.log('BROADCAST EMOJI REACTION', reactorAddress);

    // update live space infoA

    // REFACTOR -> ADD FUNCTIONALITY FOR HOST AS WELL
    const oldLiveSpaceData = await getLiveSpaceData({
        localAddress: this.data.local.address,
        pgpPrivateKey: this.pgpPrivateKey,
        env: this.env,
        spaceId: this.spaceSpecificData.spaceId,
    });
    const updatedLiveSpaceData = produce(oldLiveSpaceData, (draft) => {
        const listenerIndex = draft.listeners.findIndex(
            (listner) =>pCAIP10ToWallet(listner.address) === pCAIP10ToWallet(reactorAddress)
        );
        if (listenerIndex !== -1) {
            draft.listeners[listenerIndex].emojiReactions = {
                emoji: emoji,
                expiresIn: '200'
            }
        }

        const speakerIndex = draft.speakers.findIndex(
            (speaker) => pCAIP10ToWallet(speaker.address) === pCAIP10ToWallet(reactorAddress)
        );
        if (speakerIndex !== -1) {
            draft.speakers[speakerIndex].emojiReactions = {
                emoji: emoji,
                expiresIn: '200'
            }
        }

        const coHostIndex = draft.speakers.findIndex(
            (cohost) => pCAIP10ToWallet(cohost.address) === pCAIP10ToWallet(reactorAddress)
        );
        if (coHostIndex !== -1) {
            draft.coHosts[coHostIndex].emojiReactions = {
                emoji: emoji,
                expiresIn: '200'
            }
        }
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
