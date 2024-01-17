import { getAPIBaseUrls } from '../helpers';
import Constants, { ENV } from '../constants';
import { SpaceDTO } from '../types';
import { axiosPost } from '../utils/axiosUtil';

/**
 *  POST /v1/spaces/search
 */

export interface SearchSpacesType {
  searchTerm: string;
  pageNumber: number;
  pageSize: number;
  env?: ENV;
}

export const search = async (
  options: SearchSpacesType
): Promise<SpaceDTO[]> => {
  const {
    searchTerm,
    pageNumber,
    pageSize,
    env = Constants.ENV.PROD,
  } = options || {};

  try {
    const API_BASE_URL = getAPIBaseUrls(env);
    const requestUrl = `${API_BASE_URL}/v1/spaces/search`;

    return axiosPost(requestUrl, {
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
