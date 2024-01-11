import type { NextPage } from 'next';

import {
  PushAPI,
  CONSTANTS,
  VideoCallData,
  VideoEvent,
  VideoEventType,
  VideoCallStatus,
} from '@pushprotocol/restapi';

import styled from 'styled-components';

import { useContext, useEffect, useRef, useState } from 'react';
import IncomingVideoModal from '../components/IncomingVideoModal';
import VideoPlayer from '../components/VideoPlayer';
import { EnvContext, Web3Context } from '../context';
import { initVideoCallData } from '@pushprotocol/restapi/src/lib/video'; // works using like this, import { initVideoCallData } from 'packages/restapi/src/lib/video';
const VideoV2: NextPage = () => {
  const { account, library } = useContext<any>(Web3Context);
  const { env } = useContext<any>(EnvContext);
  const librarySigner = library.getSigner();
  const aliceVideoCall = useRef<any>();
  const [latestVideoEvent, setLatestVideoEvent] = useState<VideoEvent | null>(
    null
  );
  const [isPushStreamConnected, setIsPushStreamConnected] = useState(false);

  const [data, setData] = useState<VideoCallData>(initVideoCallData);
  const [recipientAddress, setRecipientAddress] = useState<string>();

  const initializePushAPI = async () => {
    const userAlice = await PushAPI.initialize(librarySigner, {
      env: env,
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

    createdStream.on(CONSTANTS.STREAM.VIDEO, async (data: VideoEvent) => {
      if (data.event === VideoEventType.RequestVideo) {
        setLatestVideoEvent(data);
      }

      if (data.event === VideoEventType.ApproveVideo) {
        alert('Video Call Connected');
      }

      if (data.event === VideoEventType.DenyVideo) {
        alert('User Denied the Call');
      }

      if (data.event === VideoEventType.ConnectVideo) {
        alert('Video Call Connected');
      }

      if (data.event === VideoEventType.DisconnectVideo) {
        alert('Video Call ended!');
      }
    });

    aliceVideoCall.current = await userAlice.video.initialize(setData, {
      stream: createdStream,
      config: {
        video: true,
        audio: true,
      },
    });

    await createdStream.connect();
  };

  useEffect(() => {
    if (!librarySigner) return;
    if (data?.incoming[0]?.status !== VideoCallStatus.UNINITIALIZED) return;
    initializePushAPI();
  }, [env, library, data?.incoming[0]?.status]);

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
  };
  const denyIncomingCall = async () => {
    await aliceVideoCall.current.deny(latestVideoEvent?.peerInfo);
  };
  const endCall = async () => {
    await aliceVideoCall.current.disconnect(data?.incoming[0]?.address);
  };

  return (
    <div>
      {account ? (
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
              disabled={!data?.incoming[0]}
              onClick={() => {
                aliceVideoCall.current?.media({ video: !data?.local.video });
              }}
            >
              Toggle Video
            </button>

            <button
              disabled={!data?.incoming[0]}
              onClick={() => {
                aliceVideoCall.current?.media({ audio: !data?.local.audio });
              }}
            >
              Toggle Audio
            </button>
            {data?.incoming[0].status === VideoCallStatus.RECEIVED && (
              <IncomingVideoModal
                callerID={latestVideoEvent?.peerInfo?.address}
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
              <VideoPlayer stream={data?.local.stream} isMuted={true} />
            </VContainer>

            <VContainer>
              <h2>Incoming Video</h2>
              <VideoPlayer stream={data?.incoming[0].stream} isMuted={false} />
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
