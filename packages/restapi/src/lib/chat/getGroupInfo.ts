import axios from 'axios';
import { getAPIBaseUrls } from '../helpers';
import Constants, { ENV } from '../constants';
import { GroupDTO, GroupInfoDTO } from '../types';
import { GetGroupType } from './getGroup';

/**
 *  GET /v2/chat/groups/:chatId
 */


// TODO: Currently this is not exported from the SDK
export const getGroupInfo = async (
  options: GetGroupType
): Promise<GroupInfoDTO> => {
  const { chatId, env = Constants.ENV.PROD } = options || {};
  try {
    if (chatId == null || chatId.length == 0) {
      throw new Error(`chatId cannot be null or empty`);
    }

    const API_BASE_URL = getAPIBaseUrls(env);
    const requestUrl = `${API_BASE_URL}/v2/chat/groups/${chatId}`;
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
    console.error(
      `[Push SDK] - API  - Error - API ${getGroupInfo.name} -:  `,
      err
    );
    throw Error(
      `[Push SDK] - API  - Error - API ${getGroupInfo.name} -: ${err}`
    );
  }
};
