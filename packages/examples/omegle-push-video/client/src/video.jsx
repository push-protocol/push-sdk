import {CONSTANTS, VideoCallStatus} from "@pushprotocol/restapi";
import {useAccount, useWalletClient} from "wagmi";

import {useEffect, useRef, useState} from "react";
import {initVideoCallData} from "@pushprotocol/restapi/src/lib/video";

import VideoFrame from "./components/VideoFrame";
import Loader from "./components/Loader";

const Video = ({peerAddress, userAlice, initiator, onEndCall}) => {
  const {data: signer} = useWalletClient();
  const {address: walletAddress} = useAccount();
  const aliceVideoCall = useRef();
  const [isPushStreamConnected, setIsPushStreamConnected] = useState(false);
  const [data, setData] = useState(initVideoCallData);
  const createdStream = useRef();
  const initializePushAPI = async () => {
    createdStream.current = await userAlice.initStream([
      CONSTANTS.STREAM.VIDEO,
      CONSTANTS.STREAM.CONNECT,
      CONSTANTS.STREAM.DISCONNECT,
    ]);

    createdStream.current.on(CONSTANTS.STREAM.CONNECT, () => {
      setIsPushStreamConnected(true);
    });

    createdStream.current.on(CONSTANTS.STREAM.DISCONNECT, () => {
      setIsPushStreamConnected(false);
    });

    createdStream.current.on(CONSTANTS.STREAM.VIDEO, async (data) => {
      if (data.event === CONSTANTS.VIDEO.EVENT.REQUEST) {
        await aliceVideoCall.current.approve(data?.peerInfo);
      }
      if (data.event === CONSTANTS.VIDEO.EVENT.DISCONNECT) {
        createdStream.current.disconnect();
      }
    });

    aliceVideoCall.current = await userAlice.video.initialize(setData, {
      stream: createdStream.current,
      config: {
        video: true,
        audio: true,
      },
    });

    await createdStream.current.connect();

    if (initiator.toLowerCase() === walletAddress.toLowerCase()) {
      await aliceVideoCall.current.request([peerAddress]);
    }
  };

  // Here we initialize the push video API, which is the first and important step to make video calls
  useEffect(() => {
    if (!signer) return;
    initializePushAPI();
  }, []);

  useEffect(() => {
    console.log("isPushStreamConnected", isPushStreamConnected);
  }, [isPushStreamConnected]);

  return (
    <div>
      <div>
        {data?.incoming[0]?.status === VideoCallStatus.CONNECTED &&
        data?.incoming[0].stream ? (
          <VideoFrame
            data={data}
            onToggleMic={() => {
              aliceVideoCall.current?.media({audio: !data?.local.audio});
            }}
            onToggleCam={() => {
              aliceVideoCall.current?.media({video: !data?.local.video});
            }}
            onEndCall={async () => {
              await aliceVideoCall.current.disconnect(
                data?.incoming[0]?.address
              );
              createdStream.current.disconnect();
              onEndCall();
              window.location.reload();
            }}
          />
        ) : (
          <div>
            <Loader text={"Breathe in"} text2={"Breathe out"} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Video;
