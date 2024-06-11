import { getAPIBaseUrls, getQueryParams, getLimit } from '../helpers';
import Constants, {ENV} from '../constants';
import { axiosGet } from '../utils/axiosUtil';

/**
 *  GET /v1/channels/search/
 *  optional params: page=(1)&limit=(20{min:1}{max:30})&query=(searchquery)
 */

export type SearchChannelTagsOptionsType = {
  query: string;
  env?: ENV;
  page?: number;
  limit?: number;
}

export const searchTags = async (
  options: SearchChannelTagsOptionsType
) => {
  const {
    query,
    env = Constants.ENV.LOCAL,
    page = Constants.PAGINATION.INITIAL_PAGE,
    limit = Constants.PAGINATION.LIMIT,
  } = options || {};

  if (!query) throw Error('"query" not provided!');
  const API_BASE_URL = getAPIBaseUrls(env);
  const apiEndpoint = `${API_BASE_URL}/v1/channels/search/tags`;
  const queryObj = {
    page,
    limit: getLimit(limit),
    query: query
  };
  const requestUrl = `${apiEndpoint}?${getQueryParams(queryObj)}`;
  return axiosGet(requestUrl)
    .then((response) => response.data.channels)
    .catch((err) => {
      console.error(`[Push SDK] - API ${requestUrl}: `, err);
    });
}
