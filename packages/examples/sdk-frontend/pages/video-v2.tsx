import type { NextPage } from 'next';

import {
  PushAPI,
  CONSTANTS,
  VideoCallData,
  VideoEvent,
} from '@pushprotocol/restapi';
import { useAccount, useNetwork, useSigner } from 'wagmi';
import styled from 'styled-components';

import { useEffect, useRef, useState } from 'react';
import { VIDEO_NOTIFICATION_ACCESS_TYPE } from '@pushprotocol/restapi/src/lib/payloads/constants';
import { initVideoCallData } from '@pushprotocol/restapi/src/lib/video';

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

      createdStream.on(CONSTANTS.STREAM.VIDEO, (data: VideoEvent) => {
        console.log('RECEIVED VIDEO EVENT: ', data);
        if (data) {
          setLatestVideoEvent(data);
        }
      });

      await createdStream.connect();

      aliceVideoCall.current = await userAlice.video.initialize(setData, {
        socketStream: createdStream,
        media: {
          video: true,
          audio: true,
        },
      });
    };

    initializePushAPI();
  }, [signer]);

  useEffect(() => {
    console.log('isPushStreamConnected', isPushStreamConnected);
    if (isPushStreamConnected) {
      console.log('latestVideoEvent', latestVideoEvent);
    }
  }, [isPushStreamConnected, latestVideoEvent]);

  const setRequestVideoCall = async () => {
    await aliceVideoCall.current.request(
      ['0xb73923eCcfbd6975BFd66CD1C76FA6b883E30365'],
      {
        rules: {
          access: {
            type: VIDEO_NOTIFICATION_ACCESS_TYPE.PUSH_CHAT,
            data: {
              chatId:
                '252395e6b5d0ae0796e05e648240f7950f7a50a80906cdf6accdf7079e311dea',
            },
          },
        },
      }
    );
  };

  return (
    <div>
      <Heading>Push Video v2 SDK Demo</Heading>

      {isConnected ? (
        <div>
          <button onClick={setRequestVideoCall}>CALL</button>
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

// ... (rest of your styled components)

export default VideoV2;
