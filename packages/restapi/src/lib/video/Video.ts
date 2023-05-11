// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as Peer from 'simple-peer';
import { produce } from 'immer';

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
  SignerType,
  VideoCallData,
  VideoCreateInputOptions,
  VideoRequestInputOptions,
  VideoAcceptRequestInputOptions,
  VideoConnectInputOptions,
  VideoCallStatus,
} from '../types';

export const initVideoCallData: VideoCallData = {
  meta: {
    chatId: '',
    initiator: {
      address: '',
      signal: null,
    },
  },
  local: {
    stream: null,
    audio: null,
    video: null,
    address: '',
  },
  incoming: {
    stream: null,
    audio: null,
    video: null,
    address: '',
    status: VideoCallStatus.UNINITIALIZED,
  },
};

export class Video {
  // user, call related info
  private signer: SignerType | null = null;
  private chainId: number | null = null;
  private pgpPrivateKey: string | null = null;
  private env: ENV = Constants.ENV.PROD;

  // storing the peer instance
  private peerInstance: any = null;

  data: VideoCallData;
  setData: (fn: (data: VideoCallData) => VideoCallData) => void;

  constructor({
    data,
    setData,
  }: {
    data: VideoCallData;
    setData: (fn: (data: VideoCallData) => VideoCallData) => void;
  }) {
    this.data = data;
    this.setData = setData;
  }

  async create(options: VideoCreateInputOptions): Promise<void> {
    const { audio, video } = options || {};
    
    try {
      const localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (video === false) {
        stopVideoStream(localStream);
      }
      if (audio === false) {
        stopAudioStream(localStream);
      }

      this.setData((oldData) => {
        return produce(oldData, (draft) => {
          draft.local.stream = localStream;
          draft.local.video = video;
          draft.local.audio = audio;
        });
      });
    } catch (err) {
      console.log('error in create', err);
    }
  }

  async request(options: VideoRequestInputOptions): Promise<void> {
    const {
      library,
      chainId,
      senderAddress, // notification sender
      recipientAddress, // notification receiver
      chatId,
      onRecieveMessage,
      env = Constants.ENV.PROD,
      pgpPrivateKey = null,
    } = options || {};

    try {
      const signer: SignerType = await library.getSigner(senderAddress);

      console.log(
        'request',
        'options',
        options,
        'localStream',
        this.data.local.stream
      );

      this.peerInstance = new Peer({
        initiator: true,
        trickle: false,
        stream: this.data.local.stream,
      });

      this.peerInstance.on('signal', (data: any) => {
        this.setData((oldData) => {
          return produce(oldData, (draft) => {
            draft.meta.initiator.signal = data;
          });
        });

        // sending notification to the recipientAddress with video call signaling data
        sendVideoCallNotification(
          { signer, chainId, pgpPrivateKey },
          {
            senderAddress,
            recipientAddress,
            status: VideoCallStatus.INITIALIZED,
            chatId,
            signalingData: data,
            env,
          }
        );
      });

      this.peerInstance.on('connect', () => {
        this.peerInstance.send(`initial message from ${senderAddress}`);
        this.peerInstance.send(
          JSON.stringify({
            type: 'isVideoOn',
            isVideoOn: this.data.local.video,
          })
        );
        this.peerInstance.send(
          JSON.stringify({
            type: 'isAudioOn',
            isAudioOn: this.data.local.audio,
          })
        );
      });

      this.peerInstance.on('data', (data: any) => {
        if (isJSON(data)) {
          const parsedData = JSON.parse(data);
          if (parsedData.type === 'isVideoOn') {
            console.log('IS VIDEO ON', parsedData.isVideoOn);
            this.setData((oldData) => {
              return produce(oldData, (draft) => {
                draft.incoming.video = parsedData.isVideoOn;
              });
            });
          }

          if (parsedData.type === 'isAudioOn') {
            console.log('IS AUDIO ON', parsedData.isAudioOn);
            this.setData((oldData) => {
              return produce(oldData, (draft) => {
                draft.incoming.audio = parsedData.isAudioOn;
              });
            });
          }

          if (parsedData.type === 'endLocalStream') {
            console.log('END LOCAL STREAM', parsedData.endLocalStream);
            this.setData(() => initVideoCallData);
          }
        } else {
          console.log('received a message', data);
          onRecieveMessage(data);
        }
      });

      this.peerInstance.on('stream', (currentStream: MediaStream) => {
        console.log('received incoming stream', currentStream);
        this.setData((oldData) => {
          return produce(oldData, (draft) => {
            draft.incoming.stream = currentStream;
          });
        });
      });

      this.signer = signer;
      this.chainId = chainId;
      this.pgpPrivateKey = pgpPrivateKey;
      this.env = env;

      // set videoCallInfo state with status 1 (call initiated)
      this.setData((oldData) => {
        return produce(oldData, (draft) => {
          draft.local.address = senderAddress;
          draft.incoming.address = recipientAddress;
          draft.meta.chatId = chatId;
          draft.meta.initiator.address = senderAddress;
          draft.incoming.status = VideoCallStatus.INITIALIZED;
        });
      });
    } catch (err) {
      console.log('error in request', err);
    }
  }

