import { produce } from "immer";

import { SpaceV2 } from "./SpaceV2";

import { VideoCallStatus } from "../types";
import getIncomingIndexFromAddress from "../video/helpers/getIncomingIndexFromAddress";

export interface IConnectOptions {
    signalData: any;
    peerAddress?: string;
}

export function connect(
    this: SpaceV2,
    options: IConnectOptions
) {
    const { peerAddress, signalData } = options || {};

    try {
        this.getPeerConnection(
            peerAddress ? peerAddress : this.data.incomingPeerStreams[0].address
        )?.on('error', (err: any) => {
            console.log('error in connect', err);

            const incomingIndex = peerAddress
                ? getIncomingIndexFromAddress(this.data.incomingPeerStreams, peerAddress)
                : 0;

            if (this.data.incomingPeerStreams[incomingIndex].retryCount >= 5) {
                console.log('Max retries exceeded, please try again.');
                this.disconnect({
                    peerAddress: peerAddress
                        ? peerAddress
                        : this.data.incomingPeerStreams[0].address,
                });
            }

            // retrying in case of connection error
            this.request({
                senderAddress: this.data.local.address,
                recipientAddress: this.data.incomingPeerStreams[incomingIndex].address,
                chatId: this.data.spaceInfo.spaceId,
                retry: true,
            });
        })

        this.getPeerConnection(
            peerAddress ? peerAddress : this.data.incomingPeerStreams[0].address
        )?.signal(signalData);

        // update space data
        this.setSpaceV2Data((oldSpaceData) => {
            return produce(oldSpaceData, (draft) => {
                const incomingIndex = peerAddress
                    ? getIncomingIndexFromAddress(oldSpaceData.incomingPeerStreams, peerAddress)
                    : 0;
                draft.incomingPeerStreams[incomingIndex].status = VideoCallStatus.CONNECTED;
            });
        });
    } catch (err) {
        console.error(`[Push SDK] - API  - Error - API ${connect.name} -:  `, err);
        throw Error(`[Push SDK] - API  - Error - API ${connect.name} -: ${err}`);
    }
}
