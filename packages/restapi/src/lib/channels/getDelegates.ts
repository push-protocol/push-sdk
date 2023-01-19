import axios from 'axios';
import {
  getCAIPAddress,
  getAPIBaseUrls
} from '../helpers';
import Constants from '../constants';

/**
 *  GET v1/channels/${channelAddressInCAIP}/delegates  
 */

export type GetDelegatesOptionsType = {
  channel: string;
  env?: string;
}

export const getDelegates = async (
  options : GetDelegatesOptionsType
) => {
  const {
    channel,
    env = Constants.ENV.PROD,
  } = options || {};

  const _channel = getCAIPAddress(env, channel, 'Channel');
  const API_BASE_URL = getAPIBaseUrls(env);
  const apiEndpoint = `${API_BASE_URL}/v1/channels`;
  const requestUrl = `${apiEndpoint}/${_channel}/delegates`;

  return await axios.get(requestUrl)
    .then((response) => response.data?.delegates)
    .catch((err) => {
      console.error(`[EPNS-SDK] - API ${requestUrl}: `, err);
    });
}
