import * as React from "react";

import * as Peer from 'simple-peer';

import Constants, { ENV } from '../constants';
import sendVideoCallNotification from './helpers/sendVideoCallNotification';
import { SignerType } from '../types';

type RequestOptionsType = {
  account: string;
  library: any;
  chainId: number;
  senderAddress: string;
  recipientAddress: string;
  chatId: string;
  connectedUser: any;
  onRecieveMessage: (message: string) => void;
  env?: ENV;
};

type RequestReturnType = {
  sendMessage: (message: string) => void;
};

type AcceptRequestOptionsType = {
  signalData: any;
  account: string;
  library: any;
  chainId: number;
  senderAddress: string;
  recipientAddress: string;
  chatId: string;
  connectedUser: any;
  onRecieveMessage: (message: string) => void;
  env?: ENV;
};

type AcceptRequestReturnType = {
  sendMessage: (message: string) => void;
};

export type EstablishOptionsType = {
  signalData: any;
};

class Video {
  // storing the peer instance
  peerInstance: Peer.Instance | undefined = undefined;

  // variables for video call state handling
  localStream: MediaStream;
  setLocalStream: React.Dispatch<React.SetStateAction<MediaStream>>;
  incomingStream: MediaStream;
  setIncomingStream: React.Dispatch<React.SetStateAction<MediaStream>>;

  constructor({
    localStream,
    setLocalStream,
    incomingStream,
    setIncomingStream,
  }: {
    localStream: MediaStream;
    setLocalStream: React.Dispatch<React.SetStateAction<MediaStream>>;
    incomingStream: MediaStream;
    setIncomingStream: React.Dispatch<React.SetStateAction<MediaStream>>;
  }) {
    this.localStream = localStream;
    this.setLocalStream = setLocalStream;
    this.incomingStream = incomingStream;
    this.setIncomingStream = setIncomingStream;
  }

  create = async () => {
    try {
      const localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      this.setLocalStream(localStream);
    } catch (err) {
      console.log('Error in creating local stream', err);
    }
  };

  request = async (options: RequestOptionsType): Promise<RequestReturnType> => {
    const {
      library,
      account,
      chainId,
      senderAddress,
      recipientAddress,
      chatId,
      onRecieveMessage,
      env = Constants.ENV.PROD,
    } = options || {};

    const signer: SignerType = await library.getSigner(account);

    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: this.localStream,
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
      this.setIncomingStream(currentStream);
    });

    const sendMessage = (message: string): void => {
      peer.send(message);
    };

    this.peerInstance = peer;
    return {
      sendMessage,
    };
  };

  acceptRequest = async (
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
      onRecieveMessage,
      env = Constants.ENV.PROD,
    } = options || {};

    const signer: SignerType = await library.getSigner(account);

    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: this.localStream,
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
      this.setIncomingStream(currentStream);
    });

    const sendMessage = (message: string): void => {
      peer.send(message);
    };

    this.peerInstance = peer;
    return {
      sendMessage,
    };
  };

  establish = (options: EstablishOptionsType): void => {
    const { signalData } = options || {};
    if (this.peerInstance) {
      this.peerInstance.signal(signalData);
    } else {
      throw new Error('Peer instance is undefined');
    }
  };

  end = (): void => {
    if (this.peerInstance) {
      this.peerInstance.destroy();
    } else {
      throw new Error('Peer instance is undefined');
    }
  };
}

export default Video;
