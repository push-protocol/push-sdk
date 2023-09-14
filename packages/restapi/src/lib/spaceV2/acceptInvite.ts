/**
 * @file acceptInvite
 * This file defines functions related to accepting invites
 * and managing connections within the SpaceV2 class.
 * It includes the `acceptInvite` function,
 * which handles incoming invitations and manages peer connections,
 * as well as related utility functions.
 */

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as Peer from 'simple-peer';
import { produce } from 'immer';

import { initSpaceV2Data, type SpaceV2 } from './SpaceV2';
import sendSpaceNotification from './helpers/sendSpaceNotification';

import { SPACE_ACCEPT_REQUEST_TYPE, SPACE_DISCONNECT_TYPE } from '../payloads/constants';
import { VideoCallStatus } from '../types';

// imports from Video
import getIncomingIndexFromAddress from '../video/helpers/getIncomingIndexFromAddress';
import isJSON from '../video/helpers/isJSON';
import { endStream } from '../video/helpers/mediaToggle';
import { getIceServerConfig } from '../video/helpers/getIceServerConfig';

export interface IAcceptInvite {
    signalData: any;
    senderAddress: string;
    recipientAddress: string;
    spaceId: string;
    onReceiveMessage?: (message: string) => void;
    retry?: boolean;
    details?: {
        type: SPACE_ACCEPT_REQUEST_TYPE;
        data: Record<string, unknown>;
    };
}

export async function acceptInvite(
    this: SpaceV2,
    options: IAcceptInvite
) {
    const {
        signalData,
        senderAddress,
        recipientAddress,
        spaceId,
        onReceiveMessage = (message: string) => {
            console.log('received a meesage', message);
        },
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

        let peerConnection = new Peer({
            initiator: true,
            trickle: false,
            stream: this.data.local.stream,
            config: {
                iceServers: iceServerConfig,
            },
        });

        this.setPeerConnection(recipientAddress, peerConnection);

        peerConnection.on('error', (err: any) => {
            if (this.data.incomingPeerStreams[0].retryCount >= 5) {
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
                    spaceId: spaceId,
                    signalData: null,
                    env: this.env,
                }
            );
        })

        peerConnection.signal(signalData);

        peerConnection.on('signal', (data: any) => {
            this.setSpaceV2Data((oldData) => {
                return produce(oldData, (draft) => {
                    draft.meta.initiator.signal = data;
                });
            });

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
                        : VideoCallStatus.INITIALIZED,
                    spaceId,
                    signalData: data,
                    env: this.env,
                    callDetails: details,
                }
            );
        });

        peerConnection.on('connect', () => {
            peerConnection.send(
                JSON.stringify({
                    type: 'isAudioOn',
                    value: this.data.local.audio,
                })
            );

            // set videoCallInfo state with status connected for the receiver's end
            this.setSpaceV2Data((oldData) => {
                return produce(oldData, (draft) => {
                    const pendingIndex = getIncomingIndexFromAddress(
                        oldData.pendingPeerStreams,
                        recipientAddress
                    );
                    draft.pendingPeerStreams[pendingIndex].status = VideoCallStatus.CONNECTED;
                });
            });
        });

        peerConnection.on('data', (data: any) => {
            if (isJSON(data)) {
                const parsedData = JSON.parse(data);

                if (parsedData.type === 'isAudioOn') {
                    console.log('IS AUDIO ON', parsedData.value)

                    this.setSpaceV2Data((oldData) => {
                        return produce(oldData, (draft) => {
                            let arrayToUpdate = null;

                            // Check if the peer is in pendingPeerStreams
                            const indexInPending = draft.pendingPeerStreams.findIndex(peer => peer.address === recipientAddress);
                            if (indexInPending !== -1) {
                                arrayToUpdate = draft.pendingPeerStreams;
                            }

                            // Check if the peer is in incomingPeerStreams
                            const indexInIncoming = draft.incomingPeerStreams.findIndex(peer => peer.address === recipientAddress);
                            if (indexInIncoming !== -1) {
                                arrayToUpdate = draft.incomingPeerStreams;
                            }

                            // If the peer is found in either array, update the property
                            if (arrayToUpdate) {
                                arrayToUpdate[indexInIncoming !== -1 ? indexInIncoming : indexInPending].audio = parsedData.value;
                            }
                        });
                    });
                }

                if (parsedData.type === 'endCall') {
                    console.log('END CALL');

                    if (
                        parsedData?.details?.type === SPACE_DISCONNECT_TYPE.LEAVE
                    ) {
                        // destroy connection to only the current peer
                        peerConnection?.destroy();
                        peerConnection = null;
                        this.setSpaceV2Data((oldData) => {
                            return produce(oldData, (draft) => {
                                const incomingIndex = getIncomingIndexFromAddress(
                                    oldData.incomingPeerStreams,
                                    recipientAddress
                                );
                                draft.incomingPeerStreams.splice(incomingIndex, 1);
                            });
                        });
                    }
                    if (
                        parsedData?.details?.type === SPACE_DISCONNECT_TYPE.STOP
                    ) {
                        // destroy connection to all the peers
                        for (const connectedAddress in this.getConnectedPeerIds()) {
                            // TODO: refactor
                            // this.getPeerConnection(connectedAddress)?.destroy();
                            this.setPeerConnection(connectedAddress, undefined);
                        }
                    }

                    if (
                        parsedData?.details?.type === SPACE_DISCONNECT_TYPE.STOP
                    ) {
                        // destroy the local stream
                        if (this.data.local.stream) {
                            endStream(this.data.local.stream);
                        }

                        // reset the state
                        this.setSpaceV2Data(() => initSpaceV2Data);
                    }
                }
            } else {
                onReceiveMessage(data);
            }
        });

        peerConnection.on(
            'stream',
            (currentStream: MediaStream) => {
                console.log('received incoming stream', currentStream);
                const pendingStreamIndex = getIncomingIndexFromAddress(
                    this.data.pendingPeerStreams,
                    recipientAddress
                );

                // Here, we can handle if we want to merge stream or anything
                // this.onReceiveStream(
                //   currentStream,
                //   recipientAddress,
                //   this.data.pendingPeerStreams[pendingIndex].audio
                // );

                // remove stream from pendingPeerStreams and add it to incomingPeerStreams
                this.setSpaceV2Data((oldData) => {
                    return produce(oldData, (draft) => {
                        const peerStream = draft.pendingPeerStreams[pendingStreamIndex];
                        peerStream.stream = currentStream;
                        draft.incomingPeerStreams.push(peerStream);
                        draft.pendingPeerStreams.splice(pendingStreamIndex, 1);
                    });
                });
            }
        );
    } catch (error) {
        console.log('error in acceptInvite', error);
    }
}
