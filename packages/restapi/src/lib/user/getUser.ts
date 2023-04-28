import axios from 'axios';
import { AccountEnvOptionsType, IUser } from '../types';
import { isValidETHAddress, walletToPCAIP10 } from '../helpers/address';
import { getAPIBaseUrls, verifyPGPPublicKey } from '../helpers';
import Constants from '../constants';

export const get = async (options: AccountEnvOptionsType): Promise<IUser> => {
  const { account, env = Constants.ENV.PROD } = options || {};
  if (!isValidETHAddress(account)) {
    throw new Error(`Invalid address!`);
  }
  const caip10 = walletToPCAIP10(account);
  const API_BASE_URL = getAPIBaseUrls(env);
  const requestUrl = `${API_BASE_URL}/v1/users/?caip10=${caip10}`;
  return axios
    .get(requestUrl)
    .then((response) => {
      if (response.data)
        response.data.publicKey = verifyPGPPublicKey(
          response.data.encryptionType,
          response.data.publicKey,
          response.data.did,
          response.data.nftOwner
        );
      return response.data;
    })
    .catch((err) => {
      console.error(`[Push SDK] - API ${requestUrl}: `, err);
      throw Error(`[Push SDK] - API ${requestUrl}: ${err}`);
    });
};
