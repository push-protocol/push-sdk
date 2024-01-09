import { ENV } from '../constants';
import CONSTANTS from '../constantsV2';
import { SignerType, VideoCallData } from '../types';
import { Signer as PushSigner } from '../helpers';

import { Video as VideoV1 } from '../video/Video';
import { VideoV2 } from '../video/VideoV2';
import { VideoInitializeOptions } from './pushAPITypes';
import { VideoEvent, VideoEventType } from '../pushstream/pushStreamTypes';

export class Video {
  constructor(
    private account: string,
    private env: ENV,
    private decryptedPgpPvtKey?: string,
    private signer?: SignerType
  ) {}

  async initialize(
    setVideoData: (fn: (data: VideoCallData) => VideoCallData) => void,
    options: VideoInitializeOptions
  ) {
    const { socketStream, media, stream } = options;

    if (!this.signer) {
      throw new Error('Signer is required for push video');
    }

    if (!this.decryptedPgpPvtKey) {
      throw new Error(
        'PushSDK was initialized in readonly mode. Video functionality is not available.'
      );
    }

    const chainId = await new PushSigner(this.signer).getChainId();

    if (!chainId) {
      throw new Error('Chain Id not retrievable from signer');
    }

    // Initialize the video instance with the provided options
    const videoV1Instance = new VideoV1({
      signer: this.signer!,
      chainId,
      pgpPrivateKey: this.decryptedPgpPvtKey!,
      env: this.env,
      setData: setVideoData,
    });

    // Create the media stream with the provided options
    await videoV1Instance.create({
      ...(stream && {
        stream,
      }),
      ...(media?.audio && {
        audio: media.audio,
      }),
      ...(media?.video && {
        video: media.video,
      }),
    });

    // Setup video event handlers
    socketStream.on(CONSTANTS.STREAM.VIDEO, (data: VideoEvent) => {
      const {
        address,
        signal,
        meta: { rules },
      } = data.peerInfo;

      // Check if the chatId from the incoming video event matches the chatId of the current video instance
      if (rules.access.data.chatId === videoV1Instance.data.meta.chatId) {
        // If the event is a ConnectVideo or RetryApproveVideo event, connect to the video
        if (
          data.event === VideoEventType.ConnectVideo ||
          data.event === VideoEventType.RetryApproveVideo
        ) {
          videoV1Instance.connect({ peerAddress: address, signalData: signal });
        }

        // If the event is a RetryRequestVideo event and the current instance is the initiator, send a request
        if (
          data.event === VideoEventType.RetryRequestVideo &&
          videoV1Instance.isInitiator()
        ) {
          videoV1Instance.request({
            senderAddress: this.account,
            recipientAddress: address,
            chatId: rules.access.data.chatId,
            retry: true,
          });
        }

        // If the event is a RetryRequestVideo event and the current instance is not the initiator, accept the request
        if (
          data.event === VideoEventType.RetryRequestVideo &&
          !videoV1Instance.isInitiator()
        ) {
          videoV1Instance.acceptRequest({
            signalData: signal,
            senderAddress: this.account,
            recipientAddress: address,
            chatId: rules.access.data.chatId,
            retry: true,
          });
        }
      }
    });

    // Return an instance of the video v2 class
    return new VideoV2({
      videoV1Instance,
      account: this.account,
      decryptedPgpPvtKey: this.decryptedPgpPvtKey!,
      env: this.env,
    });
  }
}
