import {
  getCAIPAddress,
  getAPIBaseUrls,
  getQueryParams,
  getLimit,
  walletToPCAIP10,
} from '../helpers';
import Constants, { ENV } from '../constants';
import { parseApiResponse } from '../utils';
import { axiosGet } from '../utils/axiosUtil';

export type FeedsOptionsType = {
  user: string;
  yearMonth: string;
  afterEpoch: number | '';
  env?: ENV;
  page?: number;
  limit?: number;
  spam?: boolean;
  raw?: boolean;
};

export const getFeeds = async (options: FeedsOptionsType) => {
  const {
    user,
    yearMonth,
    afterEpoch,
    env = Constants.ENV.PROD,
    page = Constants.PAGINATION.INITIAL_PAGE,
    limit = Constants.PAGINATION.LIMIT,
    spam = false,
    raw = false,
  } = options || {};

  const _user = await walletToPCAIP10(user);
  const API_BASE_URL = await getAPIBaseUrls(env);
  const nsName = spam ? 'spam' : 'inbox';
  let requestUrl = `${API_BASE_URL}/v1/messaging/ns/${nsName}/nsidx/${_user}/month/${yearMonth}/list`;
  if (afterEpoch !== '') {
    requestUrl = `${requestUrl}?fristTs=${afterEpoch}`;
  }
  return axiosGet(requestUrl)
    .then((response) => {
      // if (raw) {
      return response.data;
      // }
      // return parseApiResponse(response?.data?.feeds) || [];
    })
    .catch((err) => {
      console.error(`[Push SDK] - API ${requestUrl}: `, err);
    });
};
