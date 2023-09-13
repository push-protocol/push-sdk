// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as Peer from 'simple-peer';
import { produce } from 'immer';

import { SPACE_ACCEPT_REQUEST_TYPE } from '../payloads/constants';
import type { SpaceV2 } from './SpaceV2';
import getIncomingIndexFromAddress from '../video/helpers/getIncomingIndexFromAddress';
import { VideoCallStatus } from '../types';
import sendSpaceNotification from './helpers/sendSpaceNotification';
import { getIceServerConfig } from './helpers/getIceServerConfig';
import getConnectedAddresses from '../video/helpers/getConnectedAddresses';

export interface IAcceptInvite {
    signalData: any;
    senderAddress: string;
    recipientAddress: string;
    chatId: string;
    retry?: boolean;
    details?: {
        type: SPACE_ACCEPT_REQUEST_TYPE;
        data: Record<string, unknown>;
    };
}

export async function acceptPromotionInvite(
    this: SpaceV2,
    options: IAcceptInvite
) {
    const {
        signalData,
        senderAddress,
        recipientAddress,
        chatId,
        retry = false,
        details,
    } = options || {};

    try {
        console.log('ACCEPT INVITE', options);

        // if getPeerConnection is not null -> acceptRequest/request was called before
        if (this.getPeerConnection(recipientAddress)) {
            // to prevent connection error we stop the exec of acceptRequest
            return Promise.resolve();
        }

        // fetching the iceServers config
        const iceServerConfig = await getIceServerConfig(this.env);

        // sets a new `RTCPeerConnection` for a recipient address in the space.
        this.setPeerConnection(recipientAddress, new Peer({
            initiator: false,
            trickle: false,
            stream: this.data.local.stream,
            config: {
                iceServers: iceServerConfig,
            },
        }))

        const receipentPeer = this.getPeerConnection(recipientAddress) as Peer;

        receipentPeer.on('error', (err: any) => {
            if (this.data.incoming[0].retryCount >= 5) {
                console.log('Max retries exceeded, please try again.');
                this.disconnect({ peerAddress: recipientAddress });
            }

            // retrying in case of connection error
            sendSpaceNotification(
                {
                    signer: this.signer,
                    chainId: this.chainId,
                    pgpPrivateKey: this.pgpPrivateKey,
                },
                {
                    senderAddress,
                    recipientAddress,
                    status: VideoCallStatus.RETRY_INITIALIZED,
                    spaceId: chatId,
                    signalData: null,
                    // callType: this.callType,
                    env: this.env,
                }
            );
        })

        receipentPeer.signal(signalData);

        receipentPeer.on('signal', (data: any) => {
            // this.setSpaceV2Data((oldData) => {
            //     return produce(oldData, (draft) => {
            //         draft.meta.initiator.signal = data;
            //     });
            // });

            sendSpaceNotification(
                {
                    signer: this.signer,
                    chainId: this.chainId,
                    pgpPrivateKey: this.pgpPrivateKey,
                },
                {
                    senderAddress,
                    recipientAddress,
                    status: retry
                        ? VideoCallStatus.RETRY_RECEIVED
                        : VideoCallStatus.RECEIVED,
                    spaceId: chatId,
                    signalData: data,
                    env: this.env,
                    callDetails: details,
                }
            );
        });

        receipentPeer.on('connect', () => {
            receipentPeer.send(
                JSON.stringify({
                    type: 'isVideoOn',
                    value: this.data.local.video,
                })
            );
            receipentPeer.send(
                JSON.stringify({
                    type: 'isAudioOn',
                    value: this.data.local.audio,
                })
            );

            // send the addresses the local peer is connected to remote peer
            const connectedAddresses = getConnectedAddresses({
                incomingPeers: this.data.incoming,
            });

            console.log(
                'ACCEPT REQUEST - SENDING THE CONNECTED ADDRESSES',
                'connectedAddresses',
                connectedAddresses
            );
            receipentPeer.send(
                JSON.stringify({
                    type: 'connectedAddresses',
                    value: connectedAddresses,
                })
            );

            // set videoCallInfo state with status connected for the receiver's end
            this.setSpaceV2Data((oldData) => {
                return produce(oldData, (draft) => {
                    const incomingIndex = getIncomingIndexFromAddress(
                        oldData.incoming,
                        recipientAddress
                    );
                    draft.incoming[incomingIndex].status = VideoCallStatus.CONNECTED;
                });
            });
        });
    } catch (error) {
        console.log('error in accept request', error);
    }
}
