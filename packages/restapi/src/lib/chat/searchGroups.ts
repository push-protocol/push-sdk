import { getAPIBaseUrls } from '../helpers';
import Constants, { ENV } from '../constants';
import { GroupDTO } from '../types';
import { axiosPost } from '../utils/axiosUtil';
import { handleError } from '../errors/ValidationError';

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

    const response = await axiosPost<GroupDTO[]>(requestUrl, {
      searchTerm,
      pageNumber,
      pageSize,
    });

    return response.data;
  } catch (err) {
      throw handleError(err, search.name);
  }
};
