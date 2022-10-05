import axios from 'axios';
import {
  getCAIPAddress,
  getAPIBaseUrls
} from '../helpers';
import Constants from '../constants';

/**
 *  GET /v1/channels/{addressinCAIP}   
 */

export type GetChannelOptionsType = {
  channel: string;
  env?: string;
}

export const getChannel = async (
  options : GetChannelOptionsType
) => {
  const {
    channel,
    env = Constants.ENV.PROD,
  } = options || {};

  const _channel = getCAIPAddress(env, channel, 'Channel');
  const API_BASE_URL = getAPIBaseUrls(env);
  const apiEndpoint = `${API_BASE_URL}/v1/channels`;
  const requestUrl = `${apiEndpoint}/${_channel}`;

  return await axios.get(requestUrl)
    .then((response) => response.data)
    .catch((err) => {
      console.error(`[EPNS-SDK] - API ${requestUrl}: `, err);
    });
}
