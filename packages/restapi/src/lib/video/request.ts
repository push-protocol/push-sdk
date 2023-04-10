import Peer from 'simple-peer';
import Constants, { ENV } from '../constants';
import sendVideoCallNotification from './helpers/sendVideoCallNotification';

export type RequestOptionsType = {
  senderAddress: string;
  recipientAddress: string;
  chatId: string;
  connectedUser: any;
  peerInstanceRef: any;
  localStream: MediaStream | undefined;
  onRecieveMessage: (message: string) => void;
  env?: ENV;
};

export type RequestReturnType = {
  sendMessage: (message: string) => void;
  incomingStream: MediaStream | undefined;
};

export const request = (options: RequestOptionsType): RequestReturnType => {
  const {
    senderAddress,
    recipientAddress,
    chatId,
    connectedUser,
    peerInstanceRef,
    localStream,
    onRecieveMessage,
    env = Constants.ENV.PROD,
  } = options || {};

  const peer = new Peer({
    initiator: true,
    trickle: false,
    stream: localStream,
  });

  peer.on('signal', (data: any) => {
    sendVideoCallNotification(
      { account, library, chainId, connectedUser, createUserIfNecessary },
      {
        recipientAddress,
        senderAddress,
        signalingData: data,
        status: 1,
        chatId,
        env,
      }
    );
  });

  peer.on('connect', () => {
    // wait for 'connect' event before using the data channel
    peer.send('dummy message from sender');
  });

  peer.on('data', (data:any) => {
    // got a data channel message
    console.log('received message', data);
  });

  peer.on('stream', (currentStream: MediaStream) => {
    console.log('GOT STREAM BACK IN CALLUSER');

    userVideo.current.srcObject = currentStream;
    userVideo.current.play();
  });

  peerInstanceRef.current = peer;

  return {};
};
