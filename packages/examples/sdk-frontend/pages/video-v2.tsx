import type { NextPage } from 'next';

import {
  PushAPI,
  CONSTANTS,
  VideoCallData,
  VideoEvent,
  VideoEventType,
} from '@pushprotocol/restapi';
import { useAccount, useNetwork, useSigner } from 'wagmi';
import styled from 'styled-components';

import { useEffect, useRef, useState } from 'react';
import { initVideoCallData } from '@pushprotocol/restapi/src/lib/video';
import IncomingVideoModal from '../components/IncomingVideoModal';
import Toast from '../components/Toast';
import VideoPlayer from '../components/VideoPlayer';
import { VIDEO_NOTIFICATION_ACCESS_TYPE } from '@pushprotocol/restapi/src/lib/payloads/constants';

const VideoV2: NextPage = () => {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { data: signer } = useSigner();

  const aliceVideoCall = useRef<any>();
  const [latestVideoEvent, setLatestVideoEvent] = useState<VideoEvent | null>(
    null
  );
  const [isPushStreamConnected, setIsPushStreamConnected] = useState(false);

  const [data, setData] = useState<VideoCallData>(initVideoCallData);
  const [recipientAddress, setRecipientAddress] = useState<string>();
  const [showIncomingVideoModal, setShowIncomingVideoModal] = useState(false);
  const [showCallDisconnectedToast, setShowCallDisconnectedToast] =
    useState(false);
  const [showCallConnectedToast, setShowCallConnectedToast] = useState(false);
  useEffect(() => {
    console.log('data', data);
  }, [data]);
  useEffect(() => {
    if (!signer) return;

    const initializePushAPI = async () => {
      console.log('initializePushAPI');

      const userAlice = await PushAPI.initialize(signer, {
        env: CONSTANTS.ENV.DEV,
      });

      const createdStream = await userAlice.initStream([
        CONSTANTS.STREAM.VIDEO,
        CONSTANTS.STREAM.CONNECT,
        CONSTANTS.STREAM.DISCONNECT,
      ]);

      createdStream.on(CONSTANTS.STREAM.CONNECT, () => {
        console.log('PUSH STREAM CONNECTED: ');
        setIsPushStreamConnected(true);
      });

      createdStream.on(CONSTANTS.STREAM.DISCONNECT, () => {
        console.log('PUSH STREAM DISCONNECTED: ');
        setIsPushStreamConnected(false);
      });

      createdStream.on(CONSTANTS.STREAM.VIDEO, async (data: VideoEvent) => {
        // Handle incoming call, when the type is RequestVideo
        if (data.event === VideoEventType.RequestVideo) {
          setLatestVideoEvent(data);
          setShowIncomingVideoModal(true);
        }

        // If the received status is ApproveVideo that means we can connect the video call
        if (data.event === VideoEventType.ApproveVideo) {
          // setLatestVideoEvent(data);

          // // connecting the call using received peerInfo
          // aliceVideoCall.current.connect(data.peerInfo);
          console.log('ApproveVideo', data);
          setShowCallConnectedToast(true);
        }

        // If the received status is DenyVideo that means the call has ended
        if (data.event === VideoEventType.DenyVideo) {
          // here you can do a window reload
        }

        // If the received status is ConnectVideo that means the call was connected
        if (data.event === VideoEventType.ConnectVideo) {
          // can update the ui with a toast or something that the call is connected
          console.log('ConnectVideo', data);
          setShowCallConnectedToast(true);
        }

        // If the received status is DisconnectVideo that means the call has ended/someone hung up after it was connected
        if (data.event === VideoEventType.DisconnectVideo) {
          setShowCallDisconnectedToast(true);
          setTimeout(() => {
            window.location.reload();
          }, 5000);
        }
      });

      aliceVideoCall.current = await userAlice.video.initialize(setData, {
        socketStream: createdStream,
        media: {
          video: true,
          audio: true,
        },
      });
      await createdStream.connect();
    };

    initializePushAPI();
  }, [signer]);

  useEffect(() => {
    console.log('isPushStreamConnected', isPushStreamConnected);
    if (isPushStreamConnected)
      console.log('latestVideoEvent', latestVideoEvent);
  }, [isPushStreamConnected, latestVideoEvent]);

  const requestVideoCall = async (recipient: string) => {
    await aliceVideoCall.current.request([recipient]);
  };

  const acceptIncomingCall = async () => {
    await aliceVideoCall.current.approve(latestVideoEvent?.peerInfo);
    setShowIncomingVideoModal(false);
  };
  const denyIncomingCall = async () => {
    console.log('denyIncomingCall', latestVideoEvent?.peerInfo);
    await aliceVideoCall.current.deny(latestVideoEvent?.peerInfo);
    setShowIncomingVideoModal(false);
  };
  const endCall = async () => {
    console.log(recipientAddress);
    await aliceVideoCall.current.disconnect(recipientAddress);
  };

  return (
    <div>
      <Heading>Push Video v2 SDK Demo</Heading>

      {isConnected ? (
        <div>
          {showCallDisconnectedToast && <Toast message="Call ended!" />}
          {showCallConnectedToast && <Toast message="Call Connected!" />}
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
            <button onClick={endCall} disabled={!data.incoming[1]}>
              End Video Call
            </button>
            <button
              disabled={!data.incoming[1]}
              onClick={() => {
                aliceVideoCall.current?.media({ video: !data.local.video });
              }}
            >
              Toggle Video
            </button>

            <button
              disabled={!data.incoming[1]}
              onClick={() => {
                aliceVideoCall.current?.media({ audio: !data.local.audio });
              }}
            >
              Toggle Audio
            </button>
            {showIncomingVideoModal && (
              <IncomingVideoModal
                callerID={latestVideoEvent?.peerInfo?.address}
                onAccept={acceptIncomingCall}
                onReject={denyIncomingCall}
              />
            )}
          </HContainer>
          <HContainer>
            <VContainer>
              <h2>Local Video</h2>
              <VideoPlayer stream={data.local.stream} isMuted={true} />
            </VContainer>
            {data.incoming[1]?.stream && (
              <VContainer>
                <h2>Incoming Video</h2>
                <VideoPlayer stream={data.incoming[1].stream} isMuted={false} />
              </VContainer>
            )}
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
