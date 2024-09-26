import { getAPIBaseUrls, getQueryParams, getLimit } from '../helpers';
import Constants, { ENV } from '../constants';
import { axiosGet } from '../utils/axiosUtil';

/**
 *  GET /v1/channels/search/
 *  optional params: page=(1)&limit=(20{min:1}{max:30})&query=(searchquery)
 *
 */

export type SearchChannelOptionsType = {
  query: string;
  env?: ENV;
  page?: number;
  limit?: number;
  filter?: number;
  tag?: string;
  // temp fix to support both new and old format
  oldFormat?: boolean;
};

export const search = async (options: SearchChannelOptionsType) => {
  const {
    query,
    env = Constants.ENV.PROD,
    page = Constants.PAGINATION.INITIAL_PAGE,
    limit = Constants.PAGINATION.LIMIT,
    filter,
    tag,
    oldFormat = true,
  } = options || {};

  if (!query) throw Error('"query" not provided!');
  const API_BASE_URL = getAPIBaseUrls(env);
  const apiEndpoint = `${API_BASE_URL}/v1/channels/search/`;
  const queryObj = {
    page,
    limit: getLimit(limit),
    query,
    ...(tag && { tag }),
    ...(filter && { filter }),
  };
  const requestUrl = `${apiEndpoint}?${getQueryParams(queryObj)}`;
  return axiosGet(requestUrl)
    .then((response) => {
      const channels = response.data.channels;
      const itemCount = response.data.itemCount || channels.length;

      const formattedResponse = {
        itemCount,
        result: channels,
      };

      if (typeof oldFormat !== 'undefined' && oldFormat) {
        return channels; // Old format: return array directly
      }

      return formattedResponse; // New format: return {itemCount, result}
    })
    .catch((err) => {
      console.error(`[Push SDK] - API ${requestUrl}: `, err);
    });
};
