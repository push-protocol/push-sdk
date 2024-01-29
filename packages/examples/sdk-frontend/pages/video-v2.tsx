import type { NextPage } from 'next';
import React, { useEffect, useRef, useState } from 'react';

import { useAccount, useWalletClient } from 'wagmi';
import styled from 'styled-components';
import { CONSTANTS, PushAPI, TYPES } from '@pushprotocol/restapi';

import IncomingVideoModal from '../components/IncomingVideoModal';
import VideoPlayer from '../components/VideoPlayer';
import Toast from '../components/Toast';

const VideoV2: NextPage = () => {
  const { isConnected } = useAccount();

  const { data: signer } = useWalletClient();

  const aliceVideoCall = useRef<any>();

  const [isPushStreamConnected, setIsPushStreamConnected] = useState(false);

  const [data, setData] = useState<TYPES.VIDEO.DATA>(
    CONSTANTS.VIDEO.INITIAL_DATA
  );
  const [incomingCallerAddress, setIncomingCallerAddress] = useState<
    string | null
  >(null);
  const [recipientAddress, setRecipientAddress] = useState<string>();

  const initializePushAPI = async () => {
    const userAlice = await PushAPI.initialize(signer, {
      env: CONSTANTS.ENV.DEV,
    });

    const createdStream = await userAlice.initStream([
      CONSTANTS.STREAM.VIDEO,
      CONSTANTS.STREAM.CONNECT,
      CONSTANTS.STREAM.DISCONNECT,
    ]);

    createdStream.on(CONSTANTS.STREAM.CONNECT, () => {
      setIsPushStreamConnected(true);
    });

    createdStream.on(CONSTANTS.STREAM.DISCONNECT, () => {
      setIsPushStreamConnected(false);
    });

    createdStream.on(
      CONSTANTS.STREAM.VIDEO,
      async (data: TYPES.VIDEO.EVENT) => {
        if (data.event === CONSTANTS.VIDEO.EVENT.REQUEST) {
          setIncomingCallerAddress(data.peerInfo.address);
        }

        if (data.event === CONSTANTS.VIDEO.EVENT.APPROVE) {
          console.log('Video Call Approved');
        }

        if (data.event === CONSTANTS.VIDEO.EVENT.DENY) {
          alert('User Denied the Call');
        }

        if (data.event === CONSTANTS.VIDEO.EVENT.CONNECT) {
          console.log('Video Call Connected');
        }

        if (data.event === CONSTANTS.VIDEO.EVENT.DISCONNECT) {
          alert('Video Call ended!');
        }
      }
    );

    aliceVideoCall.current = await userAlice.video.initialize(setData, {
      stream: createdStream,
      config: {
        video: true,
        audio: true,
      },
    });

    await createdStream.connect();
  };

  // Here we initialize the push video API, which is the first and important step to make video calls
  useEffect(() => {
    if (!signer) return;
    if (data?.incoming[0]?.status !== CONSTANTS.VIDEO.STATUS.UNINITIALIZED)
      return; // data?.incoming[0]?.status will have a status of VideoCallStatus.UNINITIALIZED when the video call is not initialized, call ended or denied. So we Initialize the Push API here.
    initializePushAPI();
  }, [signer, data.incoming[0].status]);

  useEffect(() => {
    console.log('isPushStreamConnected', isPushStreamConnected); // This will be true when the push stream is connected
  }, [isPushStreamConnected]);

  // This function is used to request a video call to a recipient
  const requestVideoCall = async (recipient: string) => {
    await aliceVideoCall.current.request([recipient]);
  };

  // This function is used to accept the incoming video call
  const acceptIncomingCall = async () => {
    await aliceVideoCall.current.approve(incomingCallerAddress);
  };

  // This function is used to deny the incoming video call
  const denyIncomingCall = async () => {
    await aliceVideoCall.current.deny(incomingCallerAddress);
  };

  // This function is used to end the ongoing video call
  const endCall = async () => {
    await aliceVideoCall.current.disconnect();
  };

  return (
    <div>
      <Heading>Push Video v2 SDK Demo</Heading>

      {isConnected ? (
        <div>
          <HContainer>
            <input
              onChange={(e) => setRecipientAddress(e.target.value)}
              value={recipientAddress}
              placeholder="recipient address"
              type="text"
            />
          </HContainer>
          <HContainer>
            <button
              onClick={() => {
                requestVideoCall(recipientAddress!);
              }}
              disabled={!recipientAddress}
            >
              Request Video Call
            </button>
            <button
              onClick={endCall}
              disabled={data?.incoming[0]?.status !== 3}
            >
              End Video Call
            </button>
            <button
              disabled={!data.incoming[0]}
              onClick={() => {
                aliceVideoCall.current?.config({ video: !data.local.video }); // This function is used to toggle the video on/off
              }}
            >
              Toggle Video
            </button>

            <button
              disabled={!data.incoming[0]}
              onClick={() => {
                aliceVideoCall.current?.config({ audio: !data?.local.audio }); // This function is used to toggle the audio on/off
              }}
            >
              Toggle Audio
            </button>

            {data?.incoming[0]?.status === CONSTANTS.VIDEO.STATUS.CONNECTED && (
              <Toast message="Video Call Connected" bg="#4caf50" />
            )}

            {data.incoming[0].status === CONSTANTS.VIDEO.STATUS.RECEIVED && (
              <IncomingVideoModal
                callerID={incomingCallerAddress!}
                onAccept={acceptIncomingCall}
                onReject={denyIncomingCall}
              />
            )}
          </HContainer>
          <HContainer>
            <p>LOCAL VIDEO: {data?.local.video ? 'TRUE' : 'FALSE'}</p>
            <p>LOCAL AUDIO: {data?.local.audio ? 'TRUE' : 'FALSE'}</p>
            <p>INCOMING VIDEO: {data?.incoming[0]?.video ? 'TRUE' : 'FALSE'}</p>
            <p>INCOMING AUDIO: {data?.incoming[0]?.audio ? 'TRUE' : 'FALSE'}</p>
          </HContainer>
          <HContainer>
            <VContainer>
              <h2>Local Video</h2>
              <VideoPlayer stream={data.local.stream} isMuted={true} />
            </VContainer>

            <VContainer>
              <h2>Incoming Video</h2>
              <VideoPlayer stream={data.incoming[0].stream} isMuted={false} />
            </VContainer>
          </HContainer>
        </div>
      ) : (
        'Please connect your wallet.'
      )}
    </div>
  );
};

const Heading = styled.h1`
  margin: 20px 40px;
`;

const HContainer = styled.div`
  display: flex;
  gap: 20px;
  margin: 20px 40px;
`;

const VContainer = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
  width: fit-content;
  height: fit-content;
`;

export default VideoV2;
