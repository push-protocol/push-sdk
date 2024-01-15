import { AccountEnvOptionsType, GroupDTO } from '../../types';
import { getAPIBaseUrls } from '../../helpers';
import Constants from '../../constants';
import { axiosGet } from '../../utils/axiosUtil';

/**
 *  GET /v1/chat/groups/<chatId>
 */

export const getGroup = async (options: AccountEnvOptionsType, chatId: string): Promise<GroupDTO> => {
  const { env = Constants.ENV.PROD } = options || {};
  const API_BASE_URL = getAPIBaseUrls(env);
  const requestUrl = `${API_BASE_URL}/v1/chat/groups/${chatId}`;
  return axiosGet(requestUrl)
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.error(`[Push SDK] - API ${requestUrl}: `, err);
      throw Error(`[Push SDK] - API ${requestUrl}: ${err}`);
    });
};
