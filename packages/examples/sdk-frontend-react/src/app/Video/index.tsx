import type { NextPage } from 'next';

import {
  PushAPI,
  CONSTANTS,
  VideoCallData,
  VideoEvent,
  VideoEventType,
} from '@pushprotocol/restapi';

import styled from 'styled-components';

import { useContext, useEffect, useRef, useState } from 'react';
import IncomingVideoModal from '../components/IncomingVideoModal';
import Toast from '../components/Toast';
import VideoPlayer from '../components/VideoPlayer';
import { EnvContext, Web3Context } from '../context';

const VideoV2: NextPage = () => {
  const { account, library } = useContext<any>(Web3Context);
  const { env } = useContext<any>(EnvContext);
  const librarySigner = library.getSigner();
  const aliceVideoCall = useRef<any>();
  const [latestVideoEvent, setLatestVideoEvent] = useState<VideoEvent | null>(
    null
  );
  const [isPushStreamConnected, setIsPushStreamConnected] = useState(false);

  const [data, setData] = useState<VideoCallData>();
  const [recipientAddress, setRecipientAddress] = useState<string>();
  const [showIncomingVideoModal, setShowIncomingVideoModal] = useState(false);
  const [showCallDisconnectedToast, setShowCallDisconnectedToast] =
    useState(false);
  const [showCallConnectedToast, setShowCallConnectedToast] = useState(false);
  const [userDeniedCallStatus, setUserDeniedCallStatus] = useState(false);

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
        console.log('ApproveVideo', data);
        setShowCallConnectedToast(true);
        setLatestVideoEvent(data);
      }

      // If the received status is DenyVideo that means the call has ended
      if (data.event === VideoEventType.DenyVideo) {
        // here you can do a window reload
        console.log('DenyVideo', data);
        setUserDeniedCallStatus(true);
        initializePushAPI();
      }

      // If the received status is ConnectVideo that means the call was connected
      if (data.event === VideoEventType.ConnectVideo) {
        // can update the ui with a toast or something that the call is connected
        console.log('ConnectVideo', data);
        setShowCallConnectedToast(true);
      }

      // If the received status is DisconnectVideo that means the call has ended/someone hung up after it was connected
      if (data.event === VideoEventType.DisconnectVideo) {
        console.log('DisconnectVideo', data);
        setShowCallDisconnectedToast(true);
        initializePushAPI();
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

  useEffect(() => {
    if (!librarySigner) return;
    console.log('env', env);
    initializePushAPI();
  }, [env, library]);

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
    await aliceVideoCall.current.deny(latestVideoEvent?.peerInfo);
    setShowIncomingVideoModal(false);
    initializePushAPI();
  };
  const endCall = async () => {
    await aliceVideoCall.current.disconnect(
      latestVideoEvent?.peerInfo?.address
    );

    initializePushAPI();
  };

  return (
    <div>
      {account ? (
        <div>
          {showCallDisconnectedToast && (
            <Toast message="Call ended!" bg="black" />
          )}
          {showCallConnectedToast && (
            <Toast message="Call Connected!" bg="green" />
          )}
          {userDeniedCallStatus && (
            <Toast message="User denied call!" bg="red" />
          )}
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
            <button onClick={endCall} disabled={!data?.incoming[0]}>
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
            {showIncomingVideoModal && (
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
