import axios from 'axios';
import { getAPIBaseUrls } from '../helpers';
import Constants from '../constants';
import { ChatOptionsType } from '../types';
import { ISendMessagePayload, sendMessagePayload } from './helpers';

/**
 *  POST /v1/chat/request
 */

export const start = async (options: Omit<ChatOptionsType, 'account'>) => {
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
  const headers = {
    'authorization': `Bearer ${apiKey}`,
  };
  const body: ISendMessagePayload = await sendMessagePayload(
    receiverAddress,
    connectedUser,
    messageContent,
    messageType,
    env
  );

  return axios
    .post(apiEndpoint, body, { headers })
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      throw new Error(err);
    });
};
