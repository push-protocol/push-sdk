import axios from 'axios';
import { decryptWithWalletRPCMethod, getAPIBaseUrls, walletToPCAIP10 } from '../helpers';
import Constants from '../constants';
import { checkIfPvtKeyExists, createUserIfNecessary,getEncryptedRequest } from './helpers';


/**
 *  POST /v1/chat/request
 */

export type ChatStartOptionsType = {
  messageContent?: string;
  messageType?: 'Text' | 'Image' | 'File';
  receiverAddress: string;
  privateKey?: string;
  account:string;
  env?:string;
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

  

  if(await checkIfPvtKeyExists(account,privateKey))
  {
    throw new Error("Decrypted private key required as input");
  }
  let senderCreatedUser = await createUserIfNecessary(account);
  const decryptedPrivateKey = await decryptWithWalletRPCMethod(
    senderCreatedUser.encryptedPrivateKey,
    account
  );
  const { message, encryptionType, aesEncryptedSecret, signature } =
    (await getEncryptedRequest(
      receiverAddress,
      { ...senderCreatedUser,privateKey: privateKey || decryptedPrivateKey },
      messageContent
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
