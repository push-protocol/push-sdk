import { getCAIPAddress, getAPIBaseUrls, getQueryParams } from '../helpers';
import Constants, { ENV } from '../constants';
import { axiosGet } from '../utils/axiosUtil';
import CONSTANTS from '../constantsV2';

/**
 *  GET v1/channels/tags/all
 */
export type GetAllTagsOptionsType = {
  page?: number;
  limit?: number;
  order?: string;
  filter?:string;
  env?: ENV;
};

/**
 *  Returns the tags available based on the filter provided
 */
export const getAllTags = async (options: GetAllTagsOptionsType) => {
  const {
    page=1,
    limit=10,
    order=CONSTANTS.FILTER.CHANNEL_LIST.ORDER.DESCENDING,
    filter=CONSTANTS.FILTER.TAGS.PUSH,
    env = Constants.ENV.PROD,
  } = options || {};

  const API_BASE_URL = getAPIBaseUrls(env);
  const apiEndpoint = `${API_BASE_URL}/v1/channels`;
  const queryObj = {
    page,
    limit,
    order,
    filter,
  }
  const requestUrl = `${apiEndpoint}/tags/all?${getQueryParams(queryObj)}`;
  return await axiosGet(requestUrl)
    .then((response) => response.data?.tags)
    .catch((err) => {
      console.error(`[EPNS-SDK] - API ${requestUrl}: `, err);
    });
};
