import axios from 'axios';
import { getAPIBaseUrls, isValidETHAddress } from '../helpers';
import Constants from '../constants';
import { ChatSendOptionsType, MessageWithCID } from '../types';
import {
  getAccountAddress,
  getConnectedUserV2,
  getUserDID,
  getWallet,
} from './helpers';
import { conversationHash } from './conversationHash';
import { start } from './start';
import { ISendMessagePayload, sendMessagePayload } from './helpers';

/**
 * Send a message to an address, nft or a group
 */
export const send = async (
  options: ChatSendOptionsType
): Promise<MessageWithCID> => {
  const {
    messageObj = null,
    messageContent = '',
    messageType = 'Text',
    receiverAddress,
    account = null,
    signer = null,
    pgpPrivateKey = null,
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

    //these need to be backward compatible
    const currentAllowedTypes = ['Text', 'Image', 'File', 'GIF', 'MediaEmbed'];
    let updatedMessageContent = messageContent;
    if (messageObj) {
      updatedMessageContent = messageObj.message;
    }
    if (!currentAllowedTypes.includes(messageType)) {
      updatedMessageContent =
        'MessageType Not Supported by this sdk version. Plz upgrade !!!';
    }

    const connectedUser = await getConnectedUserV2(wallet, pgpPrivateKey, env);
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
      return start({
        messageObj,
        messageContent: updatedMessageContent,
        messageType,
        receiverAddress: receiver,
        connectedUser,
        env,
      });
    } else {
      const API_BASE_URL = getAPIBaseUrls(env);
      const apiEndpoint = `${API_BASE_URL}/v1/chat/message`;
      const body: ISendMessagePayload = await sendMessagePayload(
        receiver,
        connectedUser,
        messageObj,
        updatedMessageContent,
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
    console.error(`[Push SDK] - API  - Error - API ${send.name} -:  `, err);
    throw Error(`[Push SDK] - API  - Error - API ${send.name} -: ${err}`);
  }
};
