import { ENV } from '../constants';
import { SignerType, VideoCallData } from '../types';

import { Video as VideoV1 } from '../video/Video';
import { VideoV2 } from '../video/VideoV2';
import { VideoInitializeOptions } from './pushAPITypes';

export class Video {
  constructor(
    private account: string,
    private env: ENV,
    private decryptedPgpPvtKey?: string,
    private signer?: SignerType
  ) {}

  async initialize(
    setVideoData: (fn: (data: VideoCallData) => VideoCallData) => void,
    options?: VideoInitializeOptions
  ) {
    const { media, stream } = options || {};

    const chainId = await this.signer?.getChainId();

    if (!chainId) {
      throw new Error('Chain Id not retrievable from signer');
    }

    if (!this.signer) {
      throw new Error('Signer is required for push video');
    }

    if (!this.decryptedPgpPvtKey) {
      throw new Error('PushSDK was initialized in readonly mode. Video functionality is not available.');
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

    // Return an instance of the video v2 class
    return new VideoV2({
      videoV1Instance,
      account: this.account,
      decryptedPgpPvtKey: this.decryptedPgpPvtKey!,
      env: this.env,
    });
  }
}
