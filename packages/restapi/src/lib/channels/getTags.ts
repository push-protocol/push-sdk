import {
    getCAIPAddress,
    getAPIBaseUrls
  } from '../helpers';
  import Constants, { ENV } from '../constants';
  import { axiosGet } from '../utils/axiosUtil';

  /**
   *  GET v1/channels/${channelAddressInCAIP}/tags
   */
  export type GetTagsOptionsType = {
    /** address of the channel */
    channel: string;
    env?: ENV;
  }

  /**
   *  Returns the list of tags associated with the channel
   */
  export const getTags = async (
    options : GetTagsOptionsType
  ) => {
    const {
      channel,
      env = Constants.ENV.PROD,
    } = options || {};

    const _channel = await getCAIPAddress(env, channel, 'Channel');
    const API_BASE_URL = getAPIBaseUrls(env);
    const apiEndpoint = `${API_BASE_URL}/v1/channels`;
    const requestUrl = `${apiEndpoint}/${_channel}/tags`;

    return await axiosGet(requestUrl)
      .then((response) => response.data?.tags)
      .catch((err) => {
        console.error(`[EPNS-SDK] - API ${requestUrl}: `, err);
      });
  }
