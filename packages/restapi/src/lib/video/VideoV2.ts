import { produce } from 'immer';
import { chats } from '../chat';
import { ENV } from '../constants';
import { isValidPushCAIP, pCAIP10ToWallet, walletToPCAIP10 } from '../helpers';
import { VIDEO_NOTIFICATION_ACCESS_TYPE } from '../payloads/constants';
import {
  VideoCallStatus,
  VideoNotificationRules,
  VideoPeerInfo,
} from '../types';
import { Video as VideoV1 } from './Video';
import { validatePeerInfo } from './helpers/validatePeerInfo';

/**
 * VideoV2 class
 */
export class VideoV2 {
  private account: string;
  private decryptedPgpPvtKey: string;
  private env: ENV;

  private videoInstance: VideoV1;

  // peerInfo objects from the incoming video call requests
  private peerInfos: { [key: string]: VideoPeerInfo };

  /**
   * VideoV2 constructor
   * @param {object} params - The constructor parameters
   * @param {VideoV1} params.videoV1Instance - The VideoV1 instance
   * @param {string} params.account - The account
   * @param {string} params.decryptedPgpPvtKey - The decrypted PGP private key
   * @param {ENV} params.env - The environment
   */
  constructor({
    videoV1Instance,
    account,
    decryptedPgpPvtKey,
    env,
    peerInfos,
  }: {
    videoV1Instance: VideoV1;
    account: string;
    decryptedPgpPvtKey: string;
    env: ENV;
    peerInfos: { [key: string]: VideoPeerInfo };
  }) {
    this.videoInstance = videoV1Instance;
    this.account = account;
    this.decryptedPgpPvtKey = decryptedPgpPvtKey;
    this.env = env;
    this.peerInfos = peerInfos;
  }

  /**
   * Request a video call
   * @param {string[]} recipients - The recipients of the video call
   * @param {object} options - The options for the video call
   * @param {object} options.rules - The rules for the video call
   * @param {object} options.rules.access - The access rules for the video call
   * @param {string} options.rules.access.type - The type of the video call
   * @param {object} options.rules.access.data - The data for the video call
   * @param {string} options.rules.access.data.chatId - The chat ID for the video call
   */
  async request(
    recipients: string[],
    options?: {
      rules: VideoNotificationRules;
    }
  ) {
    const { rules } = options || {};

    for (const recipient of recipients) {
      if (!isValidPushCAIP(recipient)) {
        throw new Error('Invalid recipient address found');
      }
    }

    if (recipients.length === 0) {
      throw new Error(
        'Alteast one recipient address is required for a video call'
      );
    }

    if (
      recipients.length > 1 &&
      rules?.access.type === VIDEO_NOTIFICATION_ACCESS_TYPE.PUSH_CHAT &&
      !rules.access.data.chatId
    ) {
      throw new Error(
        'For multiple recipient addresses, chatId is required for a video call'
      );
    }

    // If chatId is not passed, find a w2w chat between the addresses and use the chatId from there
    let retrievedChatId = '';
    if (!rules?.access.data.chatId) {
      let page = 1;
      const limit = 30;
      while (!retrievedChatId) {
        const response = await chats({
          account: this.account,
          toDecrypt: true,
          pgpPrivateKey: this.decryptedPgpPvtKey,
          env: this.env,
          page,
          limit,
        });

        if (response.length === 0) break;

        response.forEach((chat) => {
          if (chat.did === walletToPCAIP10(recipients[0]) && chat.chatId) {
            retrievedChatId = chat.chatId;
          }
        });

        page++;
      }

      if (!retrievedChatId) {
        throw new Error(
          `ChatId not found between local user (${this.account}) and recipient (${recipients[0]}).`
        );
      }
    }

    this.videoInstance.setData((oldData) => {
      return produce(oldData, (draft: any) => {
        draft.local.address = this.account;
        draft.incoming = recipients.map((recipient) => ({
          address: pCAIP10ToWallet(recipient),
          status: VideoCallStatus.INITIALIZED,
        }));
        draft.meta.chatId = rules?.access.data.chatId ?? retrievedChatId;
      });
    });

    await this.videoInstance.request({
      senderAddress: pCAIP10ToWallet(this.account),
      recipientAddress: recipients.map((recipient) =>
        pCAIP10ToWallet(recipient)
      ),
      rules: rules ?? {
        access: {
          type: VIDEO_NOTIFICATION_ACCESS_TYPE.PUSH_CHAT,
          data: {
            chatId: retrievedChatId,
          },
        },
      },
    });
  }

  /**
   * Approve a video call
   * @param {string} [address] - The address of the peer from which the video call is to be approved
   */
  async approve(address?: string) {
    if (!address) {
      const peerInfoAddresses = Object.keys(this.peerInfos);
      if (peerInfoAddresses.length !== 1) {
        throw new Error(
          'Either no request exists or more than one request found. Please pass an address.'
        );
      }
      address = peerInfoAddresses[0];
    }

    const peerInfo = this.peerInfos[walletToPCAIP10(address)];

    validatePeerInfo(peerInfo);

    await this.videoInstance.acceptRequest({
      senderAddress: pCAIP10ToWallet(this.account),
      recipientAddress: pCAIP10ToWallet(address),
      signalData: peerInfo.signal,
      rules: peerInfo.meta.rules,
    });
  }

  /**
   * Deny a video call
   * @param {string} [address] - The address of the peer from which the video call is to be denied
   */
  async deny(address?: string) {
    if (!address) {
      const peerInfoAddresses = Object.keys(this.peerInfos);
      if (peerInfoAddresses.length !== 1) {
        throw new Error(
          'Either no request exists or more than one request found. Please pass an address.'
        );
      }
      address = peerInfoAddresses[0];
    }

    const peerInfo = this.peerInfos[walletToPCAIP10(address)];

    validatePeerInfo(peerInfo);

    await this.videoInstance.disconnect({
      peerAddress: pCAIP10ToWallet(address),
    });
  }

  /**
   * Disconnect from a video call
   */
  async disconnect() {
    await this.videoInstance.disconnect();
  }

  /**
   * Enable or disable config properties (video, audio)
   * @param {object} params - The parameters
   * @param {boolean} params.video - The video state
   * @param {boolean} params.audio - The audio state
   */
  config({ video, audio }: { video?: boolean; audio?: boolean }) {
    if (typeof video === 'boolean') {
      this.videoInstance.enableVideo({ state: video });
    }

    if (typeof audio === 'boolean') {
      this.videoInstance.enableAudio({ state: audio });
    }
  }
}
