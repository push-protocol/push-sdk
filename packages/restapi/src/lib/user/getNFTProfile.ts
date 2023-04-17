import axios from 'axios';
import { IUser } from '../types';
import { getAPIBaseUrls, verifyPGPPublicKey } from '../helpers';
import Constants, { ENV } from '../constants';

export type getNFTProfile = {
  env?: ENV;
  nftChainId: number;
  nftTokenId: number;
  nftContractAddress: string;
};

export const getNFTProfile = async (options: getNFTProfile): Promise<IUser> => {
  const {
    nftContractAddress,
    nftTokenId,
    nftChainId,
    env = Constants.ENV.PROD,
  } = options || {};

  const caip10 = `eip155:${nftChainId}:${nftContractAddress}:nft:${nftTokenId}`;
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
