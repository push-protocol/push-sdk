import axios from 'axios';
import { getAPIBaseUrls } from '../helpers';
import Constants from '../constants';
import { checkIfPvtKeyExists, createUserIfNecessary } from './helpers';
import { Signer } from 'ethers';

/**
 *  POST /v1/chat/request
 */

export type ChatStartOptionsType = {
  messageContent?: string;
  messageType?: 'Text' | 'Image' | 'File';
  receiverAddress: string;
  privateKey?: string;
  signer:Signer;
  env?:string;
};

export const start = async (options: ChatStartOptionsType) => {
  const {
    messageContent = '',
    messageType = 'Text',
    receiverAddress,
    signer,
    privateKey = null,
    env = Constants.ENV.PROD,
  } = options || {};

  const API_BASE_URL = getAPIBaseUrls(env);
  const apiEndpoint = `${API_BASE_URL}/v1/chat/request`;

  if(await checkIfPvtKeyExists(signer,privateKey))
  {
    return {err:"Decrypted private key required as input"};
  }
  let senderCreatedUser = await createUserIfNecessary(signer);
  // senderCreatedUser = {...senderCreatedUser,privateKey:senderCreatedUser.privateKey || privateKey};

  // const { message, encryptionType, aesEncryptedSecret, signature } =
  //   (await getEncryptedRequest(
  //     receiverAddress,
  //     { ...senderCreatedUser, privateKey },
  //     messageContent
  //   )) || {};




  // const body = {
  //   fromDID: senderAddress,
  //   toDID: receiverAddress,
  //   fromCAIP10: senderAddress,
  //   toCAIP10: receiverAddress,
  //   message,
  //   messageType,
  //   signature,
  //   encType: encryptionType,
  //   encryptedSecret: aesEncryptedSecret,
  //   sigType: signature,
  // };

  // return axios
  //   .post(requestUrl, body)
  //   .then((response) => {
  //     return response.data;
  //   })
  //   .catch((err) => {
  //     console.error(`[EPNS-SDK] - API ${requestUrl}: `, err);
  //   });
};
