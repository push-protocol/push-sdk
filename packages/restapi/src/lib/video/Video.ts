import * as React from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as Peer from 'simple-peer';

import Constants, { ENV } from '../constants';
import sendVideoCallNotification from './helpers/sendVideoCallNotification';
import {
  restartAudioStream,
  restartVideoStream,
  stopAudioStream,
  stopVideoStream,
} from './helpers/mediaToggle';
import isJSON from './helpers/isJSON';

import {
  IMediaStream,
  SignerType,
  VideoAcceptRequestInputOptions,
  VideoAcceptRequestReturnOptions,
  VideoCallInfoType,
  VideoEstablishInputOptions,
  VideoRequestInputOptions,
  VideoRequestReturnOptions,
} from '../types';

export class Video {
  // user related info
  private signer: SignerType | undefined = undefined;
  private chainId: number | undefined = undefined;
  private env: ENV = Constants.ENV.PROD;

  // storing the peer instance
  private peerInstance: Peer.Instance | undefined = undefined;

  // variables for video call state handling
  localStream: IMediaStream;
  setLocalStream: React.Dispatch<React.SetStateAction<IMediaStream>>;
  incomingStream: IMediaStream;
  setIncomingStream: React.Dispatch<
    React.SetStateAction<IMediaStream>
  >;
  videoCallInfo: VideoCallInfoType;
  setVideoCallInfo: React.Dispatch<React.SetStateAction<VideoCallInfoType>>;
  isVideoOn: boolean;
  setIsVideoOn: React.Dispatch<React.SetStateAction<boolean>>;
  isAudioOn: boolean;
  setIsAudioOn: React.Dispatch<React.SetStateAction<boolean>>;
  isIncomingVideoOn: boolean;
  setIsIncomingVideoOn: React.Dispatch<React.SetStateAction<boolean>>;
  isIncomingAudioOn: boolean;
  setIsIncomingAudioOn: React.Dispatch<React.SetStateAction<boolean>>;

  constructor({
    localStream,
    setLocalStream,
    incomingStream,
    setIncomingStream,
    videoCallInfo,
    setVideoCallInfo,
    isVideoOn,
    setIsVideoOn,
    isAudioOn,
    setIsAudioOn,
    isIncomingVideoOn,
    setIsIncomingVideoOn,
    isIncomingAudioOn,
    setIsIncomingAudioOn,
  }: {
    localStream: IMediaStream;
    setLocalStream: React.Dispatch<
      React.SetStateAction<IMediaStream>
    >;
    incomingStream: IMediaStream;
    setIncomingStream: React.Dispatch<
      React.SetStateAction<IMediaStream>
    >;
    videoCallInfo: VideoCallInfoType;
    setVideoCallInfo: React.Dispatch<React.SetStateAction<VideoCallInfoType>>;
    isVideoOn: boolean;
    setIsVideoOn: React.Dispatch<React.SetStateAction<boolean>>;
    isAudioOn: boolean;
    setIsAudioOn: React.Dispatch<React.SetStateAction<boolean>>;
    isIncomingVideoOn: boolean;
    setIsIncomingVideoOn: React.Dispatch<React.SetStateAction<boolean>>;
    isIncomingAudioOn: boolean;
    setIsIncomingAudioOn: React.Dispatch<React.SetStateAction<boolean>>;
  }) {
    this.localStream = localStream;
    this.setLocalStream = setLocalStream;
    this.incomingStream = incomingStream;
    this.setIncomingStream = setIncomingStream;
    this.videoCallInfo = videoCallInfo;
    this.setVideoCallInfo = setVideoCallInfo;
    this.isVideoOn = isVideoOn;
    this.setIsVideoOn = setIsVideoOn;
    this.isAudioOn = isAudioOn;
    this.setIsAudioOn = setIsAudioOn;
    this.isIncomingVideoOn = isIncomingVideoOn;
    this.setIsIncomingVideoOn = setIsIncomingVideoOn;
    this.isIncomingAudioOn = isIncomingAudioOn;
    this.setIsIncomingAudioOn = setIsIncomingAudioOn;
  }

