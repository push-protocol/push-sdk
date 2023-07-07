import axios from 'axios';
import { getAPIBaseUrls } from '../../helpers';
import Constants from '../../constants';

const ENCRYPTION_KEY = 'turnserveradmin';

export const getIceServerConfig = async (env = Constants.ENV.PROD) => {
  const API_BASE_URL = getAPIBaseUrls(env);
  const apiEndpoint = `${API_BASE_URL}/v1/turnserver/iceconfig`;
  const { data: encryptedData } = await axios.get(apiEndpoint);
  const decryptedData = CryptoJS.AES.decrypt(
    encryptedData,
    ENCRYPTION_KEY
  ).toString(CryptoJS.enc.Utf8);

  console.log('encryptedData', encryptedData, 'decryptedData', decryptedData);

  return decryptedData;
};
