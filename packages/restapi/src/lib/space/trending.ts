import axios from 'axios';
import { getAPIBaseUrls } from '../helpers';
import Constants, { ENV } from '../constants';
import {  SpaceIFeeds } from '../types';
import { getTrendingSpaceInboxLists } from '../chat/helpers';

export type TrendingOptionsType = {
  page?: number;
  /**
   * no of items per page - default 10 - max 30
   */
  limit?: number;
  /**
   * Environment variable
   */
  env?: ENV;
};

/**
 * The first time an address wants to send a message to another peer, the address sends an intent request. This first message shall not land in this peer Inbox but in its Request box.
 * This function will return all the chats that landed on the address' Request box. The user can then approve the request or ignore it for now.
 */
export const trending = async (
  options: TrendingOptionsType
): Promise<SpaceIFeeds[]> => {
  const {
    env = Constants.ENV.PROD,
    page = 1,
    limit = 10,
  } = options || {};
  const API_BASE_URL = getAPIBaseUrls(env);
  const apiEndpoint = `${API_BASE_URL}/v1/spaces/trending?page=${page}&limit=${limit}`;
  try {
 
    const response = await axios.get(apiEndpoint);
    const spaces: SpaceIFeeds[] = response.data.spaces;
    const Feeds: SpaceIFeeds[] = await getTrendingSpaceInboxLists({
      lists: spaces,
      env,
    });

    return Feeds;
  } catch (err) {
    console.error(`[Push SDK] - API ${trending.name}: `, err);
    throw Error(`[Push SDK] - API ${trending.name}: ${err}`);
  }
};
