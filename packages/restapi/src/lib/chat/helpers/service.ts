import axios from 'axios';
import Constants from '../../constants';
import { getAPIBaseUrls, getQueryParams, walletToPCAIP10 } from '../../helpers';
import { AccountEnvOptionsType, ConversationHashOptionsType } from '../../types';

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
    caip10: walletToPCAIP10(user),
    did: walletToPCAIP10(user),
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
      throw Error(`[EPNS-SDK] - API ${requestUrl}: ${err}`);
    });
};

export const getConversationHashService = async (options: ConversationHashOptionsType):Promise<string> => {
  const {
    conversationId,
    account,
    env = Constants.ENV.PROD,
  } = options || {};

  const API_BASE_URL = getAPIBaseUrls(env);

  const requestUrl = `${API_BASE_URL}/v1/chat/users/${walletToPCAIP10(account)}/conversations/${walletToPCAIP10(conversationId)}/hash`;

  return axios
    .get(requestUrl)
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      throw new Error(err);
    });
};

export interface GetMessagesOptionsType extends Omit<AccountEnvOptionsType, "account"> {
  threadhash: string;
  limit: number;
}

export const getMessagesService = async (options: GetMessagesOptionsType) => {
  const {
    threadhash,
    limit,
    env = Constants.ENV.PROD,
  } = options || {};

  const API_BASE_URL = getAPIBaseUrls(env);
  const apiEndpoint = `${API_BASE_URL}/v1/chat/conversationhash/${threadhash}`;
  const queryObj = {
    fetchLimit: limit,
  };

  const requestUrl = `${apiEndpoint}?${getQueryParams(queryObj)}`;

  return axios
    .get(requestUrl)
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      throw new Error(err);
    });
};