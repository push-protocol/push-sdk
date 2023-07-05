// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as Peer from 'simple-peer';
import { produce } from 'immer';

import Constants, { ENV } from '../constants';
import sendVideoCallNotification from './helpers/sendVideoCallNotification';
import {
  endStream,
  restartAudioStream,
  restartVideoStream,
  stopAudioStream,
  stopVideoStream,
} from './helpers/mediaToggle';
import isJSON from './helpers/isJSON';
import { getIceServerConfig } from './helpers/getIceServerConfig';

import {
  SignerType,
  VideoCallData,
  VideoCreateInputOptions,
  VideoRequestInputOptions,
  VideoAcceptRequestInputOptions,
  VideoConnectInputOptions,
  VideoCallStatus,
  EnableAudioInputOptions,
  EnableVideoInputOptions,
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
  incoming: [
    {
      stream: null,
      audio: null,
      video: null,
      address: '',
      status: VideoCallStatus.UNINITIALIZED,
      retryCount: 0,
    },
  ],
};

export class Video {
  // user, call related info
  private signer: SignerType;
  private chainId: number;
  private pgpPrivateKey: string;
  private env: ENV;

  // storing the peer instance
  private peerInstance: any = null;

  private data: VideoCallData;
  setData: (fn: (data: VideoCallData) => VideoCallData) => void;

  constructor({
    signer,
    chainId,
    pgpPrivateKey,
    env,
    setData,
  }: {
    signer: SignerType;
    chainId: number;
    pgpPrivateKey: string;
    env?: ENV;
    setData: (fn: (data: VideoCallData) => VideoCallData) => void;
  }) {
    this.signer = signer;
    this.chainId = chainId;
    this.pgpPrivateKey = pgpPrivateKey;
    this.env = env ? env : Constants.ENV.PROD;

    // init the react state
    setData(() => initVideoCallData);

    // init the class variable
    this.data = initVideoCallData;

    // set the state updating function
    this.setData = function (fn) {
      // update the react state
      setData(fn);

      // update the class variable
      this.data = fn(this.data);
    };
  }

  async create(options: VideoCreateInputOptions): Promise<void> {
    const { audio = true, video = true, stream = null } = options || {};

    try {
      const localStream =
        stream !== null
          ? stream // for backend
          : await navigator.mediaDevices.getUserMedia({
              // for frontend
              video,
              audio,
            });

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
      senderAddress, // notification sender
      recipientAddress, // notification receiver
      chatId,
      onReceiveMessage = (message: string) => {
        console.log('received a meesage', message);
      },
      retry = false,
    } = options || {};

    try {
      console.log(
        'request',
        'options',
        options,
        'localStream',
        this.data.local.stream
      );

      // fetching the iceServers config
      const iceServerConfig = await getIceServerConfig(this.env);

      this.peerInstance = new Peer({
        initiator: true,
        trickle: false,
        stream: this.data.local.stream,
        config: {
          iceServers: iceServerConfig,
        },
      });

      this.peerInstance.on('signal', (data: any) => {
        this.setData((oldData) => {
          return produce(oldData, (draft) => {
            draft.meta.initiator.signal = data;
          });
        });

        // sending notification to the recipientAddress with video call signaling data
        sendVideoCallNotification(
          {
            signer: this.signer,
            chainId: this.chainId,
            pgpPrivateKey: this.pgpPrivateKey,
          },
          {
            senderAddress,
            recipientAddress,
            status: retry
              ? VideoCallStatus.RETRY_INITIALIZED
              : VideoCallStatus.INITIALIZED,
            chatId,
            signalData: data,
            env: this.env,
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
            this.setData((oldData) => {
              return produce(oldData, (draft) => {
                draft.incoming[0].video = parsedData.isVideoOn;
              });
            });
          }

          if (parsedData.type === 'isAudioOn') {
            this.setData((oldData) => {
              return produce(oldData, (draft) => {
                draft.incoming[0].audio = parsedData.isAudioOn;
              });
            });
          }

          if (parsedData.type === 'endCall') {
            // destroy the peerInstance
            this.peerInstance?.destroy();
            this.peerInstance = null;

            // destroy the local stream
            if (this.data.local.stream) {
              endStream(this.data.local.stream);
            }

            // reset the state
            this.setData(() => initVideoCallData);
          }
        } else {
          onReceiveMessage(data);
        }
      });

      this.peerInstance.on('stream', (currentStream: MediaStream) => {
        this.setData((oldData) => {
          return produce(oldData, (draft) => {
            draft.incoming[0].stream = currentStream;
          });
        });
      });

      // set videoCallInfo state with status 1 (call initiated)
      this.setData((oldData) => {
        return produce(oldData, (draft) => {
          draft.local.address = senderAddress;
          draft.incoming[0].address = recipientAddress;
          draft.meta.chatId = chatId;
          draft.meta.initiator.address = senderAddress;
          draft.incoming[0].status = retry
            ? VideoCallStatus.RETRY_INITIALIZED
            : VideoCallStatus.INITIALIZED;
          draft.incoming[0].retryCount += retry ? 1 : 0;
        });
      });
    } catch (err) {
      console.log('error in request', err);
    }
  }

