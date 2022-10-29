import axios from 'axios';
import { decryptWithWalletRPCMethod, getAPIBaseUrls, walletToPCAIP10 } from '../helpers';
import Constants from '../constants';
import { checkIfPvtKeyExists, createUserIfNecessary,getEncryptedRequest } from './helpers';
import { AccountEnvOptionsType } from '../types';


/**
 *  POST /v1/chat/request
 */

export interface ChatStartOptionsType extends AccountEnvOptionsType {
  messageContent?: string;
  messageType?: 'Text' | 'Image' | 'File';
  receiverAddress: string;
  privateKey?: string;
};

export const start = async (options: ChatStartOptionsType) => {
  const {
    messageContent = '',
    messageType = 'Text',
    receiverAddress,
    account,
    privateKey = null,
    env = Constants.ENV.PROD,
  } = options || {};

  

  if(await checkIfPvtKeyExists(account,privateKey,env))
  {
    throw new Error("Decrypted private key required as input");
  }
  const senderCreatedUser = await createUserIfNecessary({account:account,env:env});
  const decryptedPrivateKey = await decryptWithWalletRPCMethod(
    senderCreatedUser.encryptedPrivateKey,
    account
  );
  const { message, encryptionType, aesEncryptedSecret, signature } =
    (await getEncryptedRequest(
      receiverAddress,
      { ...senderCreatedUser,privateKey: privateKey || decryptedPrivateKey },
      messageContent,
      env
    )) || {};


    const API_BASE_URL = getAPIBaseUrls(env);
    const apiEndpoint = `${API_BASE_URL}/v1/chat/request`;

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
      throw new Error(err);
    });
};
