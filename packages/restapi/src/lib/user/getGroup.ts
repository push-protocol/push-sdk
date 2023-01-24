import axios from 'axios';
import { AccountEnvOptionsType, IGroup } from '../types';
import { getAPIBaseUrls } from '../helpers';
import Constants from '../constants';

/**
 *  GET /v1/chat/groups/<chatId>
 */

export const getGroup = async (options: AccountEnvOptionsType, chatId: string): Promise<IGroup> => {
  const {env = Constants.ENV.PROD } = options || {};
  const API_BASE_URL = getAPIBaseUrls(env);
  const requestUrl = `${API_BASE_URL}/v1/chat/groups/${chatId}`;
  return axios
    .get(requestUrl)
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.error(`[EPNS-SDK] - API ${requestUrl}: `, err);
      throw Error(`[EPNS-SDK] - API ${requestUrl}: ${err}`);
    });
};
