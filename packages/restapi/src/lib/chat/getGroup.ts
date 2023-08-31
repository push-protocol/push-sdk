import axios from 'axios';
import { getAPIBaseUrls } from '../helpers';
import Constants, { ENV } from '../constants';
import { GroupDTO } from '../types';

/**
 *  GET /v1/chat/groups/:chatId
 */

export interface GetGroupType {
  chatId: string;
  env?: ENV;
  page?: number;
  limit?: number;
}

export const getGroup = async (options: GetGroupType): Promise<GroupDTO> => {
  const {
    chatId,
    env = Constants.ENV.PROD,
    page = 1,
    limit = 30,
  } = options || {};
  try {
    if (chatId == null || chatId.length == 0) {
      throw new Error(`chatId cannot be null or empty`);
    }

    const API_BASE_URL = getAPIBaseUrls(env);
    const requestUrl = `${API_BASE_URL}/v1/chat/groups/${chatId}?page=${page}&limit=${limit}`;
    return axios
      .get(requestUrl)
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        if (err?.response?.data) throw new Error(err?.response?.data);
        throw new Error(err);
      });
  } catch (err) {
    console.error(`[Push SDK] - API  - Error - API ${getGroup.name} -:  `, err);
    throw Error(`[Push SDK] - API  - Error - API ${getGroup.name} -: ${err}`);
  }
};
