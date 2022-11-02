import axios from 'axios';
import { AccountEnvOptionsType, IUser } from '../types';
import { isValidETHAddress, walletToPCAIP10 } from '../helpers/address';
import { getAPIBaseUrls } from '../helpers';
import Constants from '../constants';

/**
 *  GET /v1/users/
 */

export const get = async (options: AccountEnvOptionsType): Promise<IUser> => {
  const { account, env = Constants.ENV.PROD } = options || {};
  if (!isValidETHAddress(account)) {
    throw new Error(`Invalid address!`);
  }
  const caip10 = walletToPCAIP10(account);
  const API_BASE_URL = getAPIBaseUrls(env);
  const apiEndpoint = `${API_BASE_URL}/v1/users/?caip10=${caip10}`;
  return axios
    .get(apiEndpoint)
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.error(`[EPNS-SDK] - API ${apiEndpoint}: `, err);
    });
};