  async acceptRequest(options: VideoAcceptRequestInputOptions): Promise<void> {
    const {
      signalData,
      senderAddress, // notification sender
      recipientAddress, // notification receiver
      chatId,
      onReceiveMessage = (message: string) => {
        console.log('received a meesage', message);
      },
      retry = false,
    } = options || {};

    try {
      console.log(
        'accept request',
        'options',
        options,
        'peerInstance',
        this.peerInstance
      );

      // if peerInstance is not null -> acceptRequest/request was called before
      if (this.peerInstance !== null) {
        // to prevent connection error we stop the exec of acceptRequest
        return Promise.resolve();
      }

      // set videoCallInfo state with status 2 (call received)
      this.setData((oldData) => {
        return produce(oldData, (draft) => {
          draft.local.address = senderAddress;
          draft.incoming[0].address = recipientAddress;
          draft.meta.chatId = chatId;
          draft.meta.initiator.address = senderAddress;
          draft.incoming[0].status = retry
            ? VideoCallStatus.RETRY_RECEIVED
            : VideoCallStatus.RECEIVED;
          draft.incoming[0].retryCount += retry ? 1 : 0;
        });
      });

      // fetching the iceServers config
      const iceServerConfig = await getIceServerConfig(this.env);

      this.peerInstance = new Peer({
        initiator: false,
        trickle: false,
        stream: this.data.local.stream,
        config: {
          iceServers: iceServerConfig,
        },
      });

      // setup error handler
      this.peerInstance.on('error', (err: any) => {
        console.log('error in accept request', err);

        if (this.data.incoming[0].retryCount >= 5) {
          console.log('Max retries exceeded, please try again.');
          this.disconnect();
        }

        // retrying in case of connection error
        sendVideoCallNotification(
          {
            signer: this.signer,
            chainId: this.chainId,
            pgpPrivateKey: this.pgpPrivateKey,
          },
          {
            senderAddress,
            recipientAddress,
            status: VideoCallStatus.RETRY_INITIALIZED,
            chatId,
            signalData: null,
            env: this.env,
          }
        );
      });

      this.peerInstance.signal(signalData);

      this.peerInstance.on('signal', (data: any) => {
        this.setData((oldData) => {
          return produce(oldData, (draft) => {
            draft.meta.initiator.signal = data;
          });
        });

        sendVideoCallNotification(
          {
            signer: this.signer,
            chainId: this.chainId,
            pgpPrivateKey: this.pgpPrivateKey,
          },
          {
            senderAddress,
            recipientAddress,
            status: retry
              ? VideoCallStatus.RETRY_RECEIVED
              : VideoCallStatus.RECEIVED,
            chatId,
            signalData: data,
            env: this.env,
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
            draft.incoming[0].status = VideoCallStatus.CONNECTED;
          });
        });
      });

      this.peerInstance.on('data', (data: any) => {
        if (isJSON(data)) {
          const parsedData = JSON.parse(data);
          if (parsedData.type === 'isVideoOn') {
            this.setData((oldData) => {
              return produce(oldData, (draft) => {
                draft.incoming[0].video = parsedData.isVideoOn;
              });
            });
          }

          if (parsedData.type === 'isAudioOn') {
            this.setData((oldData) => {
              return produce(oldData, (draft) => {
                draft.incoming[0].audio = parsedData.isAudioOn;
              });
            });
          }

          if (parsedData.type === 'endCall') {
            // destroy the peerInstance
            this.peerInstance?.destroy();
            this.peerInstance = null;

            // destroy the local stream
            if (this.data.local.stream) {
              endStream(this.data.local.stream);
            }

            // reset the state
            this.setData(() => initVideoCallData);
          }
        } else {
          onReceiveMessage(data);
        }
      });

