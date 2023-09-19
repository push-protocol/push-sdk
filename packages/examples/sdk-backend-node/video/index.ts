import * as PushAPI from '@pushprotocol/restapi';
import { createSocketConnection, EVENTS } from '@pushprotocol/socket';
import { ethers } from 'ethers';
import { ENV } from '../types';
import { config } from '../config';

// CONFIGS
const { env } = config;

// Random Wallet Signers
const signer = ethers.Wallet.createRandom();

// Video Data
const videoChainId = +(process.env.VIDEO_CHAIN_ID as string);
let videoData = PushAPI.video.initVideoCallData;
const videoSetData: (
  fn: (data: PushAPI.VideoCallData) => PushAPI.VideoCallData
) => void = (fn) => {
  videoData = fn(videoData);
};
let videoObject: any = null;
const videoLocalStream = null; // get the local stream
const videoSenderAddress = process.env.VIDEO_SENDER_ADDRESS;
const videoRecipientAddress = process.env.VIDEO_RECIPEINT_ADDRESS;
const videoChatId = process.env.VIDEO_CHAT_ID;
let videoSignalData_1: any = null;

const skipExample = () => {
  const requiredEnvVars = [
    'VIDEO_SENDER_ADDRESS',
    'VIDEO_RECIPEINT_ADDRESS',
    'VIDEO_CHAT_ID',
    'VIDEO_CHAIN_ID',
  ];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      return true; // Skip the example if any of the required env vars is missing
    }
  }

  return false; // All required env vars are present, don't skip the example
};

// Push Video - Run Video Use cases
export const runVideoUseCases = async (): Promise<void> => {
  console.log(`
  ██╗   ██╗██╗██████╗ ███████╗ ██████╗
  ██║   ██║██║██╔══██╗██╔════╝██╔═══██╗
  ██║   ██║██║██║  ██║█████╗  ██║   ██║
  ╚██╗ ██╔╝██║██║  ██║██╔══╝  ██║   ██║
   ╚████╔╝ ██║██████╔╝███████╗╚██████╔╝
    ╚═══╝  ╚═╝╚═════╝ ╚══════╝ ╚═════╝
    `);

  if (videoLocalStream === null) {
    console.log(' No VideoStream Detected. Skipping Push Video Examples');
    return;
  }
  if (skipExample()) {
    console.log('Skipping examples as required env vars are missing');
    return;
  }

  console.log('new PushAPI.video.Video({...})');
  videoObject = await PushAPI_video_object_init();

  console.log('await videoObject.create({...})');
  videoObject = await PushAPI_video_create();

  console.log('await videoObject.request({...})');
  videoObject = await PushAPI_video_request(); // for initiator

  console.log('await videoObject.acceptRequest({...})');
  videoObject = await PushAPI_video_accept_request(); // for receiver

  console.log('videoObject.connect()');
  // should be only called inside of the USER_FEEDS event handler as shown later in PushVideoSDKSocket
  videoObject = await PushAPI_video_connect(); // for initiator

  console.log('videoObject.disconnect()');
  videoObject = await PushAPI_video_disconnect();

  console.log('Push Video - PushSDKSocket()');
  await PushVideoSDKSocket();
};

async function PushAPI_video_object_init() {
  // Fetch user
  const user = await PushAPI.user.get({
    account: `eip155:${signer.address}`,
    env: env as ENV,
  });

  // Decrypt PGP Key
  const pgpDecrpyptedPvtKey = await PushAPI.chat.decryptPGPKey({
    encryptedPGPPrivateKey: user.encryptedPrivateKey,

    signer: signer,
  });

  // Init the Video object
  const videoObject = new PushAPI.video.Video({
    signer,
    chainId: videoChainId,
    pgpPrivateKey: pgpDecrpyptedPvtKey,
    env: env as ENV,
    setData: videoSetData,
  });

  return videoObject;
}

async function PushAPI_video_create() {
  await videoObject.create({
    stream: videoLocalStream,
  });
}

async function PushAPI_video_request() {
  videoObject.request({
    senderAddress: videoSenderAddress,
    recipientAddress: videoRecipientAddress,
    chatId: videoChatId,
  });
}

async function PushAPI_video_accept_request() {
  videoObject.acceptRequest({
    signalData: videoSignalData_1,
    senderAddress: videoRecipientAddress,
    recipientAddress: videoSenderAddress,
    chatId: videoChatId,
  });
}

async function PushAPI_video_connect() {
  videoObject.connect({
    signalData: {}, // signalData from sockets
  });
}

async function PushAPI_video_disconnect() {
  videoObject.disconnect();
}

async function PushVideoSDKSocket() {
  const pushSDKSocket = createSocketConnection({
    user: videoSenderAddress as string,
    socketType: 'chat',
    socketOptions: { autoConnect: true, reconnectionAttempts: 3 },
    env: env as ENV,
  });

  if (!pushSDKSocket) {
    throw new Error('Socket not connected');
  }

  pushSDKSocket.on(EVENTS.USER_FEEDS, (feedItem) => {
    const { payload } = feedItem || {};

    if (
      Object.prototype.hasOwnProperty.call(payload, 'data') &&
      Object.prototype.hasOwnProperty.call(payload['data'], 'additionalMeta')
    ) {
      const additionalMeta = JSON.parse(payload['data']['additionalMeta']);

      if (additionalMeta.status === PushAPI.VideoCallStatus.INITIALIZED) {
        videoSignalData_1 = additionalMeta.signalData;
      } else if (
        additionalMeta.status === PushAPI.VideoCallStatus.RECEIVED ||
        additionalMeta.status === PushAPI.VideoCallStatus.RETRY_RECEIVED
      ) {
        videoObject.connect({
          signalData: additionalMeta.signalData,
        });
      } else if (
        additionalMeta.status === PushAPI.VideoCallStatus.DISCONNECTED
      ) {
        // can clear out the states here
      } else if (
        additionalMeta.status === PushAPI.VideoCallStatus.RETRY_INITIALIZED &&
        videoObject.isInitiator()
      ) {
        videoObject.request({
          senderAddress: videoSenderAddress,
          recipientAddress: videoRecipientAddress,
          chatId: videoChatId,
          retry: true,
        });
      } else if (
        additionalMeta.status === PushAPI.VideoCallStatus.RETRY_INITIALIZED &&
        !videoObject.isInitiator()
      ) {
        videoObject.acceptRequest({
          signalData: additionalMeta.signalData,
          senderAddress: videoRecipientAddress,
          recipientAddress: videoSenderAddress,
          chatId: videoChatId,
          retry: true,
        });
      }
    }
  });

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  await delay(4000);
}
