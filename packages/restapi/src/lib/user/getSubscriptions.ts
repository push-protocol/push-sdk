import axios from 'axios';
import {
  getCAIPAddress,
  getAPIBaseUrls
} from '../helpers';
import Constants from '../constants';

/**
 *  GET /users/:userAddressInCAIP/subscriptions
 */

export type UserSubscriptionsOptionsType = {
  user: string;
  env?: string;
}

export const getSubscriptions = async (
  options : UserSubscriptionsOptionsType
) => {
  const {
    user,
    env = Constants.ENV.PROD,
  } = options || {};

  const _user = getCAIPAddress(env, user, 'User');
  const API_BASE_URL = getAPIBaseUrls(env);
  const apiEndpoint = `${API_BASE_URL}/v1/users/${_user}/subscriptions`;
  const requestUrl = `${apiEndpoint}`;

  return axios.get(requestUrl)
    .then((response) => response.data?.subscriptions || [])
    .catch((err) => {
      console.error(`[EPNS-SDK] - API ${requestUrl}: `, err);
    });
}
