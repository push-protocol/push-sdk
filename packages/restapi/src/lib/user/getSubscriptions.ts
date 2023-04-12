import axios from 'axios';
import { getCAIPAddress, getAPIBaseUrls } from '../helpers';
import Constants, { ENV } from '../constants';
import { SubscriptionsReturnType } from '../types';

export type UserSubscriptionsOptionsType = {
  user: string;
  env?: ENV;
};

export const getSubscriptions = async (
  options: UserSubscriptionsOptionsType
): Promise<SubscriptionsReturnType[]> => {
  const { user, env = Constants.ENV.PROD } = options || {};

  const _user = getCAIPAddress(env, user, 'User');
  const API_BASE_URL = getAPIBaseUrls(env);
  const apiEndpoint = `${API_BASE_URL}/v1/users/${_user}/subscriptions`;
  const requestUrl = `${apiEndpoint}`;

  return axios
    .get(requestUrl)
    .then((response) => response.data?.subscriptions || [])
    .catch((err) => {
      console.error(`[Push SDK] - API ${requestUrl}: `, err);
    });
};
