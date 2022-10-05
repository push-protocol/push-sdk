import axios from 'axios';
import {
  getCAIPAddress,
  getAPIBaseUrls,
  getQueryParams,
  getLimit,
} from '../helpers';
import Constants from '../constants';
import { parseApiResponse } from '../utils';

/**
 *  GET '/v1/users/:userAddressInCAIP/feeds
 *  optional params: page=(1)&limit=(20{min=1|max=50})&spam=(false)'
 */

export type FeedsOptionsType = {
  user: string;
  env?: string;
  page?: number;
  limit?: number;
  spam?: boolean;
  raw?: boolean;
}

export const getFeeds = async (
  options : FeedsOptionsType
) => {
  const {
    user,
    env = Constants.ENV.PROD,
    page = Constants.PAGINATION.INITIAL_PAGE,
    limit = Constants.PAGINATION.LIMIT,
    spam = false,
    raw = false,
  } = options || {};

  const _user = getCAIPAddress(env, user, 'User');
  const API_BASE_URL = getAPIBaseUrls(env);
  const apiEndpoint = `${API_BASE_URL}/v1/users/${_user}/feeds`;

  const queryObj = {
    page,
    limit: getLimit(limit),
    spam
  };

  const requestUrl = `${apiEndpoint}?${getQueryParams(queryObj)}`;

  return axios.get(requestUrl)
    .then((response) => {
      if (raw) {
        return response?.data?.feeds || [];
      }
      return parseApiResponse(response?.data?.feeds) || [];
    })
    .catch((err) => {
      console.error(`[EPNS-SDK] - API ${requestUrl}: `, err);
    });
}
