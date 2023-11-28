import axios from 'axios';
import Constants, { ENV } from '../../constants';
import { getAPIBaseUrls } from '../../helpers';

/**
 *  GET /v1/chat/groups/:chatId
 */

export interface GetEncryptedSecret {
  sessionKey: string;
  env?: ENV;
}

export const getEncryptedSecret = async (
  options: GetEncryptedSecret
): Promise<string> => {
  const { sessionKey, env = Constants.ENV.PROD } = options || {};
  try {
    if (sessionKey === undefined || sessionKey === null) {
      throw new Error('sessionKey is required');
    }

    const API_BASE_URL = getAPIBaseUrls(env);
    const requestUrl = `${API_BASE_URL}/v1/chat/encryptedsecret/sessionKey/${sessionKey}`;
    return axios
      .get(requestUrl)
      .then((response) => {
        return response.data.encryptedSecret;
      })
      .catch((err) => {
        if (err?.response?.data) throw new Error(err?.response?.data);
        throw new Error(err);
      });
  } catch (err) {
    console.error(
      `[Push SDK] - API  - Error - API ${getEncryptedSecret.name} -:  `,
      err
    );
    throw Error(
      `[Push SDK] - API  - Error - API ${getEncryptedSecret.name} -: ${err}`
    );
  }
};