  async acceptRequest(options: VideoAcceptRequestInputOptions): Promise<void> {
    const {
      signalData,
      library,
      chainId,
      senderAddress, // notification sender
      recipientAddress, // notification receiver
      chatId,
      onRecieveMessage,
      env = Constants.ENV.PROD,
      pgpPrivateKey = null,
    } = options || {};

    try {
      const signer: SignerType = await library.getSigner(senderAddress);

      console.log(
        'accept request',
        'options',
        options,
        'localStream',
        this.data.local.stream
      );

      this.peerInstance = new Peer({
        initiator: false,
        trickle: false,
        stream: this.data.local.stream,
      });

      this.peerInstance.signal(signalData);

      this.peerInstance.on('signal', (data: any) => {
        this.setData((oldData) => {
          return produce(oldData, (draft) => {
            draft.meta.initiator.signal = data;
          });
        });

        sendVideoCallNotification(
          { signer, chainId, pgpPrivateKey },
          {
            senderAddress,
            recipientAddress,
            status: VideoCallStatus.RECEIVED,
            chatId,
            signalingData: data,
            env,
          }
        );
      });

      this.peerInstance.on('connect', () => {
        this.peerInstance.send('initial message from receiver');
        this.peerInstance.send(
          JSON.stringify({
            type: 'isVideoOn',
            isVideoOn: this.data.local.video,
          })
        );
        this.peerInstance.send(
          JSON.stringify({
            type: 'isAudioOn',
            isAudioOn: this.data.local.audio,
          })
        );

        // set videoCallInfo state with status connected for the receiver's end
        this.setData((oldData) => {
          return produce(oldData, (draft) => {
            draft.incoming.status = VideoCallStatus.CONNECTED;
          });
        });
      });

      this.peerInstance.on('data', (data: any) => {
        if (isJSON(data)) {
          const parsedData = JSON.parse(data);
          if (parsedData.type === 'isVideoOn') {
            console.log('IS VIDEO ON', parsedData.isVideoOn);
            this.setData((oldData) => {
              return produce(oldData, (draft) => {
                draft.incoming.video = parsedData.isVideoOn;
              });
            });
          }

          if (parsedData.type === 'isAudioOn') {
            console.log('IS AUDIO ON', parsedData.isAudioOn);
            this.setData((oldData) => {
              return produce(oldData, (draft) => {
                draft.incoming.audio = parsedData.isAudioOn;
              });
            });
          }

          if (parsedData.type === 'endLocalStream') {
            console.log('END LOCAL STREAM', parsedData.endLocalStream);
            this.setData(() => initVideoCallData);
          }
        } else {
          console.log('received a message', data);
          onRecieveMessage(data);
        }
      });

      this.peerInstance.on('stream', (currentStream: MediaStream) => {
        console.log('received incoming stream', currentStream);
        this.setData((oldData) => {
          return produce(oldData, (draft) => {
            draft.incoming.stream = currentStream;
          });
        });
      });

      this.signer = signer;
      this.chainId = chainId;
      this.pgpPrivateKey = pgpPrivateKey;
      this.env = env;

      // set videoCallInfo state with status 2 (call received)
      this.setData((oldData) => {
        return produce(oldData, (draft) => {
          draft.local.address = senderAddress;
          draft.incoming.address = recipientAddress;
          draft.meta.chatId = chatId;
          draft.meta.initiator.address = senderAddress;
          draft.incoming.status = VideoCallStatus.RECEIVED;
        });
      });
    } catch (err) {
      console.log('error in accept request', err);
    }
  }

