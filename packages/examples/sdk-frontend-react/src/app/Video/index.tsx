import {
  CONSTANTS,
  PushAPI,
  VideoCallData,
  VideoCallStatus,
  VideoEvent,
  video
} from '@pushprotocol/restapi';
import { ethers } from 'ethers';
import React, { useContext, useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';

import IncomingVideoModal from '../components/IncomingVideoModal';
import Toast from '../components/Toast';
import VideoPlayer from '../components/VideoPlayer';
import { EnvContext, Web3Context } from '../context';

const VideoV2 = () => {
  const { account, library } = useContext<any>(Web3Context);
  const { env } = useContext<any>(EnvContext);

  const librarySigner = library.getSigner();
  
  const aliceVideoCall = useRef<any>();
  const [data, setData] = useState<VideoCallData>(video.initVideoCallData);
  const [latestVideoEvent, setLatestVideoEvent] = useState<VideoEvent | null>(
    null
  );
  const [isPushStreamConnected, setIsPushStreamConnected] = useState(false);

  const [recipientAddress, setRecipientAddress] = useState<string>();
  const [pushUser, setPushUser] = useState<any>();

  // -1 for not initialized, 0 for checking in progress, 1 if it's not an address, 2 for user is not connected by any verification condition, 3 for valid user
  const [isValidUser, setIsValidUser] = useState(-1); 

  // Log all response
  const [logs, setLogs] = useState<any[]>(['Logs as the response comes in']);
  
  const initializePushAPI = async () => {
    const user = await PushAPI.initialize(librarySigner, {
      env: env,
    });

    const createdStream = await user.initStream([
      CONSTANTS.STREAM.VIDEO,
      CONSTANTS.STREAM.CONNECT,
      CONSTANTS.STREAM.DISCONNECT,
    ]);

    createdStream.on(CONSTANTS.STREAM.CONNECT, () => {
      setLogs((prevLogs) => ['Video Stream connected!', ...prevLogs]);
      setIsPushStreamConnected(true);
    });

    createdStream.on(CONSTANTS.STREAM.DISCONNECT, () => {
      setLogs((prevLogs) => ['Video Stream disconnected!', ...prevLogs]);
      setIsPushStreamConnected(false);
    });

    createdStream.on(CONSTANTS.STREAM.VIDEO, async (data: VideoEvent) => {
      if (data.event === CONSTANTS.VIDEO.EVENT.REQUEST) {
        setLogs((prevLogs) => ['Video Call Requested', ...prevLogs]);
        setLatestVideoEvent(data);
      }

      if (data.event === CONSTANTS.VIDEO.EVENT.APPROVE) {
        setLogs((prevLogs) => ['Video Call Approved', ...prevLogs]);
      }

      if (data.event === CONSTANTS.VIDEO.EVENT.DENY) {
        setLogs((prevLogs) => ['User denied the call', ...prevLogs]);
        alert('User Denied the Call');
      }

      if (data.event === CONSTANTS.VIDEO.EVENT.CONNECT) {
        setLogs((prevLogs) => ['Video call connected', ...prevLogs]);
      }

      if (data.event === CONSTANTS.VIDEO.EVENT.DISCONNECT) {
        setLogs((prevLogs) => ['Video call ended', ...prevLogs]);
        alert('Video Call ended!');
      }
    });

    aliceVideoCall.current = await user.video.initialize(setData, {
      stream: createdStream,
      config: {
        video: true,
        audio: true,
      },
    });

    await createdStream.connect();
    setPushUser(user);
  };

  // Here we initialize the push video API, which is the first and important step to make video calls
  useEffect(() => {
    if (!librarySigner) return;
    if (data?.incoming[0]?.status !== VideoCallStatus.UNINITIALIZED) return; // data?.incoming[0]?.status will have a status of VideoCallStatus.UNINITIALIZED when the video call is not initialized, call ended or denied. So we Initialize the Push API here.
    initializePushAPI();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [env, library, data?.incoming[0]?.status]);

  useEffect(() => {
    setLogs((prevLogs) => [`Push stream connection status is ${isPushStreamConnected}`, ...prevLogs]);
  }, [isPushStreamConnected]);

  useEffect(() => {
    if (!recipientAddress) {
      setIsValidUser(-1);
      setLogs((prevLogs) => ['Recipient cannot be empty', ...prevLogs]);

      return;
    }

    const checkUserToUserConnection = async () => {
      setLogs((prevLogs) => [`Checking if the recipient and the sender wallets are connected via Chat`, ...prevLogs]);

      // check if the recipient is a valid address
      if (!ethers.utils.isAddress(recipientAddress)) {
        setLogs((prevLogs) => [`Recipient is not a valid address, for brevity, the example doesn't support all supported wallet standards`, ...prevLogs]);
        setIsValidUser(1);
        return;
      }

      // little hack to check if the user is connected to the recipient via chat
      const response = await pushUser.chat.latest(recipientAddress);
      setLogs((prevLogs) => [`Response from the API is ${JSON.stringify(response)}`, ...prevLogs]);

      if (!response?.length) {
        setLogs((prevLogs) => [`Recipient wallet is not connected to sender, can't enable video call`, ...prevLogs]);
        setIsValidUser(2);
      } else {
        try {
          // also accept the request on the pretext if it's not accepted already
          await pushUser.chat.accept(recipientAddress);
        }
        catch (e) {
          setLogs((prevLogs) => [`Error while accepting the chat request, ${e}`, ...prevLogs]);
        }

        setLogs((prevLogs) => [`Recipient wallet is connected to sender, enabling video call`, ...prevLogs]);
        setIsValidUser(3);
      }
    };


    checkUserToUserConnection();
    
  }, [recipientAddress]);

  // This function is used to check if the recipient address is connected to the sender address via Push Chat
  // You can also pass different verification option in the future (Like connected via Lens, etc)
  const changeRecipientAddress = async (address: string) => {
    setRecipientAddress(address);
    setIsValidUser(0);

    setLogs((prevLogs) => [`Recipient address changed to ${address ? address : 'empty'}, checking if the recipient and the sender wallets are connected via Chat`, ...prevLogs]);
  };
  
  // This function is used to request a video call to a recipient
  const requestVideoCall = async (recipient: string) => {
    setLogs((prevLogs) => [`Requesting video call to ${recipient}`, ...prevLogs]);
    setIsValidUser(4);
    await aliceVideoCall.current.request([recipient]);
  };

  // This function is used to accept the incoming video call
  const acceptIncomingCall = async () => {
    setLogs((prevLogs) => [`Accepting incoming video call`, ...prevLogs]);
    await aliceVideoCall.current.approve(latestVideoEvent?.peerInfo);
  };

  // This function is used to deny the incoming video call
  const denyIncomingCall = async () => {
    setLogs((prevLogs) => [`Denying incoming video call`, ...prevLogs]);
    await aliceVideoCall.current.deny(latestVideoEvent?.peerInfo);
  };

  // This function is used to end the ongoing video call
  const endCall = async () => {
    setLogs((prevLogs) => [`Ending video call`, ...prevLogs]);
    await aliceVideoCall.current.disconnect(data?.incoming[0]?.address);
  };

  return (
    <div>
      {account ? (
        <div>
          <HContainer>
            {isValidUser === -1 && 
              <p>Enter the wallet address to continue </p>
            }

            {isValidUser === 0 && (
              <>
                <Loading /> 
                <p>Checking address </p>
              </>
            )}

            {isValidUser === 1 && (
              <>
                <Cross /> 
                <p>Not a valid address, check logs for more info </p>
              </>
            )}

            {isValidUser === 2 && (
              <>
                <Cross /> 
                <p>Valid address but current wallet and recipient not connected, click <b>Send Chat Request</b> then Ask recipient to <b>Request Call</b> </p>
                <p>Push Video can use multiple verification methods but this example checks for Push Chat connection between wallets </p>
              </>
            )}

            {isValidUser === 3 && (
              <>
                <Checkmark /> 
                <p>All good, click Request Video Call, if call isn't establishing, it might mean that chat connections are not done for sender and recipient </p>
                <p>In that case, ask recipient to request video call (that auto approves any request between the wallet) </p>
              </>
            )}

            {isValidUser === 4 && (
              <>
                <Checkmark /> 
                <p>Call requested, recipient should see popup in few secs </p>
              </>
            )}

          </HContainer>            

          <HContainer>  
            <input
              onChange={(e) => changeRecipientAddress(e.target.value)}
              value={recipientAddress}
              style={{ display: "flex", flex: "1" }}
              placeholder="recipient address"
              type="text"
            />
          </HContainer>
          
          <HContainer>
            {isValidUser === 2 && 
              <button
                onClick={() => {
                  pushUser.chat.send(recipientAddress!, {content: 'Hey, let\'s connect via video call'});
                }}
              >
                Send Chat Request
              </button>
            }

            {isValidUser === 2 && 
              <button
                onClick={() => {
                  pushUser.chat.accept(recipientAddress!);
                }}
              >
                Accept Chat Request
              </button>
            }

            <button
              onClick={() => {
                requestVideoCall(recipientAddress!);
              }}
              disabled={isValidUser !== 3 || !recipientAddress || data?.incoming[0]?.status === 3}
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
                aliceVideoCall.current?.media({ video: !data?.local.video }); // This function is used to toggle the video on/off
              }}
            >
              Toggle Video
            </button>

            <button
              disabled={!data?.incoming[0]}
              onClick={() => {
                aliceVideoCall.current?.media({ audio: !data?.local.audio }); // This function is used to toggle the audio on/off
              }}
            >
              Toggle Audio
            </button>


            {data?.incoming[0]?.status === VideoCallStatus.CONNECTED && (
              <Toast message="Video Call Connected" bg="#4caf50" />
            )}

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
          <hr / >

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

      <div>
        <hr />
        <h2>Logs</h2>
        {logs.map((log, index) => (
          <LogText key={index}>{JSON.stringify(log)}</LogText>
        ))}
      </div>
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

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Loading = styled.div`
  border: 2px solid #eee; /* Light grey */
  border-top: 2px solid rgb(226,8,128); /* Blue */
  border-radius: 50%;
  width: 12px;
  height: 12px;
  animation: ${spin} 1s linear infinite;
`;

const Checkmark = styled.div`
  width: 12px;
  height: 24px;
  border: solid rgb(52, 168, 6);
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
`;

const Cross = styled.div`
  width: 20px;
  height: 20px;
  position: relative;
  &:before, &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 9px;
    height: 20px;
    width: 2px;
    background-color: red;
  }
  &:before {
    transform: rotate(45deg);
  }
  &:after {
    transform: rotate(-45deg);
  }
`;

const LogText = styled.p`
  font-family: 'Courier New', Courier, monospace;
  background-color: #ddd;
  font-size: 12px;
`;

export default VideoV2;
