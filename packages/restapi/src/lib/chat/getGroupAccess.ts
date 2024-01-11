import { getAPIBaseUrls } from '../helpers';
import Constants, { ENV } from '../constants';
import { GroupAccess } from '../types';
import {  getUserDID } from './helpers';
import { axiosGet } from '../utils/axiosUtil';

/**
 * GET /v1/chat/groups/:chatId/access/:did
 */

export interface GetGroupAccessType {
  chatId: string;
  did: string; // Decentralized Identifier
  env?: ENV;
}

export const getGroupAccess = async (
  options: GetGroupAccessType
): Promise<GroupAccess> => {
  // Replace "any" with the actual response type
  const { chatId, did, env = Constants.ENV.PROD } = options || {};
  try {
    if (chatId == null || chatId.length === 0) {
      throw new Error(`chatId cannot be null or empty`);
    }

    if (did == null || did.length === 0) {
      throw new Error(`did cannot be null or empty`);
    }

    const user = await getUserDID(did, env);

    const API_BASE_URL = getAPIBaseUrls(env);
    const requestUrl = `${API_BASE_URL}/v1/chat/groups/${chatId}/access/${user}`;
    const response = await axiosGet<GroupAccess>(requestUrl);
    return response.data;
  } catch (err) {
    console.error(
      `[Push SDK] - API - Error - API ${getGroupAccess.name} -:  `,
      err
    );
    throw Error(
      `[Push SDK] - API - Error - API ${getGroupAccess.name} -: ${err}`
    );
  }
};
