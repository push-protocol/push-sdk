import axios from 'axios';
import {
  getCAIPAddress,
  getAPIBaseUrls,
  getQueryParams,
  getLimit,
} from '../helpers';
import Constants, {ENV} from '../constants';
import { parseApiResponse } from '../utils';

export type FeedsOptionsType = {
  user: string;
  env?: ENV;
  page?: number;
  limit?: number;
  spam?: boolean;
  raw?: boolean;
}

export const getFeeds = async (
  options: FeedsOptionsType
) => {
  const {
    user,
    env = Constants.ENV.PROD,
    page = Constants.PAGINATION.INITIAL_PAGE,
    limit = Constants.PAGINATION.LIMIT,
    spam = false,
    raw = false,
  } = options || {};

  const _user = await getCAIPAddress(env, user, 'User');
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
      console.error(`[Push SDK] - API ${requestUrl}: `, err);
    });
}
