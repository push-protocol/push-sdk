// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as Peer from 'simple-peer';
import { produce } from "immer";

import { SpaceV2 } from "./SpaceV2";
import { SpaceInviteInputOptions } from "./types";

import getIncomingIndexFromAddress from "../video/helpers/getIncomingIndexFromAddress";
import { VideoCallStatus } from "../types";
import { getIceServerConfig } from "../video/helpers/getIceServerConfig";
import sendSpaceNotification from './helpers/sendSpaceNotification';
import { VIDEO_CALL_TYPE } from '../payloads/constants';
import isJSON from '../video/helpers/isJSON';

export async function inviteToJoin(
    this: SpaceV2, 
    options: SpaceInviteInputOptions
  ): Promise<void> {
    const {
      senderAddress,
      recipientAddress,
      spaceId,
      onReceiveMessage = (message: string) => {
        console.log('received a meesage', message);
      },
      retry = false,
      details,
    } = options || {};

    console.log('request', 'options', options);

    const recipientAddresses = Array.isArray(recipientAddress)
      ? recipientAddress
      : [recipientAddress];

    for (const recipientAddress of recipientAddresses) {
      try {
        // set videoCallInfo state with status 1 (call initiated)
        this.setSpaceV2Data((oldData) => {
          return produce(oldData, (draft) => {
            draft.local.address = senderAddress;
            draft.spaceInfo.spaceId = spaceId;
            draft.meta.initiator.address = senderAddress;

            const incomingIndex = getIncomingIndexFromAddress(
              oldData.pendingPeerStreams,
              recipientAddress
            );

            if (incomingIndex === -1) {
              draft.pendingPeerStreams.push({
                stream: null,
                audio: null,
                video: null,
                address: recipientAddress,
                status: retry
                  ? VideoCallStatus.RETRY_INITIALIZED
                  : VideoCallStatus.INITIALIZED,
                retryCount: retry ? 1 : 0,
              });
            } else {
              draft.pendingPeerStreams[incomingIndex].address = recipientAddress;
              draft.pendingPeerStreams[incomingIndex].status = retry
                ? VideoCallStatus.RETRY_INITIALIZED
                : VideoCallStatus.INITIALIZED;
              draft.pendingPeerStreams[incomingIndex].retryCount += retry ? 1 : 0;
            }
          });
        });

        // fetching the iceServers config
        const iceServerConfig = await getIceServerConfig(this.env);
        const peerConnection = new Peer({
          initiator: true,
          trickle: false,
          stream: this.data.local.stream,
          config: {
            iceServers: iceServerConfig,
          },
        });

        this.setPeerConnection(recipientAddress, peerConnection);

        peerConnection.on('signal', (data: any) => {
          this.setSpaceV2Data((oldData) => {
            return produce(oldData, (draft) => {
              draft.meta.initiator.signal = data;
            });
          });

          // sending notification to the recipientAddress with video call signaling data
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
                ? VideoCallStatus.RETRY_INITIALIZED
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
            `initial message from ${senderAddress}`
          );
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
        });

        peerConnection.on('data', (data: any) => {
            if (isJSON(data)) {
                const parsedData = JSON.parse(data);
    
                if (parsedData.type === 'isVideoOn') {
                    console.log('IS VIDEO ON', parsedData.value);
                    this.setSpaceV2Data((oldData) => {
                        return produce(oldData, (draft) => {
                        const incomingIndex = getIncomingIndexFromAddress(
                            oldData.pendingPeerStreams,
                            recipientAddress
                        );
                        draft.pendingPeerStreams[incomingIndex].video = parsedData.value;
                        });
                    });
                }
    
                if (parsedData.type === 'isAudioOn') {
                    console.log('IS AUDIO ON', parsedData.value);
                    this.setSpaceV2Data((oldData) => {
                        return produce(oldData, (draft) => {
                        const incomingIndex = getIncomingIndexFromAddress(
                            oldData.pendingPeerStreams,
                            recipientAddress
                        );
                        draft.pendingPeerStreams[incomingIndex].audio = parsedData.value;
                        });
                    });
                }
            }
        });

        peerConnection.on(
          'stream',
          (currentStream: MediaStream) => {
            console.log('received incoming stream', currentStream);
            const pendingIndex = getIncomingIndexFromAddress(
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
                draft.incomingPeerStreams.push(draft.pendingPeerStreams[pendingIndex]);
                draft.pendingPeerStreams.splice(pendingIndex, 1);
              });
            });
          }
        );
      } catch (err) {
        console.log('error in request', err);
      }
    }
  }
