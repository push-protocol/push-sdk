import { getAPIBaseUrls } from '../../helpers';
import Constants from '../../constants';
import * as CryptoJS from 'crypto-js';
import { axiosGet } from '../../utils/axiosUtil';

const ENCRYPTION_KEY = 'turnserversecret';

export const getIceServerConfig = async (env = Constants.ENV.PROD) => {
  const API_BASE_URL = getAPIBaseUrls(env);
  const apiEndpoint = `${API_BASE_URL}/v1/turnserver/iceconfig`;
  const { data: encryptedData } = await axiosGet(apiEndpoint);

  const { config: decryptedData } = JSON.parse(
    CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY).toString(
      CryptoJS.enc.Utf8
    )
  );

  return decryptedData;
};
