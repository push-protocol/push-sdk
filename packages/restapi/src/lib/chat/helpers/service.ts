import axios from 'axios';
import Constants, {ENV} from '../../constants';
import { generateHash, getAPIBaseUrls, getQueryParams, walletToPCAIP10 } from '../../helpers';
import { AccountEnvOptionsType, ConversationHashOptionsType, walletType } from '../../types';
import { getSignature } from './crypto';

type CreateUserOptionsType = {
  user: string;
  wallet?: walletType;
  publicKey?: string;
  encryptedPrivateKey?: string;
  encryptionType?: string;
  signature?: string;
  sigType?: string;
  env?:  ENV;
};

export const createUserService = async (options: CreateUserOptionsType) => {
  const {
    user,
    wallet,
    publicKey = '',
    encryptedPrivateKey = '',
    encryptionType = '',
    env = Constants.ENV.PROD,
  } = options || {};

  const API_BASE_URL = getAPIBaseUrls(env);

  const requestUrl = `${API_BASE_URL}/v1/users/`;

  const data = {
    caip10: walletToPCAIP10(user),
    did: walletToPCAIP10(user),
    publicKey,
    encryptedPrivateKey,
    encryptionType,
    name: "",
    encryptedPassword: null,
    nftOwner: null
  };

  const hash = generateHash(data);

  const signatureObj = await getSignature(user, wallet!, hash);

  const body = {
    ...data, 
    ...signatureObj,
  };

  return axios
    .post(requestUrl, body)
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.error(`[Push SDK] - API ${requestUrl}: `, err);
      throw Error(`[Push SDK] - API ${requestUrl}: ${err}`);
    });
};

export const getConversationHashService = async (options: ConversationHashOptionsType): Promise<string> => {
  const {
    conversationId,
    account,
    env = Constants.ENV.PROD,
  } = options || {};

  const API_BASE_URL = getAPIBaseUrls(env);

  const requestUrl = `${API_BASE_URL}/v1/chat/users/${walletToPCAIP10(account)}/conversations/${conversationId}/hash`;

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