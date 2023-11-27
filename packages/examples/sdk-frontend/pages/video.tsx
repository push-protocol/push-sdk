import type { NextPage } from 'next';

import * as PushAPI from '@pushprotocol/restapi';
import { ENV } from '@pushprotocol/restapi/src/lib/constants';
import { produce } from 'immer';
import { useAccount, useNetwork, useSigner } from 'wagmi';
import styled from 'styled-components';

import { usePushSocket } from '../hooks/usePushSocket';
import { useEffect, useRef, useState } from 'react';
import VideoPlayer from '../components/VideoPlayer';
import { ADDITIONAL_META_TYPE } from '@pushprotocol/restapi/src/lib/payloads/constants';

interface VideoCallMetaDataType {
  recipientAddress: string;
  senderAddress: string;
  chatId: string;
  signalData?: any;
  status: number;
}

// env which will be used for the video call
const env = ENV.STAGING;

const Home: NextPage = () => {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { data: signer } = useSigner();
  const { pushSocket, isPushSocketConnected, latestFeedItem } = usePushSocket({
    env,
  });

  const videoObjectRef = useRef<PushAPI.video.Video>();
  const recipientAddressRef = useRef<HTMLInputElement>(null);

  const [data, setData] = useState<PushAPI.VideoCallData>(
    PushAPI.video.initVideoCallData
  );

  const setRequestVideoCall = async () => {
    // fetching chatId between the local address and the remote address
    const user = await PushAPI.user.get({
      account: address!,
      env,
    });
    let pgpPrivateKey = null;
    if (user?.encryptedPrivateKey) {
      pgpPrivateKey = await PushAPI.chat.decryptPGPKey({
        encryptedPGPPrivateKey: user.encryptedPrivateKey,
        account: address,
        signer,
        env,
      });
    }
    const response = await PushAPI.chat.chats({
      account: address!,
      toDecrypt: true,
      pgpPrivateKey: pgpPrivateKey,
      env,
    });

    let chatId = '';
    response.forEach((chat) => {
      if (chat.did === 'eip155:' + recipientAddressRef?.current?.value) {
        chatId = chat.chatId!;
      }
    });

    if (!chatId) return;

    // update the video call 'data' state with the outgoing call data
    videoObjectRef.current?.setData((oldData) => {
      return produce(oldData, (draft: any) => {
        if (!recipientAddressRef || !recipientAddressRef.current) return;

        draft.local.address = address;
        draft.incoming[0].address = recipientAddressRef.current.value;
        draft.incoming[0].status = PushAPI.VideoCallStatus.INITIALIZED;
        draft.meta.chatId = chatId;
      });
    });

    // start the local media stream
    await videoObjectRef.current?.create({ video: true, audio: true });
  };

  const setIncomingVideoCall = async (
    videoCallMetaData: VideoCallMetaDataType
  ) => {
    // update the video call 'data' state with the incoming call data
    videoObjectRef.current?.setData((oldData) => {
      return produce(oldData, (draft) => {
        draft.local.address = videoCallMetaData.recipientAddress;
        draft.incoming[0].address = videoCallMetaData.senderAddress;
        draft.incoming[0].status = PushAPI.VideoCallStatus.RECEIVED;
        draft.meta.chatId = videoCallMetaData.chatId;
        draft.meta.initiator.address = videoCallMetaData.senderAddress;
        draft.meta.initiator.signal = videoCallMetaData.signalData;
      });
    });

    // start the local media stream
    await videoObjectRef.current?.create({ video: true, audio: true });
  };

  const acceptVideoCallRequest = async () => {
    if (!data.local.stream) return;

    await videoObjectRef.current?.acceptRequest({
      signalData: data.meta.initiator.signal,
      senderAddress: data.local.address,
      recipientAddress: data.incoming[0].address,
      chatId: data.meta.chatId,
    });
  };

  const connectHandler = ({
    signalData,
    senderAddress,
  }: VideoCallMetaDataType) => {
    videoObjectRef.current?.connect({
      signalData,
      peerAddress: senderAddress,
    });
  };

  // initialize video call object
  useEffect(() => {
    if (!signer || !address || !chain?.id) return;

    (async () => {
      const user = await PushAPI.user.get({
        account: address,
        env,
      });
      let pgpPrivateKey = null;
      if (user?.encryptedPrivateKey) {
        pgpPrivateKey = await PushAPI.chat.decryptPGPKey({
          encryptedPGPPrivateKey: user.encryptedPrivateKey,
          account: address,
          signer,
          env,
        });
      }

      videoObjectRef.current = new PushAPI.video.Video({
        signer,
        chainId: chain.id,
        pgpPrivateKey,
        env,
        setData,
      });
    })();
  }, [signer, address, chain]);

  // after setRequestVideoCall, if local stream is ready, we can fire the request()
  useEffect(() => {
    (async () => {
      const currentStatus = data.incoming[0].status;

      if (
        data.local.stream &&
        currentStatus === PushAPI.VideoCallStatus.INITIALIZED
      ) {
        await videoObjectRef.current?.request({
          senderAddress: data.local.address,
          recipientAddress: data.incoming[0].address,
          chatId: data.meta.chatId,
        });
      }
    })();
  }, [data.incoming, data.local.address, data.local.stream, data.meta.chatId]);

  // establish socket connection
  useEffect(() => {
    if (!pushSocket?.connected) {
      pushSocket?.connect();
    }
  }, [pushSocket]);

  // receive video call notifications
  useEffect(() => {
    if (!isPushSocketConnected || !latestFeedItem) return;

    const { payload } = latestFeedItem || {};

    // check for additionalMeta
    if (
      !Object.prototype.hasOwnProperty.call(payload, 'data') ||
      !Object.prototype.hasOwnProperty.call(payload['data'], 'additionalMeta')
    )
      return;

    const additionalMeta = payload['data']['additionalMeta'];
    console.log('RECEIVED ADDITIONAL META', additionalMeta);
    if (!additionalMeta) return;

    // check for PUSH_VIDEO
    if (additionalMeta.type !== `${ADDITIONAL_META_TYPE.PUSH_VIDEO}+1`) return;
    const videoCallMetaData = JSON.parse(additionalMeta.data);
    console.log('RECIEVED VIDEO DATA', videoCallMetaData);

    if (videoCallMetaData.status === PushAPI.VideoCallStatus.INITIALIZED) {
      setIncomingVideoCall(videoCallMetaData);
    } else if (
      videoCallMetaData.status === PushAPI.VideoCallStatus.RECEIVED ||
      videoCallMetaData.status === PushAPI.VideoCallStatus.RETRY_RECEIVED
    ) {
      connectHandler(videoCallMetaData);
    } else if (
      videoCallMetaData.status === PushAPI.VideoCallStatus.DISCONNECTED
    ) {
      window.location.reload();
    } else if (
      videoCallMetaData.status === PushAPI.VideoCallStatus.RETRY_INITIALIZED &&
      videoObjectRef.current?.isInitiator()
    ) {
      videoObjectRef.current?.request({
        senderAddress: data.local.address,
        recipientAddress: data.incoming[0].address,
        chatId: data.meta.chatId,
        retry: true,
      });
    } else if (
      videoCallMetaData.status === PushAPI.VideoCallStatus.RETRY_INITIALIZED &&
      !videoObjectRef.current?.isInitiator()
    ) {
      videoObjectRef.current?.acceptRequest({
        signalData: videoCallMetaData.signalingData,
        senderAddress: data.local.address,
        recipientAddress: data.incoming[0].address,
        chatId: data.meta.chatId,
        retry: true,
      });
    }
  }, [latestFeedItem]);

  return (
    <div>
      <Heading>Push Video SDK Demo</Heading>
      <CallInfo>Video Call Status: {data.incoming[0].status}</CallInfo>

      {isConnected ? (
        <>
          <HContainer>
            <input
              ref={recipientAddressRef}
              placeholder="recipient address"
              type="text"
            />
          </HContainer>

          <HContainer>
            <button
              disabled={
                data.incoming[0].status !==
                PushAPI.VideoCallStatus.UNINITIALIZED
              }
              onClick={setRequestVideoCall}
            >
              Request
            </button>

            <button
              disabled={
                data.incoming[0].status !== PushAPI.VideoCallStatus.RECEIVED
              }
              onClick={acceptVideoCallRequest}
            >
              Accept Request
            </button>

            <button
              disabled={
                data.incoming[0].status ===
                PushAPI.VideoCallStatus.UNINITIALIZED
              }
              onClick={() =>
                videoObjectRef.current?.disconnect({
                  peerAddress: data.incoming[0].address,
                })
              }
            >
              Disconect
            </button>

            <button
              disabled={
                data.incoming[0].status ===
                PushAPI.VideoCallStatus.UNINITIALIZED
              }
              onClick={() =>
                videoObjectRef.current?.enableVideo({
                  state: !data.local.video,
                })
              }
            >
              Toggle Video
            </button>

            <button
              disabled={
                data.incoming[0].status ===
                PushAPI.VideoCallStatus.UNINITIALIZED
              }
              onClick={() =>
                videoObjectRef.current?.enableAudio({
                  state: !data.local.audio,
                })
              }
            >
              Toggle Audio
            </button>
          </HContainer>

          <HContainer>
            <p>LOCAL VIDEO: {data.local.video ? 'TRUE' : 'FALSE'}</p>
            <p>LOCAL AUDIO: {data.local.audio ? 'TRUE' : 'FALSE'}</p>
            <p>INCOMING VIDEO: {data.incoming[0].video ? 'TRUE' : 'FALSE'}</p>
            <p>INCOMING AUDIO: {data.incoming[0].audio ? 'TRUE' : 'FALSE'}</p>
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
        </>
      ) : (
        'Please connect your wallet.'
      )}
    </div>
  );
};

const Heading = styled.h1`
  margin: 20px 40px;
`;

const CallInfo = styled.p`
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

export default Home;
