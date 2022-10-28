import axios from 'axios';
import { getAPIBaseUrls, isValidETHAddress, walletToPCAIP10 } from '../helpers';
import Constants from '../constants';
import { ChatStartOptionsType } from '../types';
import {
  checkIfPvtKeyExists,
  createUserIfNecessary,
  getEncryptedRequest,
} from './helpers';

/**
 *  POST /v1/chat/message
 */

export const send = async (options: ChatStartOptionsType) => {
  const {
    messageContent = '',
    messageType = 'Text',
    receiverAddress,
    account,
    privateKey = null,
    env = Constants.ENV.PROD,
  } = options || {};

  if (!isValidETHAddress(account)) {
    throw new Error(`Invalid address!`);
  }
  if (await checkIfPvtKeyExists(account, privateKey, env))
    throw new Error(`Decrypted private key required as input`);
  

  //check for chat.start or send
  let senderCreatedUser = await createUserIfNecessary({
    account: account,
    env: env,
  });
  const { message, encryptionType, aesEncryptedSecret, signature } =
    (await getEncryptedRequest(
      receiverAddress,
      { ...senderCreatedUser, privateKey },
      messageContent,
      env
    )) || {};
  const API_BASE_URL = getAPIBaseUrls(env);
  const apiEndpoint = `${API_BASE_URL}/v1/w2w/messages`;

  const requestUrl = `${apiEndpoint}`;

  const body = {
    fromDID: walletToPCAIP10(account),
    toDID: walletToPCAIP10(receiverAddress),
    fromCAIP10: walletToPCAIP10(account),
    toCAIP10: walletToPCAIP10(receiverAddress),
    message,
    messageType,
    signature,
    encType: encryptionType,
    encryptedSecret: aesEncryptedSecret,
    sigType: signature,
  };

  return axios
    .post(apiEndpoint, body)
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.error(`[EPNS-SDK] - API ${requestUrl}: `, err);
    });
};
