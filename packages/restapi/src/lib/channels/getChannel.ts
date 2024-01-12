import { getCAIPAddress, getAPIBaseUrls } from '../helpers';
import Constants, { ENV } from '../constants';
import { axiosGet } from '../utils/axiosUtil';

/**
 *  GET /v1/channels/{addressinCAIP}
 */

export type GetChannelOptionsType = {
  channel: string;
  env?: ENV;
};

export const getChannel = async (options: GetChannelOptionsType) => {
  const { channel, env = Constants.ENV.PROD } = options || {};

  const _channel = await getCAIPAddress(env, channel, 'Channel');
  const API_BASE_URL = getAPIBaseUrls(env);
  const apiEndpoint = `${API_BASE_URL}/v1/channels`;
  const requestUrl = `${apiEndpoint}/${_channel}`;

  return await axiosGet(requestUrl)
    .then((response) => response.data)
    .catch((err) => {
      console.error(`[Push SDK] - API ${requestUrl}: `, err);
    });
};
