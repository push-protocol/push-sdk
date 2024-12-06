import {
  convertToValidDID,
  getAPIBaseUrls,
  isValidPushCAIP,
  walletToPCAIP10,
} from '../helpers';
import Constants, { MessageType, ENV } from '../constants';
import { ChatSendOptionsType, MessageWithCID, SignerType } from '../types';
import {
  IPGPHelper,
  PGPHelper,
  getAccountAddress,
  getConnectedUserV2Core,
  getConnectedUserV3Core,
  getWallet,
  sendMessagePayloadCoreV2,
} from './helpers';
import { conversationHash, conversationHashV2 } from './conversationHash';
import { ISendMessagePayload, sendMessagePayloadCore } from './helpers';
import { MessageObj } from '../types/messageTypes';
import { validateMessageObj } from '../validations/messageObject';
import { axiosPost } from '../utils/axiosUtil';
import { getGroupInfo } from './getGroupInfo';
import { handleError } from '../errors/validationError';
import * as PUSH_CHAT from '../chat';

/**
 * SENDS A PUSH CHAT MESSAGE
 */
export const send = async (
  options: ChatSendOptionsType
): Promise<MessageWithCID> => {
  if (!options.perChain) {
    return await sendCore(options, PGPHelper);
  } else {
    return await sendCoreV2(options, PGPHelper);
  }
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
    const {
      messageType,
      messageObj,
      account,
      signer,
      pgpPrivateKey,
      env,
      chainId,
    } = computedOptions;
    let { to } = computedOptions;
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
    let receiver = await convertToValidDID(to, env);
    const API_BASE_URL = getAPIBaseUrls(env);

    const isChatId = isValidPushCAIP(to) ? false : true;
    let isGroup = false;
    let group = null;

    if (isChatId) {
      const request: PUSH_CHAT.GetChatInfoType = {
        recipient: to,
        account: account!,
        env: env,
      };

      const chatInfo = await PUSH_CHAT.getChatInfo(request);
      isGroup = chatInfo?.meta?.group ?? false;

      group = isGroup
        ? await getGroupInfo({
            chatId: to,
            env: env,
          })
        : null;

      if (!isGroup) {
        const participants = chatInfo.participants ?? [];
        // Find the participant that is not the account being used
        const messageSentTo = participants.find(
          (participant) => participant !== walletToPCAIP10(account!)
        );
        to = messageSentTo!;
        receiver = to;
      }
    }

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
      pgpHelper,
      chainId!
    );

    const response = await axiosPost<MessageWithCID>(apiEndpoint, body);
    return response.data;
  } catch (err) {
    throw handleError(err, send.name);
  }
};

export const sendCoreV2 = async (
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
    const {
      messageType,
      messageObj,
      account,
      signer,
      pgpPrivateKey,
      env,
      chainId,
    } = computedOptions;
    let { to } = computedOptions;
    /**
     * Validate Input Options
     */
    await validateOptions(computedOptions);

    const wallet = getWallet({ account, signer });

    const sender = await getConnectedUserV3Core(
      wallet,
      pgpPrivateKey,
      env,
      pgpHelper
    );

    let receiver = await convertToValidDID(to, env);

    const API_BASE_URL = getAPIBaseUrls(env);

    const isChatId = isValidPushCAIP(to) ? false : true;
    let isGroup = false;
    let group = null;

    if (isChatId) {
      const request: PUSH_CHAT.GetChatInfoType = {
        recipient: to,
        account: account!,
        env: env,
      };

      const chatInfo = await PUSH_CHAT.getChatInfo(request);
      isGroup = chatInfo?.meta?.group ?? false;

      group = isGroup
        ? await getGroupInfo({
            chatId: to,
            env: env,
          })
        : null;

      if (!isGroup) {
        const participants = chatInfo.participants ?? [];
        // Find the participant that is not the account being used
        const messageSentTo = participants.find(
          (participant) => participant !== walletToPCAIP10(account!)
        );
        to = messageSentTo!;
        receiver = to;
      }
    }

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

    const conversationResponse = await conversationHashV2({
      conversationId: receiver,
      account: sender.did,
      env,
      chainId: chainId!,
    });

    let apiEndpoint: string;
    if (!isGroup && conversationResponse && !conversationResponse?.threadHash) {
      apiEndpoint = `${API_BASE_URL}/v2/chat/request`;
    } else {
      apiEndpoint = `${API_BASE_URL}/v2/chat/message`;
    }

    const body: ISendMessagePayload = await sendMessagePayloadCoreV2(
      receiver,
      sender,
      messageObj,
      messageContent,
      messageType,
      group,
      env,
      pgpHelper,
      options.chainId!
    );

    const response = await axiosPost<MessageWithCID>(apiEndpoint, body);
    return response.data;
  } catch (err) {
    throw handleError(err, send.name);
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
  chainId: string | null;
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
  if (!isValidPushCAIP(address)) {
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
    chainId: options.chainId!,
  };
};
