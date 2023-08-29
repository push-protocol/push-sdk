import axios from 'axios';
import { getAPIBaseUrls } from '../helpers';
import Constants, { ENV } from '../constants';
import { GroupDTO } from '../types';

/**
 *  POST /v1/chat/groups/search
 */

export interface SearchGroupsType {
  searchTerm: string;
  pageNumber: number;
  pageSize: number;
  env?: ENV;
}

export const search = async (
  options: SearchGroupsType
): Promise<GroupDTO[]> => {
  const {
    searchTerm,
    pageNumber,
    pageSize,
    env = Constants.ENV.PROD,
  } = options || {};

  try {
    const API_BASE_URL = getAPIBaseUrls(env);
    const requestUrl = `${API_BASE_URL}/v1/chat/groups/search`;

    return axios
      .post(requestUrl, {
        searchTerm,
        pageNumber,
        pageSize,
      })
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        if (err?.response?.data) {
          throw new Error(err?.response?.data);
        }
        throw new Error(err);
      });
  } catch (err) {
    console.error(`[Push SDK] - API  - Error - API ${search.name} -:  `, err);
    throw Error(`[Push SDK] - API  - Error - API ${search.name} -: ${err}`);
  }
};
