import { getAPIBaseUrls } from '../helpers';
import Constants, { ENV } from '../constants';
import { GroupDTO } from '../types';
import { axiosGet } from '../utils/axiosUtil';
import { handleError } from '../errors/ValidationError';

/**
 *  GET /v1/chat/groups/:chatId
 */

export interface GetGroupType {
  chatId: string;
  env?: ENV;
}

export const getGroup = async (options: GetGroupType): Promise<GroupDTO> => {
  const { chatId, env = Constants.ENV.PROD } = options || {};
  try {
    if (chatId == null || chatId.length == 0) {
      throw new Error(`chatId cannot be null or empty`);
    }

    const API_BASE_URL = getAPIBaseUrls(env);
    const requestUrl = `${API_BASE_URL}/v1/chat/groups/${chatId}`;
    const response = await axiosGet<GroupDTO>(requestUrl);
    return response.data;
  } catch (err) {
    throw handleError(err, getGroup.name);
  }
};