      this.peerInstance.on('stream', (currentStream: MediaStream) => {
        this.setData((oldData) => {
          return produce(oldData, (draft) => {
            draft.incoming[0].stream = currentStream;
          });
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

      // setup error handler
      this.peerInstance.on('error', (err: any) => {
        console.log('error in connect', err);

        if (this.data.incoming[0].retryCount >= 5) {
          console.log('Max retries exceeded, please try again.');
          this.disconnect();
        }

        // retrying in case of connection error
        this.request({
          senderAddress: this.data.local.address,
          recipientAddress: this.data.incoming[0].address,
          chatId: this.data.meta.chatId,
          retry: true,
        });
      });

      this.peerInstance?.signal(signalData);

      // set videoCallInfo state with status connected for the caller's end
      this.setData((oldData) => {
        return produce(oldData, (draft) => {
          draft.incoming[0].status = VideoCallStatus.CONNECTED;
        });
      });
    } catch (err) {
      console.log('error in connect', err);
    }
  }

  disconnect(): void {
    try {
      console.log('disconnect', 'status', this.data.incoming[0].status);
      if (this.data.incoming[0].status === VideoCallStatus.CONNECTED) {
        this.peerInstance?.send(
          JSON.stringify({ type: 'endCall', endCall: true })
        );
      } else {
        // for disconnecting during status INITIALIZED, RECEIVED, RETRY_INITIALIZED, RETRY_RECEIVED
        // send a notif to the other user signaling status = DISCONNECTED
        sendVideoCallNotification(
          {
            signer: this.signer,
            chainId: this.chainId,
            pgpPrivateKey: this.pgpPrivateKey,
          },
          {
            senderAddress: this.data.local.address,
            recipientAddress: this.data.incoming[0].address,
            status: VideoCallStatus.DISCONNECTED,
            chatId: this.data.meta.chatId,
            signalData: null,
            env: this.env,
          }
        );
      }

      // destroy the peerInstance
      this.peerInstance?.destroy();
      this.peerInstance = null;

      // destroy the local stream
      if (this.data.local.stream) {
        endStream(this.data.local.stream);
      }

      // reset the state
      this.setData(() => initVideoCallData);
    } catch (err) {
      console.log('error in disconnect', err);
    }
  }

  // functions for enabling/disabling local audio and video

  enableVideo(options: EnableVideoInputOptions): void {
    const { state } = options || {};

    if (this.data.local.video !== state) {
      // need to change the video state

      if (this.data.incoming[0].status === VideoCallStatus.CONNECTED) {
        this.peerInstance?.send(
          JSON.stringify({
            type: 'isVideoOn',
            isVideoOn: state,
          })
        );
      }
      if (this.data.local.stream) {
        if (state) {
          restartVideoStream(this.data.local.stream);
        } else {
          stopVideoStream(this.data.local.stream);
        }
        this.setData((oldData) => {
          return produce(oldData, (draft) => {
            draft.local.video = state;
          });
        });
      }
    }
  }

  enableAudio(options: EnableAudioInputOptions): void {
    const { state } = options || {};

    if (this.data.local.audio !== state) {
      // need to change the audio state

      if (this.data.incoming[0].status === VideoCallStatus.CONNECTED) {
        this.peerInstance?.send(
          JSON.stringify({ type: 'isAudioOn', isAudioOn: state })
        );
      }
      if (this.data.local.stream) {
        if (state) {
          restartAudioStream(this.data.local.stream);
        } else {
          stopAudioStream(this.data.local.stream);
        }
        this.setData((oldData) => {
          return produce(oldData, (draft) => {
            draft.local.audio = state;
          });
        });
      }
    }
  }

  // helper functions

  isInitiator(): boolean {
    if (
      this.data.meta.initiator.address === '' ||
      this.data.local.address === ''
    )
      return false;

    return this.data.meta.initiator.address === this.data.local.address;
  }
}
