// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as Peer from 'simple-peer';
import { produce } from 'immer';

import { initSpaceV2Data, type SpaceV2 } from './SpaceV2';
import sendSpaceNotification from './helpers/sendSpaceNotification';

import { SPACE_ACCEPT_REQUEST_TYPE, SPACE_DISCONNECT_TYPE, SPACE_REQUEST_TYPE } from '../payloads/constants';
import { VideoCallStatus } from '../types';

// imports from Video
import getIncomingIndexFromAddress from '../video/helpers/getIncomingIndexFromAddress';
import getConnectedAddresses from '../video/helpers/getConnectedAddresses';
import getConnectToAddresses from '../video/helpers/getConnectToAddresses';
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
                    type: 'isVideoOn',
                    value: this.data.local.video,
                })
            );
            peerConnection.send(
                JSON.stringify({
                    type: 'isAudioOn',
                    value: this.data.local.audio,
                })
            );

            // send the addresses the local peer is connected to remote peer
            const connectedAddresses = getConnectedAddresses({
                incomingPeers: this.data.incomingPeerStreams,
            });

            console.log(
                'ACCEPT REQUEST - SENDING THE CONNECTED ADDRESSES',
                'connectedAddresses',
                connectedAddresses
            );
            peerConnection.send(
                JSON.stringify({
                    type: 'connectedAddresses',
                    value: connectedAddresses,
                })
            );

            // set videoCallInfo state with status connected for the receiver's end
            this.setSpaceV2Data((oldData) => {
                return produce(oldData, (draft) => {
                    const incomingIndex = getIncomingIndexFromAddress(
                        oldData.incomingPeerStreams,
                        recipientAddress
                    );
                    draft.incomingPeerStreams[incomingIndex].status = VideoCallStatus.CONNECTED;
                });
            });
        });

        peerConnection.on('data', (data: any) => {
            if (isJSON(data)) {
                const parsedData = JSON.parse(data);

                if (parsedData.type === 'connectedAddresses') {
                    console.log(
                        'ACCEPT REQUEST - RECEIVING CONNECTED ADDRESSES',
                        'CONNECTED ADDRESSES',
                        parsedData.value
                    );

                    const receivedConnectedAddresses = parsedData.value;
                    const localConnectedAddresses = getConnectedAddresses({
                        incomingPeers: this.data.incomingPeerStreams,
                    });

                    // find out the address to which local peer is not connected to but the remote peer is
                    // then connect with them
                    const connectToAddresses = getConnectToAddresses({
                        localAddress: senderAddress,
                        localConnectedAddresses,
                        receivedConnectedAddresses,
                    });
                    this.request({
                        senderAddress,
                        recipientAddress: connectToAddresses,
                        spaceId,
                        details: {
                            type: SPACE_REQUEST_TYPE.ESTABLISH_MESH,
                            data: {},
                        },
                    });
                }

                if (parsedData.type === 'isVideoOn') {
                    console.log('IS VIDEO ON', parsedData.value);
                    this.setSpaceV2Data((oldData) => {
                        return produce(oldData, (draft) => {
                            const incomingIndex = getIncomingIndexFromAddress(
                                oldData.incomingPeerStreams,
                                recipientAddress
                            );
                            draft.incomingPeerStreams[incomingIndex].video = parsedData.value;
                        });
                    });
                }

                if (parsedData.type === 'isAudioOn') {
                    console.log('IS AUDIO ON', parsedData.value);
                    this.setSpaceV2Data((oldData) => {
                        return produce(oldData, (draft) => {
                            const incomingIndex = getIncomingIndexFromAddress(
                                oldData.incomingPeerStreams,
                                recipientAddress
                            );
                            draft.incomingPeerStreams[incomingIndex].audio = parsedData.value;
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
                const incomingIndex = getIncomingIndexFromAddress(
                    this.data.pendingPeerStreams,
                    recipientAddress
                );

                // Here, we can handle if we want to merge stream or anything
                // this.onReceiveStream(
                //   currentStream,
                //   recipientAddress,
                //   this.data.pendingPeerStreams[pendingIndex].audio
                // );

                this.setSpaceV2Data((oldData) => {
                    return produce(oldData, (draft) => {
                        draft.incomingPeerStreams[incomingIndex].stream = currentStream;
                    });
                });
            }
        );
    } catch (error) {
        console.log('error in acceptInvite', error);
    }
}
