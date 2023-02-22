import axios from 'axios';
import { getAPIBaseUrls, isValidETHAddress, walletToPCAIP10 } from '../helpers';
import Constants from '../constants';
import { IFeeds } from '../types';
import { getInboxLists } from './helpers';

export type ChatsOptionsType = {
  account: string;
  pgpPrivateKey?: string;
  /**
   * If true, the method will return decrypted message content in response
   */
  toDecrypt?: boolean;
  /**
   * Environment variable
   */
  env?: string;
};

/**
 * Return the latest message from all wallet addresses you have talked to. This can be used when building the inbox page.
 */
export const chats = async (options: ChatsOptionsType): Promise<IFeeds[]> => {
  const { account, pgpPrivateKey, env = Constants.ENV.PROD, toDecrypt = false } = options || {};
  const user = walletToPCAIP10(account);
  const API_BASE_URL = getAPIBaseUrls(env);
  const apiEndpoint = `${API_BASE_URL}/v1/chat/users/${user}/chats`;
  const requestUrl = `${apiEndpoint}`;
  try {
    if (!isValidETHAddress(user)) {
      throw new Error(`Invalid address!`);
    }
    const response = await axios.get(requestUrl);
    const chats: IFeeds[] = response.data.chats;
    const feeds: IFeeds[] = await getInboxLists({
      lists: chats,
      user,
      toDecrypt,
      pgpPrivateKey,
      env,
    });
    return feeds;
  } catch (err) {
    console.error(`[EPNS-SDK] - API ${requestUrl}: `, err);
    throw Error(`[EPNS-SDK] - API ${requestUrl}: ${err}`);
  }
};