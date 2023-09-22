import axios from 'axios';
import { getAPIBaseUrls, isValidETHAddress } from '../helpers';
import Constants, { MessageType, ENV } from '../constants';
import { ChatSendOptionsType, MessageWithCID, SignerType } from '../types';
import {
  getAccountAddress,
  getConnectedUserV2,
  getUserDID,
  getWallet,
} from './helpers';
import { conversationHash } from './conversationHash';
import { ISendMessagePayload, sendMessagePayload } from './helpers';
import { getGroup } from './getGroup';
import {
  MessageObj,
  REACTION_SYMBOL,
  ReactionMessage,
} from '../types/messageTypes';
import {
  messageObjSchema,
  metaMessageObjSchema,
  reationMessageObjSchema,
} from '../validations/messageObject';

/**
 * SENDS A PUSH CHAT MESSAGE
 */
export const send = async (
  options: ChatSendOptionsType
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
    const sender = await getConnectedUserV2(wallet, pgpPrivateKey, env);
    const receiver = await getUserDID(to, env);
    const API_BASE_URL = getAPIBaseUrls(env);
    const isGroup = isValidETHAddress(to) ? false : true;
    const group = isGroup
      ? await getGroup({
          chatId: to,
          env: env,
        })
      : null;

    // OVERRIDE CONTENT FOR REACTION MESSAGE
    if (messageType === MessageType.REACTION) {
      messageObj.content =
        REACTION_SYMBOL[(messageObj as Omit<ReactionMessage, 'type'>).action];
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

    const body: ISendMessagePayload = await sendMessagePayload(
      receiver,
      sender,
      messageObj,
      messageContent,
      messageType,
      group,
      env
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

  const isGroup = isValidETHAddress(to) ? false : true;
  if (isGroup) {
    const group = await getGroup({
      chatId: to,
      env: env,
    });
    if (!group) {
      throw new Error(
        `Invalid receiver. Please ensure 'receiver' is a valid DID or ChatId in case of Group.`
      );
    }
  }

  if (
    messageType === MessageType.TEXT ||
    messageType === MessageType.IMAGE ||
    messageType === MessageType.VIDEO ||
    messageType === MessageType.AUDIO ||
    messageType === MessageType.FILE ||
    messageType === MessageType.GIF ||
    messageType === MessageType.MEDIA_EMBED
  ) {
    const { error } = messageObjSchema.validate(messageObj);
    if (error) {
      throw new Error(
        `Unable to parse this messageType. Please ensure 'messageObj' is properly defined.`
      );
    }
  }

  if (messageType === MessageType.META) {
    const { error } = metaMessageObjSchema.validate(messageObj);
    if (error) {
      throw new Error(
        `Unable to parse this messageType. Please ensure 'messageObj' is properly defined.`
      );
    }
  } else if (messageType === MessageType.REACTION) {
    const { error } = reationMessageObjSchema.validate(messageObj);
    if (error) {
      throw new Error(
        `Unable to parse this messageType. Please ensure 'messageObj' is properly defined.`
      );
    }
  }
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
