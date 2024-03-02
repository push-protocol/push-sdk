import { getCAIPAddress, getAPIBaseUrls, getQueryParams } from '../helpers';
import Constants, { ENV } from '../constants';
import { axiosGet } from '../utils/axiosUtil';
import { parseApiResponse } from '../utils';

/**
 *  GET /v1/channels/{addressinCAIP}
 */

enum NotifictaionType  {
    BROADCAT = 1,
    TARGETTED = 3,
    SUBSET = 4
  }

type GetChannelOptionsType = {
  channel: string;
  env?: ENV;
  page?: number;
  limit?: number;
  filter?: NotifictaionType | null;
  raw?: boolean;
};

export const getChannelNotifications = async (
  options: GetChannelOptionsType
) => {
  const {
    channel,
    env = Constants.ENV.PROD,
    page = Constants.PAGINATION.INITIAL_PAGE,
    limit = Constants.PAGINATION.LIMIT,
    filter = null,
    raw = true,
  } = options || {};

  const _channel = await getCAIPAddress(env, channel, 'Channel');
  const API_BASE_URL = getAPIBaseUrls(env);
  const apiEndpoint = `${API_BASE_URL}/v1/channels`;
  const query = getQueryParams(
    filter
      ? {
          page,
          limit,
          notificationType: filter,
        }
      : {
          page,
          limit,
        }
  );
  const requestUrl = `${apiEndpoint}/${_channel}/notifications?${query}`;
  return await axiosGet(requestUrl)
    .then((response) => {
      if (raw) return {feeds: response.data?.feeds ?? [], itemcount:response.data?.itemcount} ;
      else
        return  { feeds: parseApiResponse(response.data?.feeds?? []), itemcount: response.data?.itemcount}
          ;
    })
    .catch((err) => {
      console.error(`[Push SDK] - API ${requestUrl}: `, err);
    });
};
