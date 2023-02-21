import axios from 'axios';
import { getAPIBaseUrls, isValidETHAddress, walletToPCAIP10 } from '../helpers';
import Constants from '../constants';
import { IFeeds } from '../types';
import { getInboxLists } from './helpers';

/**
 *  GET '/v1/chat/users/:did/requests
 */

export type RequestOptionsType = {
  account: string; // caip10
  pgpPrivateKey?: string;
  toDecrypt?: boolean;
  env?: string;
};

export const requests = async (
  options: RequestOptionsType
): Promise<IFeeds[]> => {
  const { account, pgpPrivateKey, env = Constants.ENV.PROD, toDecrypt = false } = options || {};
  const user = walletToPCAIP10(account);
  const API_BASE_URL = getAPIBaseUrls(env);
  const apiEndpoint = `${API_BASE_URL}/v1/chat/users/${user}/requests`;
  const requestUrl = `${apiEndpoint}`;
  try {
    if (!isValidETHAddress(user)) {
      throw new Error(`Invalid address!`);
    }
    const response = await axios.get(requestUrl);
    const requests: IFeeds[] = response.data.requests;
    const Feeds: IFeeds[] = await getInboxLists({
      lists: requests,
      user,
      toDecrypt,
      pgpPrivateKey,
      env,
    });

    return Feeds;
  } catch (err) {
    console.error(`[EPNS-SDK] - API ${requestUrl}: `, err);
    throw Error(`[EPNS-SDK] - API ${requestUrl}: ${err}`);
  }
};