import axios from 'axios';
import { IUser } from '../types';
import { isValidETHAddress, walletToPCAIP10 } from '../helpers/address';
import { getAPIBaseUrls, verifyPGPPublicKey } from '../helpers';
import Constants, { ENV } from '../constants';

export interface GetBatchType {
  userIds: string[];
  env?: ENV;
}

export const getBatch = async (options: GetBatchType): Promise<IUser> => {
  const { env = Constants.ENV.PROD, userIds } = options || {};

  const API_BASE_URL = getAPIBaseUrls(env);
  const requestUrl = `${API_BASE_URL}/v1/users/batch`;

  const MAX_USER_IDS_LENGTH = 100;
  if (userIds.length > MAX_USER_IDS_LENGTH) {
    throw new Error(
      `Too many user IDs. Maximum allowed: ${MAX_USER_IDS_LENGTH}`
    );
  }

  for (let i = 0; i < userIds.length; i++) {
    if (!isValidETHAddress(userIds[i])) {
      throw new Error(`Invalid user address!`);
    }
  }

  const pcaipUserIds = userIds.map(walletToPCAIP10);
  const requestBody = { userIds: pcaipUserIds };

  return axios
    .post(requestUrl, requestBody)
    .then((response) => {
      response.data.users.forEach((user: any, index: number) => {
        response.data.users[index].publicKey = verifyPGPPublicKey(
          user.encryptionType,
          user.publicKey,
          user.did,
          user.nftOwner
        );
      });
      return response.data;
    })
    .catch((err) => {
      console.error(`[Push SDK] - API ${requestUrl}: `, err);
      throw Error(`[Push SDK] - API ${requestUrl}: ${err}`);
    });
};
