// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as Peer from 'simple-peer';
import { produce } from "immer";

import { SpaceV2 } from "./SpaceV2";
import sendSpaceNotification from './helpers/sendSpaceNotification';

import { VideoCallStatus } from "../types";
import { SPACE_REQUEST_TYPE } from '../payloads';

// imports from video
import getIncomingIndexFromAddress from "../video/helpers/getIncomingIndexFromAddress";
import { getIceServerConfig } from "../video/helpers/getIceServerConfig";
import isJSON from '../video/helpers/isJSON';


export interface ISpaceInviteInputOptions {
  senderAddress: string;
  recipientAddress: string;
  spaceId: string;
  onReceiveMessage?: (message: string) => void;
  retry?: boolean;
  details?: {
      type: SPACE_REQUEST_TYPE;
      data: Record<string, unknown>;
  };
};

export async function inviteToJoin(
    this: SpaceV2, 
    options: ISpaceInviteInputOptions
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
    
            if (parsedData.type === 'isVideoOn' || parsedData.type === 'isAudioOn') {
              console.log(`IS ${parsedData.type.toUpperCase()}`, parsedData.value);
  
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
                    if (parsedData.type === 'isVideoOn') {
                      arrayToUpdate[indexInIncoming !== -1 ? indexInIncoming : indexInPending].video = parsedData.value;
                    }
                    if (parsedData.type === 'isAudioOn') {
                      arrayToUpdate[indexInIncoming !== -1 ? indexInIncoming : indexInPending].audio = parsedData.value;
                    }
                  }
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
                const peerStream = draft.pendingPeerStreams[pendingIndex];
                peerStream.stream = currentStream;
                draft.incomingPeerStreams.push(peerStream);
                draft.pendingPeerStreams.splice(pendingIndex, 1);
              });
            });
          }
        );
      } catch (err) {
        console.log('error in invite', err);
      }
    }
  }
