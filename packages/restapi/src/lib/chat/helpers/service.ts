import axios from 'axios';
import Constants from '../../constants';
import { generateHash, getAPIBaseUrls, getConfig, getDomainInformation, getQueryParams, getSigner, getTypeInformation, pCAIP10ToWallet, signMessage, walletToPCAIP10 } from '../../helpers';
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

  var data = {
    caip10: walletToPCAIP10(user),
    did: walletToPCAIP10(user),
    publicKey,
    encryptedPrivateKey,
    encryptionType
  };

  const hash = generateHash(data);
  const signer = getSigner(pCAIP10ToWallet(user));
  console.log(signer);
  
  // get domain information
  // const chainId = parseInt(channelCAIPDetails.networkId, 10);
  // const { EPNS_COMMUNICATOR_CONTRACT } = getConfig(env, channelCAIPDetails);
  // const domainInformation = getDomainInformation(
  //   chainId,
  //   verifyingContractAddress || EPNS_COMMUNICATOR_CONTRACT
  // );

  // get type information
  const typeInformation = getTypeInformation("Create_user");
  const signedMessage = await signer._signTypedData(
    // domainInformation,
    typeInformation,
    hash
  );

  const body = {...data, signature:signedMessage,sigType};
  
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