import axios from 'axios';
import {
  getAPIBaseUrls,
} from '../helpers';
import Constants from '../constants';

/**
 *  GET '/v1/w2w/users/:did/messages
 */

export type ChatOptionsType = {
  user: string; // caip10
  env?: string;
}

export const getChat = async (
  options : ChatOptionsType
) => {
  const {
    user,
    env = Constants.ENV.PROD,
  } = options || {};

  const API_BASE_URL = getAPIBaseUrls(env);
  const apiEndpoint = `${API_BASE_URL}/v1/w2w/users/${user}/messages`;


  const requestUrl = `${apiEndpoint}`;

  return axios.get(requestUrl)
    .catch((err) => {
      console.error(`[EPNS-SDK] - API ${requestUrl}: `, err);
    });
}
