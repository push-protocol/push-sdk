import Constants, { ENV } from '../constants';
import { SignerType } from '../types';
import {
  ChannelInfoOptions,
  ChannelSearchOptions,
  TagListOptions
} from './PushNotificationTypes';
import * as PUSH_CHANNEL from '../channels';
import { PushNotificationBaseClass } from './pushNotificationBase';
import { Channel } from './channel';
import ConstantsV2 from '../constantsV2';
export class Tags extends PushNotificationBaseClass {
  private channel: Channel;

  constructor(
    channel: Channel,
    signer?: SignerType,
    env?: ENV,
    account?: string
  ) {
    super(signer, env, account);
    this.channel = channel;
  }

  /**
   * @description - Get delegates of a channell
   * @param {string} [options.channel] - channel in caip. defaults to account from signer with eth caip
   * @returns array of delegates
   */
  get = async (options?: ChannelInfoOptions) => {
    try {
      this.checkSignerObjectExists();
      const channel = await this.channel.info();
      return await PUSH_CHANNEL.getTags({
        channel: channel,
        env: this.env,
      });
    } catch (error) {
      throw new Error(`Push SDK Error: API : tags::get : ${error}`);
    }
  };

  /**
   * @description adds tags for a channel
   * @param {Array<string>} tags - tags to be added
   * @returns the tags if the transaction is successfull
   */
  add = async (tags: Array<string>) => {
    try {
      this.checkSignerObjectExists();
      const channel = await this.channel.info();

      const resp = await this.channel.update({
        name: channel.name,
        description: channel.info,
        url: channel.url,
        icon: channel.icon,
        tags: tags,
      });

      return { tags };
    } catch (error) {
      throw new Error(`Push SDK Error: Contract : tags::add : ${error}`);
    }
  };

  /**
   * @description update tags for a channel
   * @param {Array<string>} tags - tags to be added
   * @returns the tags if the transaction is successfull
   */
  update = async (tags: Array<string>) => {
    try {
      this.checkSignerObjectExists();
      const channel = await this.channel.info();
      await this.channel.update({
        name: channel.name,
        description: channel.info,
        url: channel.url,
        icon: channel.icon,
        tags: tags,
      });

      return { tags };
    } catch (error) {
      throw new Error(`Push SDK Error: Contract : tags::update : ${error}`);
    }
  };

  /**
   * @description removes tags from a channel
   * @returns status of the request
   */
  remove = async () => {
    try {
      this.checkSignerObjectExists();
      const channel = await this.channel.info();
      await this.channel.update({
        name: channel.name,
        description: channel.info,
        url: channel.url,
        icon: channel.icon,
        tags: [],
      });

      return { status: 'success' };
    } catch (error) {
      throw new Error(`Push SDK Error: Contract : tags::remove : ${error}`);
    }
  };

  /**
   * @description - returns relevant information as per the query that was passed
   * @param {string} query - search query
   * @param {number} [options.page] -  page number. default is set to Constants.PAGINATION.INITIAL_PAGE
   * @param {number} [options.limit] - number of feeds per page. default is set to Constants.PAGINATION.LIMIT
   * @returns Array of results relevant to the serach query
   */
  search = async (query: string, options?: ChannelSearchOptions) => {
    try {
      const {
        page = Constants.PAGINATION.INITIAL_PAGE,
        limit = Constants.PAGINATION.LIMIT,
      } = options || {};

      return await PUSH_CHANNEL.searchTags({
        query: query,
        page: page,
        limit: limit,
        env: this.env,
      });
    } catch (error) {
      throw new Error(`Push SDK Error: API : channel::tags::search : ${error}`);
    }
  };

  list = async (options?: TagListOptions) => {
    try {
      const {
        page = Constants.PAGINATION.INITIAL_PAGE,
        limit = Constants.PAGINATION.LIMIT,
        order = ConstantsV2.FILTER.CHANNEL_LIST.ORDER.DESCENDING,
        filter = ConstantsV2.FILTER.TAGS.PUSH,
      } = options || {};

      return await PUSH_CHANNEL.getAllTags({
        page: page,
        limit: limit,
        order: order,
        filter: filter,
        env: this.env,
      });
    } catch (error) {
      throw new Error(`Push SDK Error: API : channel::tags::list : ${error}`);
    }
  };
}
