import axios from 'axios';
import { getAPIBaseUrls } from '../../helpers';
import Constants from '../../constants';

export const getIceServerConfig = async (env = Constants.ENV.PROD) => {
  const API_BASE_URL = getAPIBaseUrls(env);
  const apiEndpoint = `${API_BASE_URL}/v1/turnserver/iceconfig`;
  const { data } = await axios.get(apiEndpoint);
  return data;
};