  connect(options: VideoConnectInputOptions): void {
    const { signalData } = options || {};

    try {
      console.log('connect', 'options', options);

      this.peerInstance?.signal(signalData);

      // set videoCallInfo state with status connected for the caller's end
      this.setData((oldData) => {
        return produce(oldData, (draft) => {
          draft.incoming.status = VideoCallStatus.CONNECTED;
        });
      });
    } catch (err) {
      console.log('error in connect', err);
    }
  }

  disconnect(): void {
    try {
      console.log('disconnect');
      if (this.data.incoming.status === VideoCallStatus.CONNECTED) {
        this.peerInstance?.send(
          JSON.stringify({ type: 'endLocalStream', endLocalStream: true })
        );
        this.peerInstance?.destroy();

        // ending the local stream
        this.data.local.stream?.getTracks().forEach((track) => track.stop());
      }
      if (
        this.data.incoming.status === VideoCallStatus.INITIALIZED ||
        this.data.incoming.status === VideoCallStatus.RECEIVED
      ) {
        // for disconnecting during status 1, 2
        // send a notif to the other user signaling status=4
        sendVideoCallNotification(
          {
            signer: this.signer!,
            chainId: this.chainId!,
            pgpPrivateKey: this.pgpPrivateKey,
          },
          {
            senderAddress: this.data.local.address,
            recipientAddress: this.data.incoming.address,
            status: VideoCallStatus.DISCONNECTED,
            chatId: this.data.meta.chatId,
            signalingData: null,
            env: this.env,
          }
        );
      }

      this.setData(() => initVideoCallData);
    } catch (err) {
      console.log('error in disconnect', err);
    }
  }

  // functions for toggling local audio and video

  toggleVideo(): void {
    console.log('toggleVideo', 'current video', this.data.local.video);
    if (this.data.incoming.status === VideoCallStatus.CONNECTED) {
      this.peerInstance?.send(
        JSON.stringify({ type: 'isVideoOn', isVideoOn: !this.data.local.video })
      );
    }
    if (this.data.local.stream) {
      if (this.data.local.video === false) {
        restartVideoStream(this.data.local.stream);
      }
      if (this.data.local.video === true) {
        stopVideoStream(this.data.local.stream);
      }
      this.setData((oldData) => {
        return produce(oldData, (draft) => {
          draft.local.video = !oldData.local.video;
        });
      });
    }
  }

  toggleAudio(): void {
    console.log('toggleAudio', 'current audio', this.data.local.audio);
    if (this.data.incoming.status === VideoCallStatus.CONNECTED) {
      this.peerInstance?.send(
        JSON.stringify({ type: 'isAudioOn', isAudioOn: !this.data.local.audio })
      );
    }
    if (this.data.local.stream) {
      if (this.data.local.audio === false) {
        restartAudioStream(this.data.local.stream);
      }
      if (this.data.local.audio === true) {
        stopAudioStream(this.data.local.stream);
      }
      this.setData((oldData) => {
        return produce(oldData, (draft) => {
          draft.local.audio = !oldData.local.audio;
        });
      });
    }
  }
}
