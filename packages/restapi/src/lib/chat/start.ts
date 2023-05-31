import axios from 'axios';
import { getAPIBaseUrls } from '../helpers';
import Constants from '../constants';
import { ChatOptionsType, MessageWithCID } from '../types';
import { ISendMessagePayload, sendMessagePayload, sign } from './helpers';
import * as CryptoJS from 'crypto-js';

export const start = async (
  options: Omit<ChatOptionsType, 'account'>
): Promise<MessageWithCID> => {
  const {
    messageContent = '',
    messageType = 'Text',
    receiverAddress,
    connectedUser,
    apiKey = '',
    env = Constants.ENV.PROD,
  } = options || {};

  const API_BASE_URL = getAPIBaseUrls(env);
  const apiEndpoint = `${API_BASE_URL}/v1/chat/request`;

  const body: ISendMessagePayload = await sendMessagePayload(
    receiverAddress,
    connectedUser,
    messageContent,
    messageType,
    env
  );

  const bodyToBeHashed = {
    fromDID: body.fromDID,
    toDID: body.toDID,
    messageContent: body.messageContent,
    messageType: messageType,
  };

  const hash = CryptoJS.SHA256(JSON.stringify(bodyToBeHashed)).toString();
  const signature: string = await sign({
    message: hash,
    signingKey: connectedUser.privateKey!,
  });
  const sigType = 'pgp';

  const verificationProof: string = sigType + ':' + signature;
  body.verificationProof = verificationProof;

  return axios
    .post(apiEndpoint, body)
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      throw new Error(err);
    });
};
