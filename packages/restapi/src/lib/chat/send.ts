import axios from 'axios';
import { getAPIBaseUrls, isValidETHAddress } from '../helpers';
import Constants from '../constants';
import { ChatOptionsType } from '../types';
import { getConnectedUser } from './helpers';
import { conversationHash } from './conversationHash';
import { start } from './start';
import { ISendMessagePayload, sendMessagePayload } from './helpers';

/**
 *  POST /v1/chat/message
 */

export const send = async (options: Omit<ChatOptionsType, 'connectedUser'>) => {
  const {
    messageContent = '',
    messageType = 'Text',
    receiverAddress,
    account,
    pgpPrivateKey = null,
    apiKey = '',
    env = Constants.ENV.PROD,
  } = options || {};

  try {
    if (!isValidETHAddress(account)) {
      throw new Error(`Invalid address!`);
    }

    let isGroup = false;
    if (!isValidETHAddress(receiverAddress)) {
        isGroup = true;
    }
    
    const connectedUser = await getConnectedUser(account, pgpPrivateKey, env);
    let conversationResponse: any = null;
    if (!isGroup) {
      conversationResponse = await conversationHash({
        conversationId: receiverAddress,
        account,
        env,
      });
    }
    if (conversationResponse && !conversationResponse?.threadHash) {
      return start({
        messageContent: messageContent,
        messageType: 'Text',
        receiverAddress,
        connectedUser,
        apiKey,
        env,
      });
    } else {
      const API_BASE_URL = getAPIBaseUrls(env);
      const apiEndpoint = `${API_BASE_URL}/v1/chat/message`;
      const body: ISendMessagePayload = await sendMessagePayload(
        receiverAddress,
        connectedUser,
        messageContent,
        messageType,
        env
      );

      return axios
        .post(apiEndpoint, body)
        .then((response) => {
          return response.data;
        })
        .catch((err) => {
          throw new Error(err);
        });
    }
  } catch (err) {
    console.error(`[EPNS-SDK] - API  - Error - API send() -:  `, err);
    throw Error(`[EPNS-SDK] - API  - Error - API send() -: ${err}`);
  }
};
