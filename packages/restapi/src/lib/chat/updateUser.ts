import axios from 'axios';
import { getAPIBaseUrls } from '../helpers';
import Constants from '../constants';

export type ChatUpdateUserOptionsType = {
  user: string;
  profilePictureCID?: string;
  name?: string;
  env?: string;
}

export const updateUser = async (
  options: ChatUpdateUserOptionsType
) => {
  const {
    user,
    profilePictureCID = '',
    name = '',
    env = Constants.ENV.PROD,
  } = options || {};

  const API_BASE_URL = getAPIBaseUrls(env);
  const apiEndpoint = `${API_BASE_URL}/v1/w2w/users/${user}`;
  const body = {
    caip10: user,
    profilePictureCID,
    name,
  };

  return axios.put(apiEndpoint, body)
    .catch((err) => {
      console.error(`[Push SDK] - API ${updateUser.name}: `, err);
      throw Error(`[Push SDK] - API ${updateUser.name}: ${err}`);
    });
}
