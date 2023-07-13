import axios from 'axios';
import { getAPIBaseUrls, isValidETHAddress } from '../helpers';
import Constants from '../constants';
import { ChatSendOptionsType, MessageWithCID } from '../types';
import {
  IPGPHelper,
  PGPHelper,
  getAccountAddress,
  getConnectedUserV2Core,
  getUserDID,
  getWallet,
} from './helpers';
import { conversationHash } from './conversationHash';
import { startCore } from './start';
import { ISendMessagePayload, sendMessagePayloadCore } from './helpers';

/**
 * Send a message to an address or a group
 */
export const send = async (
  options: ChatSendOptionsType
): Promise<MessageWithCID> => {
  return await sendCore(options, PGPHelper);
};

export const sendCore = async (
  options: ChatSendOptionsType,
  pgpHelper: IPGPHelper
): Promise<MessageWithCID> => {
  const {
    messageContent = '',
    messageType = 'Text',
    receiverAddress,
    account = null,
    signer = null,
    pgpPrivateKey = null,
    apiKey = '',
    env = Constants.ENV.PROD,
  } = options || {};

  try {
    if (account == null && signer == null) {
      throw new Error(`At least one from account or signer is necessary!`);
    }

    const wallet = getWallet({ account, signer });
    const address = await getAccountAddress(wallet);

    if (!isValidETHAddress(address)) {
      throw new Error(`Invalid address!`);
    }

    let isGroup = false;
    if (!isValidETHAddress(receiverAddress)) {
      isGroup = true;
    }

    const connectedUser = await getConnectedUserV2Core(wallet, pgpPrivateKey, env, pgpHelper);
    const receiver = await getUserDID(receiverAddress, env);
    let conversationResponse: any = null;
    if (!isGroup) {
      conversationResponse = await conversationHash({
        conversationId: receiver,
        account: connectedUser.did,
        env,
      });
    }
    if (conversationResponse && !conversationResponse?.threadHash) {
      return startCore({
          messageContent: messageContent,
          messageType: messageType,
          receiverAddress: receiver,
          connectedUser,
          apiKey,
          env,
        },
        pgpHelper,
      );
    } else {
      const API_BASE_URL = getAPIBaseUrls(env);
      const apiEndpoint = `${API_BASE_URL}/v1/chat/message`;
      const body: ISendMessagePayload = await sendMessagePayloadCore(
        receiver,
        connectedUser,
        messageContent,
        messageType,
        env,
        pgpHelper,
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
    console.error(`[Push SDK] - API  - Error - API ${send.name} -:  `, err);
    throw Error(`[Push SDK] - API  - Error - API ${send.name} -: ${err}`);
  }
};
