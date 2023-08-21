import type Space from './Space';
import { SPACE_DISCONNECT_TYPE } from '../payloads/constants';

export interface IDemoteSpeaker {
    demoteeAddress: string;
}

export async function demoteSpeaker(
        this: Space,
        options: IDemoteSpeaker
    ) {
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
}
