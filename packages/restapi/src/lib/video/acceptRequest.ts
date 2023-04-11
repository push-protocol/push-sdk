import * as Peer from 'simple-peer';
import Constants, { ENV } from '../constants';
import sendVideoCallNotification from './helpers/sendVideoCallNotification';
import { SignerType } from '../types';

export type AcceptRequestOptionsType = {
  signalData: any;
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

export type AcceptRequestReturnType = {
  sendMessage: (message: string) => void;
  incomingStream: MediaStream | undefined;
};

export const acceptRequest = async (
  options: AcceptRequestOptionsType
): Promise<AcceptRequestReturnType> => {
  const {
    signalData,
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
    initiator: false,
    trickle: false,
    stream: localStream,
  });

  peer.signal(signalData);

  peer.on('signal', (data: any) => {
    sendVideoCallNotification(
      { account, signer, chainId },
      {
        recipientAddress,
        senderAddress,
        signalingData: data,
        status: 2,
        chatId,
        env,
      }
    );
  });

  peer.on('connect', () => {
    peer.send('dummy message from reciever');
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
