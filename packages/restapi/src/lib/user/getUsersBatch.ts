import axios from 'axios';
import { AccountEnvOptionsType, IUser } from '../types';
import { isValidETHAddress, walletToPCAIP10 } from '../helpers/address';
import { getAPIBaseUrls } from '../helpers';
import Constants from '../constants';

/**
 *  POST /v1/users/batch
 */

export const getBatch = async (options: AccountEnvOptionsType, userIds: string[]): Promise<IUser> => {
  const { account, env = Constants.ENV.PROD } = options || {};
  if (!isValidETHAddress(account)) {
    throw new Error(`Invalid address!`);
  }
  const API_BASE_URL = getAPIBaseUrls(env);
  const requestUrl = `${API_BASE_URL}/v1/users/batch`;


  const MAX_USER_IDS_LENGTH = 100;
  if (userIds.length > MAX_USER_IDS_LENGTH) {
    throw new Error(`Too many user IDs. Maximum allowed: ${MAX_USER_IDS_LENGTH}`);
  }

  for (let i = 0; i < userIds.length; i++) {
        if (!isValidETHAddress(userIds[i])) {
            throw new Error(`Invalid user address!`);
        }
  }

  userIds = userIds.map(walletToPCAIP10);
  const requestBody = { userIds };

  return axios
    .post(requestUrl, requestBody)
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.error(`[EPNS-SDK] - API ${requestUrl}: `, err);
      throw Error(`[EPNS-SDK] - API ${requestUrl}: ${err}`);
    });
};
