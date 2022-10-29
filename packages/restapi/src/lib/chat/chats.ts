import axios from 'axios';
import {
  getAPIBaseUrls,
} from '../helpers';
import Constants from '../constants';
import { Message } from '../types';

/**
 *  GET '/v1/w2w/users/:did/chats
 */

export type ChatOptionsType = {
  user: string; // caip10
  env?: string;
}

// Only get the chats not the intent
export const chats = async (
  options: ChatOptionsType
): Promise<Message[]> => {
  const {
    user,
    env = Constants.ENV.PROD,
  } = options || {};
  const API_BASE_URL = getAPIBaseUrls(env);
  const apiEndpoint = `${API_BASE_URL}/v1/w2w/users/${user}/chats`;
  const requestUrl = `${apiEndpoint}`;
  try {
    const response = await axios.get(requestUrl)
    const chats: Message[] = JSON.parse(response.data);
    return chats;
  } catch (err) {
    console.error(`[EPNS-SDK] - API ${requestUrl}: `, err);
    throw Error(`[EPNS-SDK] - API ${requestUrl}: ${err}`);
  }
}
