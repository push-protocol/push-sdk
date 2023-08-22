import axios from 'axios';
import { getAPIBaseUrls } from '../helpers';
import Constants, { ENV } from '../constants';

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
): Promise<any> => {
  // Replace "any" with the actual response type
  const { chatId, did, env = Constants.ENV.PROD } = options || {};
  try {
    if (chatId == null || chatId.length === 0) {
      throw new Error(`chatId cannot be null or empty`);
    }
    if (did == null || did.length === 0) {
      throw new Error(`did cannot be null or empty`);
    }

    const API_BASE_URL = getAPIBaseUrls(env);
    const requestUrl = `${API_BASE_URL}/v1/chat/groups/${chatId}/access/${did}`;
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
      `[Push SDK] - API - Error - API ${getGroupAccess.name} -:  `,
      err
    );
    throw Error(
      `[Push SDK] - API - Error - API ${getGroupAccess.name} -: ${err}`
    );
  }
};
