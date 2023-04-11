import * as Peer from 'simple-peer';
import Constants, { ENV } from '../constants';
import sendVideoCallNotification from './helpers/sendVideoCallNotification';
import { SignerType } from '../types';

export type RequestOptionsType = {
  account: string;
  library: any;
  chainId: number;
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

export const request = async (
  options: RequestOptionsType
): Promise<RequestReturnType> => {
  const {
    library,
    account,
    chainId,
    senderAddress,
    recipientAddress,
    chatId,
    peerInstanceRef,
    localStream,
    onRecieveMessage,
    env = Constants.ENV.PROD,
  } = options || {};

  let incomingStream: MediaStream | undefined = undefined;

  const signer: SignerType = await library.getSigner(account);

  const peer = new Peer({
    initiator: true,
    trickle: false,
    stream: localStream,
  });

  peer.on('signal', (data: any) => {
    sendVideoCallNotification(
      { account, signer, chainId },
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
    peer.send('dummy message from sender');
  });

  peer.on('data', (data: any) => {
    console.log('received message', data);
    onRecieveMessage(data);
  });

  peer.on('stream', (currentStream: MediaStream) => {
    incomingStream = currentStream;
  });

  const sendMessage = (message: string): void => {
    peer.send(message);
  };

  peerInstanceRef.current = peer;
  return {
    incomingStream,
    sendMessage,
  };
};
