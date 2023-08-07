import { pCAIP10ToWallet } from '../helpers';
import { SPACE_REQUEST_TYPE } from '../payloads/constants';
import type Space from './Space';

export interface ReactWithEmojiType {
    hostAddress: string;
    emoji: string;
}

export async function reactWithEmoji(
    this: Space,
        options: ReactWithEmojiType
    ) {
    const { hostAddress, emoji } = options || {};

    console.log("reactWithEmoji", options);

    // requesting host to include local computer into the mesh connection
    this.request({
        senderAddress: this.data.local.address,
        recipientAddress: pCAIP10ToWallet(hostAddress),
        chatId: this.spaceSpecificData.spaceId,
        details: {
            type: SPACE_REQUEST_TYPE.BROADCAST_EMOJI,
            data: {
                emoji,
            },
        },
    });
}
