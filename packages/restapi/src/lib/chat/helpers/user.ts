import axios from 'axios';
import { Signer } from 'ethers';
import Constants from '../../constants';
import { get, create } from '../../user';
import { getAPIBaseUrls } from '../../helpers';
import { AccountEnvOptionsType, IUser } from '../../types';

const checkConnectedUser = (connectedUser: IUser): boolean => {
  if (
    !(
      connectedUser.allowedNumMsg === 0 &&
      connectedUser.numMsg === 0 &&
      connectedUser.about === '' &&
      connectedUser.signature === '' &&
      connectedUser.encryptedPrivateKey === '' &&
      connectedUser.publicKey === ''
    )
  ) {
    return true;
  } else return false;
};

export const createUserIfNecessary = async (
  options: AccountEnvOptionsType
): Promise<IUser> => {
  const { account, env = Constants.ENV.PROD } = options || {};
  const connectedUser = await get({ account: account, env });
  if (!checkConnectedUser(connectedUser)) {
    const createdUser: IUser = await create({ account: account, env });
    return createdUser;
  } else {
    return connectedUser;
  }
};

export const checkIfPvtKeyExists = async (
  account: string,
  privateKey: string | null,
  env: string
): Promise<boolean> => {
  const user = await get({ account: account, env: env || Constants.ENV.PROD });
  if (user.encryptedPrivateKey && !privateKey) {
    return true;
  }
  return false;
};

type CreateUserOptionsType = {
  user: string;
  publicKey?: string;
  encryptedPrivateKey?: string;
  encryptionType?: string;
  signature?: string;
  sigType?: string;
  env?: string;
};

export const createUserService = async (options: CreateUserOptionsType) => {
  const {
    user,
    publicKey = '',
    encryptedPrivateKey = '',
    encryptionType = '',
    signature = '',
    sigType = '',
    env = Constants.ENV.PROD,
  } = options || {};

  const API_BASE_URL = getAPIBaseUrls(env);

  const requestUrl = `${API_BASE_URL}/v1/users/`;

  const body = {
    caip10: user,
    did: user,
    publicKey,
    encryptedPrivateKey,
    encryptionType,
    signature,
    sigType,
  };

  return axios
    .post(requestUrl, body)
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.error(`[EPNS-SDK] - API ${requestUrl}: `, err);
    });
};
