import Constants, { ENV } from '../constants';
import { SignerType } from '../types';
import {
  SubscribeUnsubscribeOptions,
  SubscriptionOptions,
  FeedType,
  FeedsOptions,
} from './PushNotificationTypes';
import * as PUSH_USER from '../user';
import * as PUSH_CHANNEL from '../channels';

import {
  getCAIPDetails,
  getCAIPWithChainId,
  validateCAIP,
  getFallbackETHCAIPAddress,
} from '../chat/helpers/address';

import { PushNotificationBaseClass } from './pushNotificationBase';
// ERROR CONSTANTS
const ERROR_CHANNEL_NEEDED = 'Channel is needed';
const ERROR_INVALID_CAIP = 'Invalid CAIP format';

export const FEED_MAP = {
  INBOX: false,
  SPAM: true,
};
export class Notification extends PushNotificationBaseClass {
  constructor(signer?: SignerType, env?: ENV, account?: string) {
    super(signer, env, account);
  }

  /**
   * @description - Fetches feeds and spam feeds for a specific user
   * @param {enums} spam - indicates if its a spam or not. `INBOX` for non-spam and `SPAM` for spam. default `INBOX`
   * @param {string} [options.user] - user address, defaults to address from signer
   * @param {number} [options.page] -  page number. default is set to Constants.PAGINATION.INITIAL_PAGE
   * @param {number} [options.limit] - number of feeds per page. default is set to Constants.PAGINATION.LIMIT
   * @param {boolean} [options.raw] - indicates if the response should be raw or formatted. defaults is set to false
   * @returns feeds for a specific address
   */
  async list(
    spam: `${FeedType}` = FeedType.INBOX,
    options?: FeedsOptions
  ) {
    const {
      page = Constants.PAGINATION.INITIAL_PAGE,
      limit = Constants.PAGINATION.LIMIT,
      channels = [],
      raw = false,
    } = options || {};
    try {
      const account = options?.account
        ? options.account
        : this.account
          ? getFallbackETHCAIPAddress(this.env!, this.account!)
          : null;
      // guest mode and valid address check
      this.checkUserAddressExists(account!);
      const nonCaipAccount = this.getAddressFromCaip(account!);
      if (channels.length == 0) {
        // else return the response
        return await PUSH_USER.getFeeds({
          user: nonCaipAccount!,
          page: page,
          limit: limit,
          spam: FEED_MAP[spam],
          raw: raw,
          env: this.env,
        });
      } else {
        const promises = channels.map(async (channel) => {
          return await PUSH_USER.getFeedsPerChannel({
            user: nonCaipAccount!,
            page: page,
            limit: limit,
            spam: FEED_MAP[spam],
            raw: raw,
            env: this.env,
            channels: [channel],
          });
        });

        const results = await Promise.all(promises);
        const feedRes = results.flat();
        return feedRes;
      }
    } catch (error) {
      throw new Error(`Push SDK Error: API : notifcaiton::list : ${error}`);
    }
  }

  async subscriptions(options?: SubscriptionOptions) {
    try {
      const {
        // TODO: to be used once pagination is implemeted at API level
        page = Constants.PAGINATION.INITIAL_PAGE,
        limit = Constants.PAGINATION.LIMIT,
        channel = null,
        raw
      } = options || {};
      const account = options?.account
        ? options.account
        : this.account
          ? getFallbackETHCAIPAddress(this.env!, this.account!)
          : null;
      this.checkUserAddressExists(account!);
      return await PUSH_USER.getSubscriptions({
        user: account!,
        env: this.env,
        channel: channel,
        raw
      });
    } catch (error) {
      throw new Error(
        `Push SDK Error: API : notifcaiton::subscriptions : ${error}`
      );
    }
  }

  /**
   * Subscribes a user to a channel
   * @param {string} channel - channel address in caip format
   * @param {function} [options.onSuccess] - callback function when a user successfully subscribes to a channel
   * @param {function} [options.onError] - callback function incase a user was not able to subscribe to a channel
   * @returns Subscribe status object
   */
  async subscribe(
    channel: string,
    options?: SubscribeUnsubscribeOptions
  ) {
    try {
      const {onSuccess, onError, settings} = options || {};
      // Vaidatiions
      // validates if signer object is present
      this.checkSignerObjectExists();
      // validates if the user address exists
      this.checkUserAddressExists();
      // validates if channel exists
      if (!channel && channel != '') {
        throw new Error(ERROR_CHANNEL_NEEDED);
      }
      // validates if caip is correct
      if (!validateCAIP(channel)) {
        throw new Error(ERROR_INVALID_CAIP);
      }
      // get channel caip
      const caipDetail = getCAIPDetails(channel);
      // based on the caip, construct the user caip
      const userAddressInCaip = getCAIPWithChainId(
        this.account!,
        parseInt(caipDetail?.networkId as string)
      );
      // convert the setting to minimal version
      const minimalSetting = this.getMinimalUserSetting(settings!);
      return await PUSH_CHANNEL.subscribeV2({
        signer: this.signer!,
        channelAddress: channel,
        userAddress: userAddressInCaip,
        env: this.env,
        settings: minimalSetting ?? '',
        onSuccess: onSuccess,
        onError: onError,
      });
    } catch (error) {
      throw new Error(
        `Push SDK Error: API : notifcaiton::subscribe : ${error}`
      );
    }
  }

  /**
   * Unsubscribes a user to a channel
   * @param {string} channel - channel address in caip format
   * @param {function} [options.onSuccess] - callback function when a user successfully unsubscribes to a channel
   * @param {function} [options.onError] - callback function incase a user was not able to unsubscribe to a channel
   * @returns Unsubscribe status object
   */
  async unsubscribe(
    channel: string,
    options?: SubscribeUnsubscribeOptions
  ) {
    try {
      const {onSuccess, onError} = options || {};
      // Vaidatiions
      // validates if the user address exists
      this.checkUserAddressExists();
      // validates if signer object is present
      this.checkSignerObjectExists();
      // validates if channel exists
      if (!channel && channel != '') {
        return new Error(ERROR_CHANNEL_NEEDED);
      }
      // validates if caip is correct
      if (!validateCAIP(channel)) {
        return new Error(ERROR_INVALID_CAIP);
      }
      const caipDetail = getCAIPDetails(channel);
      const userAddressInCaip = getCAIPWithChainId(
        this.account!,
        parseInt(caipDetail?.networkId as string)
      );
      return await PUSH_CHANNEL.unsubscribeV2({
        signer: this.signer!,
        channelAddress: channel,
        userAddress: userAddressInCaip,
        env: this.env,
        onSuccess: onSuccess,
        onError: onError,
      });
    } catch (error) {
      throw new Error(
        `Push SDK Error: API : notifcaiton::unsubscribe : ${error}`
      );
    }
  }
}
