import axios from 'axios';
import { getAPIBaseUrls, isValidETHAddress } from '../helpers';
import Constants, { MessageType } from '../constants';
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
import { ISendMessagePayload, sendMessagePayloadCore } from './helpers';
import { getGroup } from './getGroup';

/**
 * SENDS A PUSH CHAT MESSAGE
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
    messageType = 'Text',
    receiverAddress,
    pgpPrivateKey = null,
    account = null,
    signer = null,
    env = Constants.ENV.PROD,
  } = options || {};

  try {
    await validateOptions(options);

    const wallet = getWallet({ account, signer });
    const sender = await getConnectedUserV2Core(wallet, pgpPrivateKey, env, pgpHelper);
    const receiver = await getUserDID(receiverAddress, env);
    const API_BASE_URL = getAPIBaseUrls(env);
    const isGroup = isValidETHAddress(receiverAddress) ? false : true;
    const group = isGroup
      ? await getGroup({
          chatId: receiverAddress,
          env: env,
        })
      : null;

    let messageObj = options.messageObj;
    // possible for initial types 'Text', 'Image', 'File', 'GIF', 'MediaEmbed'
    if (!messageObj) {
      messageObj = {
        content: options.messageContent ? options.messageContent : '',
      };
    }
    const messageContent = messageObj.content; // provide backward compatibility & override deprecated field

    const conversationResponse = await conversationHash({
      conversationId: receiver,
      account: sender.did,
      env,
    });

    let apiEndpoint: string;
    if (!isGroup && conversationResponse && !conversationResponse?.threadHash) {
      apiEndpoint = `${API_BASE_URL}/v1/chat/request`;
    } else {
      apiEndpoint = `${API_BASE_URL}/v1/chat/message`;
    }

    const body: ISendMessagePayload = await sendMessagePayloadCore(
      receiver,
      sender,
      messageObj,
      messageContent,
      messageType,
      group,
      env,
      pgpHelper
    );
    return (await axios.post(apiEndpoint, body)).data;
  } catch (err) {
    console.error(`[Push SDK] - API  - Error - API ${send.name} -:  `, err);
    throw Error(`[Push SDK] - API  - Error - API ${send.name} -: ${err}`);
  }
};

const validateOptions = async (options: ChatSendOptionsType) => {
  const {
    messageType = 'Text',
    messageObj,
    messageContent,
    receiverAddress,
    pgpPrivateKey = null,
    account = null,
    signer = null,
    env,
  } = options;

  if (!account && !signer) {
    throw new Error(
      `Unable to detect sender. Please ensure that either 'account' or 'signer' is properly defined.`
    );
  }

  if (!signer && !pgpPrivateKey) {
    throw new Error(
      `Unable to decrypt keys. Please ensure that either 'signer' or 'pgpPrivateKey' is properly defined.`
    );
  }

  const wallet = getWallet({ account, signer });
  const address = await getAccountAddress(wallet);
  if (!isValidETHAddress(address)) {
    throw new Error(
      `Invalid sender. Please ensure that either 'account' or 'signer' is properly defined.`
    );
  }

  const isGroup = isValidETHAddress(receiverAddress) ? false : true;
  if (isGroup) {
    const group = await getGroup({
      chatId: receiverAddress,
      env: env,
    });
    if (!group) {
      throw new Error(
        `Invalid receiver. Please ensure 'receiver' is a valid DID or ChatId in case of Group.`
      );
    }
  }

  if (messageType === MessageType.META) {
    if (
      !(messageObj instanceof Object) ||
      !(messageObj.meta instanceof Object) ||
      !('action' in messageObj.meta) ||
      !('info' in messageObj.meta) ||
      !(messageObj.meta.info.affected instanceof Array)
    ) {
      throw new Error(
        `Unable to parse this messageType. Please ensure 'messageObj' is properly defined.`
      );
    }
  } else {
    if (messageObj && messageObj.meta) {
      throw new Error(
        `Unable to parse this messageType. Meta is not allowed for this messageType.`
      );
    }
  }

  if (!pgpPrivateKey) {
    // WARNING - WALLET SIGNING POPUPS
  }
  if (messageContent) {
    // WARNING - DEPRECATED AND TO BE REMOVED IN UPCOMING MAJOR RELEASE
  }
};
