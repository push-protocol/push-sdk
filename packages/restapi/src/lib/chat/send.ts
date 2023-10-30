import axios from 'axios';
import { getAPIBaseUrls, isValidETHAddress } from '../helpers';
import Constants, { MessageType, ENV } from '../constants';
import { ChatSendOptionsType, MessageWithCID, SignerType } from '../types';
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
import { MessageObj } from '../types/messageTypes';
import { validateMessageObj } from '../validations/messageObject';

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
  try {
    /**
     * Compute Input Options
     * 1. Provides the options object with default values
     * 2. Takes care of deprecated fields
     */
    const computedOptions = computeOptions(options);
    const { messageType, messageObj, account, to, signer, pgpPrivateKey, env } =
      computedOptions;
    /**
     * Validate Input Options
     */
    await validateOptions(computedOptions);

    const wallet = getWallet({ account, signer });
    const sender = await getConnectedUserV2Core(
      wallet,
      pgpPrivateKey,
      env,
      pgpHelper
    );
    const receiver = await getUserDID(to, env);
    const API_BASE_URL = getAPIBaseUrls(env);
    const isGroup = isValidETHAddress(to) ? false : true;

    const group = isGroup
      ? await getGroup({
          chatId: to,
          env: env,
        })
      : null;

    // Not supported by legacy sdk versions, need to override messageContent to avoid parsing errors on legacy sdk versions
    let messageContent: string;
    if (
      messageType === MessageType.REPLY ||
      messageType === MessageType.COMPOSITE
    ) {
      messageContent =
        'MessageType Not Supported by this sdk version. Plz upgrade !!!';
    } else {
      messageContent = messageObj.content as string;
    }

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

type ComputedOptionsType = {
  messageType: MessageType;
  messageObj: MessageObj;
  account: string | null;
  to: string;
  signer: SignerType | null;
  pgpPrivateKey: string | null;
  env: ENV;
};

const validateOptions = async (options: ComputedOptionsType) => {
  const { messageType, messageObj, account, to, signer, pgpPrivateKey, env } =
    options;

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

  validateMessageObj(messageObj, messageType);
};

const computeOptions = (options: ChatSendOptionsType): ComputedOptionsType => {
  const messageType =
    options.message?.type !== undefined
      ? options.message.type
      : options.messageType ?? 'Text';

  let messageObj: any = options.message;
  if (messageObj === undefined) {
    if (
      options.messageObj === undefined &&
      ![
        MessageType.TEXT,
        MessageType.IMAGE,
        MessageType.FILE,
        MessageType.MEDIA_EMBED,
        MessageType.GIF,
      ].includes(messageType as MessageType)
    ) {
      throw new Error('Options.message is required');
    } else {
      messageObj =
        options.messageObj !== undefined
          ? options.messageObj
          : {
              content: options.messageContent ?? '',
            };
    }
  } else {
    // Remove the 'type' property from messageObj
    const { type, ...rest } = messageObj;
    messageObj = rest;
  }

  // Parse Reply Message
  if (messageType === MessageType.REPLY) {
    if (typeof messageObj.content === 'object') {
      const { type, ...rest } = messageObj.content;
      messageObj.content = {
        messageType: type,
        messageObj: rest,
      };
    } else {
      throw new Error('Options.message is not properly defined for Reply');
    }
  }

  // Parse Composite Message
  if (messageType === MessageType.COMPOSITE) {
    if (messageObj.content instanceof Array) {
      messageObj.content = messageObj.content.map(
        (obj: { type: string; content: string }) => {
          const { type, ...rest } = obj;
          return {
            messageType: type,
            messageObj: rest,
          };
        }
      );
    } else {
      throw new Error('Options.message is not properly defined for Composite');
    }
  }

  const account = options.account !== undefined ? options.account : null;

  const to = options.to !== undefined ? options.to : options.receiverAddress;
  if (to === undefined) {
    throw new Error('Options.to is required');
  }

  const signer = options.signer !== undefined ? options.signer : null;

  const pgpPrivateKey =
    options.pgpPrivateKey !== undefined ? options.pgpPrivateKey : null;

  const env = options.env !== undefined ? options.env : Constants.ENV.PROD;

  return {
    messageType: messageType as MessageType,
    messageObj: messageObj as MessageObj,
    account: account,
    to: to,
    signer: signer,
    pgpPrivateKey: pgpPrivateKey,
    env: env,
  };
};
