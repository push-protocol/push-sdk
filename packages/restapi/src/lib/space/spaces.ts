import axios from 'axios';
import { getAPIBaseUrls, isValidETHAddress } from '../helpers';
import Constants, { ENV } from '../constants';
import {  SpaceIFeeds } from '../types';
import {  getSpaceInboxLists, getUserDID } from '../chat/helpers';

export type ChatsOptionsType = {
  account: string;
  pgpPrivateKey?: string;
  /**
   * If true, the method will return decrypted message content in response
   */
  toDecrypt?: boolean;
  /**
   * page index - default 1
   */
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
 * Return the latest message from all wallet addresses you have talked to. This can be used when building the inbox page.
 */
export const spaces = async (options: ChatsOptionsType): Promise<SpaceIFeeds[]> => {
  const {
    account,
    pgpPrivateKey,
    env = Constants.ENV.PROD,
    page = 1,
    limit = 10,
  } = options || {};
  if (!isValidETHAddress(account)) {
    throw new Error(`Invalid address!`);
  }
  const user = await getUserDID(account, env);
  const API_BASE_URL = getAPIBaseUrls(env);
  const apiEndpoint = `${API_BASE_URL}/v1/spaces/users/${user}/spaces?page=${page}&limit=${limit}`;
  const requestUrl = `${apiEndpoint}`;
  try {
    const toDecrypt = false;
    const response = await axios.get(requestUrl);
    const chats: SpaceIFeeds[] = response.data.chats;
    const feeds: SpaceIFeeds[] = await getSpaceInboxLists({
      lists: chats,
      user: user,
      toDecrypt,
      pgpPrivateKey,
      env,
    });
    return feeds;
  } catch (err) {
    console.error(`[Push SDK] - API ${spaces.name}: `, err);
    throw Error(`[Push SDK] - API ${spaces.name}: ${err}`);
  }
};
