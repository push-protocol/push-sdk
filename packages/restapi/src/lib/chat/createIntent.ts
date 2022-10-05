import axios from 'axios';
import {
  getAPIBaseUrls,
} from '../helpers';
import Constants from '../constants';

/**
 *  POST '/v1/w2w/intents
 */

export type ChatCreateIntentOptionsType = {
  from: string;
  to: string;
  encType: string;
  messageContent?: string;
  messageType?: string;
  signature?: string;
  encryptedSecret?: string;
  sigType?: string;
  env?: string;
}

export const createIntent = async (
  options : ChatCreateIntentOptionsType
) => {
  const {
    from,
    to,
    encType,
    messageContent = '',
    messageType = '',
    signature = '',
    encryptedSecret = '',
    sigType = '',
    env = Constants.ENV.PROD,
  } = options || {};

  const API_BASE_URL = getAPIBaseUrls(env);
  const apiEndpoint = `${API_BASE_URL}/v1/w2w/intents`;


  const requestUrl = `${apiEndpoint}`;

  const body = {
    fromDID: from,
    toDID: to,
    fromCAIP10: from,
    toCAIP10: to,
    messageContent,
    messageType,
    signature,
    encType,
    encryptedSecret,
    sigType,
  };

  return axios.post(requestUrl, body)
    .catch((err) => {
      console.error(`[EPNS-SDK] - API ${requestUrl}: `, err);
    });
}