  create = async () => {
    try {
      const localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      this.setLocalStream(localStream);
      this.setIsAudioOn(true);
      this.setIsVideoOn(true);
    } catch (err) {
      console.log('Error in creating local stream', err);
    }
  };

  request = async (
    options: VideoRequestInputOptions
  ): Promise<VideoRequestReturnOptions> => {
    const {
      library,
      chainId,
      senderAddress, // notification sender
      recipientAddress, // notification receiver
      chatId,
      onRecieveMessage,
      env = Constants.ENV.PROD,
      pgpPrivateKey=null,
    } = options || {};

    const signer: SignerType = await library.getSigner(senderAddress);
    
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: this.localStream,
    });

    peer.on('signal', (data: any) => {
      // sending notification to the recipientAddress with video call signaling data
      sendVideoCallNotification(
        { signer, chainId, pgpPrivateKey },
        {
          senderAddress,
          recipientAddress,
          status: 1,
          chatId,
          signalingData: data,
          env,
          
        }
      );
    });

    // set videoCallInfo state with status 1 (call initiated)
    this.setVideoCallInfo({
      senderAddress: senderAddress,
      receiverAddress: recipientAddress,
      callStatus: 1,
      chatId,
    });

    peer.on('connect', () => {
      peer.send('initial message from caller');
      peer.send(
        JSON.stringify({ type: 'isVideoOn', isVideoOn: this.isVideoOn })
      );
      peer.send(
        JSON.stringify({ type: 'isAudioOn', isAudioOn: this.isAudioOn })
      );
    });

    peer.on('data', (data: any) => {
      if (isJSON(data)) {
        const parsedData = JSON.parse(data);
        if (parsedData.type === 'isVideoOn') {
          console.log('IS VIDEO ON', parsedData.isVideoOn);
          this.setIsIncomingVideoOn(parsedData.isVideoOn);
        }
        if (parsedData.type === 'isAudioOn') {
          console.log('IS AUDIO ON', parsedData.isAudioOn);
          this.setIsIncomingAudioOn(parsedData.isAudioOn);
        }
        if (parsedData.type === 'endLocalStream') {
          console.log('END LOCAL STREAM', parsedData.endLocalStream);
          window.location.reload();
        }
      } else {
        console.log('received a message', data);
        onRecieveMessage(data);
      }
    });

    peer.on('stream', (currentStream: MediaStream) => {
      this.setIncomingStream(currentStream);
    });

    const sendMessage = (message: string): void => {
      peer.send(message);
    };

    this.peerInstance = peer;
    this.signer = signer;
    this.chainId = chainId;
    this.env = env;
    return {
      sendMessage,
    };
  };

  acceptRequest = async (
    options: VideoAcceptRequestInputOptions
  ): Promise<VideoAcceptRequestReturnOptions> => {
    const {
      signalData,
      library,
      chainId,
      senderAddress, // notification sender
      recipientAddress, // notification receiver
      chatId,
      onRecieveMessage,
      env = Constants.ENV.PROD,
      pgpPrivateKey=null,
    } = options || {};

    const signer: SignerType = await library.getSigner(senderAddress);

    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: this.localStream,
    });

    peer.signal(signalData);

    peer.on('signal', (data: any) => {
      sendVideoCallNotification(
        { signer, chainId, pgpPrivateKey },
        {
          senderAddress,
          recipientAddress,
          status: 2,
          chatId,
          signalingData: data,
          env,
        }
      );
    });

    // set videoCallInfo state with status 2 (call received)
    this.setVideoCallInfo({
      senderAddress: senderAddress,
      receiverAddress: recipientAddress,
      callStatus: 2,
      chatId,
    });

    peer.on('connect', () => {
      peer.send('initial message from receiver');
      peer.send(
        JSON.stringify({ type: 'isVideoOn', isVideoOn: this.isVideoOn })
      );
      peer.send(
        JSON.stringify({ type: 'isAudioOn', isAudioOn: this.isAudioOn })
      );

      // set videoCallInfo state with status 3 (call established) for the receiver's end
      this.setVideoCallInfo((oldVideoCallInfo) => ({
        ...oldVideoCallInfo,
        callStatus: 3,
      }));
    });

    peer.on('data', (data: any) => {
      if (isJSON(data)) {
        const parsedData = JSON.parse(data);
        if (parsedData.type === 'isVideoOn') {
          console.log('IS VIDEO ON', parsedData.isVideoOn);
          this.setIsIncomingVideoOn(parsedData.isVideoOn);
        }
        if (parsedData.type === 'isAudioOn') {
          console.log('IS AUDIO ON', parsedData.isAudioOn);
          this.setIsIncomingAudioOn(parsedData.isAudioOn);
        }
        if (parsedData.type === 'endLocalStream') {
          console.log('END LOCAL STREAM', parsedData.endLocalStream);
          window.location.reload();
        }
      } else {
        console.log('received a message', data);
        onRecieveMessage(data);
      }
    });

    peer.on('stream', (currentStream: MediaStream) => {
      this.setIncomingStream(currentStream);
    });

    const sendMessage = (message: string): void => {
      peer.send(message);
    };

    this.peerInstance = peer;
    this.signer = signer;
    this.chainId = chainId;
    this.env = env;
    return {
      sendMessage,
    };
  };

  establish = (options: VideoEstablishInputOptions): void => {
    const { signalData } = options || {};
    if (this.peerInstance) {
      this.peerInstance.signal(signalData);

      // set videoCallInfo state with status 3 (call established) for the caller's end
      this.setVideoCallInfo((oldVideoCallInfo) => ({
        ...oldVideoCallInfo,
        callStatus: 3,
      }));
    } else {
      throw new Error('Peer instance is undefined');
    }
  };

  end = (): void => {
    try {
      if (this.videoCallInfo.callStatus === 3) {
        this.peerInstance?.send(
          JSON.stringify({ type: 'endLocalStream', endLocalStream: true })
        );
        this.peerInstance?.destroy();

        // ending the local stream
        if (this.localStream) {
          console.log('END LOCAL STREAM');
          this.localStream.getTracks().forEach((track) => track.stop());
        }
      }
      if (this.videoCallInfo.callStatus === 2 || this.videoCallInfo.callStatus === 1) {
        if (!this.signer) throw new Error('signer not valid');
        if (!this.chainId) throw new Error('chainId not valid');
        if (!this.env) throw new Error('env is not valid');

        // for disconnecting during status 1
        // send a notif to the other computer signaling status:4
        // sendVideoCallNotification(
        //   { signer: this.signer, chainId: this.chainId },
        //   {
        //     senderAddress: this.videoCallInfo.senderAddress,
        //     recipientAddress: this.videoCallInfo.receiverAddress,
        //     status: 4,
        //     chatId: this.videoCallInfo.chatId,
        //     signalingData: null,
        //     env: this.env,
        //   }
        // );
        window.location.reload();
      }
    } catch (error) {
      console.log('error occured', error);
    }
  };

  // functions for toggling local audio and video

  toggleVideo = (): void => {
    if (this.videoCallInfo.callStatus === 3) {
      this.peerInstance?.send(
        JSON.stringify({ type: 'isVideoOn', isVideoOn: !this.isVideoOn })
      );
    }

    if (this.isVideoOn === false && this.localStream) {
      console.log('INITIALIZE LOCAL STREAM');
      restartVideoStream(this.localStream);
      this.setIsVideoOn(true);
    }
    if (this.isVideoOn === true && this.localStream) {
      console.log('STOP LOCAL STREAM');
      stopVideoStream(this.localStream);
      this.setIsVideoOn(false);
    }
  };

  toggleAudio = (): void => {
    if (this.videoCallInfo.callStatus === 3) {
      this.peerInstance?.send(
        JSON.stringify({ type: 'isAudioOn', isAudioOn: !this.isAudioOn })
      );
    }

    if (this.isAudioOn === false && this.localStream) {
      console.log('INITIALIZE LOCAL STREAM');
      restartAudioStream(this.localStream);
      this.setIsAudioOn(true);
    }
    if (this.isAudioOn === true && this.localStream) {
      console.log('STOP LOCAL STREAM');
      stopAudioStream(this.localStream);
      this.setIsAudioOn(false);
    }
  };
}
