import type { NextPage } from 'next';

import {
  PushAPI,
  CONSTANTS,
  VideoEvent,
  VideoEventType,
} from '@pushprotocol/restapi';
import { useAccount, useNetwork, useSigner } from 'wagmi';
import styled from 'styled-components';

import { useEffect, useRef, useState } from 'react';
import { VIDEO_NOTIFICATION_ACCESS_TYPE } from '@pushprotocol/restapi/src/lib/payloads/constants';
import { useStream } from '../hooks/useStream';

const VideoV2: NextPage = () => {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { data: signer } = useSigner();

  const aliceVideoCall = useRef<any>();
  const [aliceStream, setAliceStream] = useState<any>();
  const { stream, isPushSocketConnected, latestFeedItem } = useStream({
    streamObject: aliceStream,
  });

  const [data, setData] = useState();

  useEffect(() => {
    if (!signer) return;
    const initializePushAPI = async () => {
      const userAlice = await PushAPI.initialize(signer, {
        env: CONSTANTS.ENV.DEV,
      });

      aliceVideoCall.current = await userAlice.video.initialize(setData, {
        media: {
          video: true,
          audio: true,
        },
      });
      const astream = await userAlice.initStream([CONSTANTS.STREAM.CHAT]);
      setAliceStream(astream);
    };

    initializePushAPI();
  }, [signer]);
  useEffect(() => {
    console.log('stream', stream);
  }, [stream]);
  useEffect(() => {
    isPushSocketConnected;
    console.log('latestFeedItem', latestFeedItem);
  }, [isPushSocketConnected, latestFeedItem]);
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
      <Heading>Push Video SDK Demo</Heading>

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
