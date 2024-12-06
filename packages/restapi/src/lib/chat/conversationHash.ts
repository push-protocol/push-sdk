import Constants from '../constants';
import { handleError } from '../errors/validationError';
import {
  convertToValidDID,
  convertToValidDIDV2,
  isValidPushCAIP,
} from '../helpers';
import { ConversationHashOptionsType } from '../types';
import {
  getConversationHashService,
  getConversationHashServiceV2,
} from './helpers';

/**
 * All chat messages are stored on IPFS. This function will return the latest message's CID (Content Identifier on IPFS).
 * Whenever a new message is sent or received, this CID will change.
 */

export const conversationHash = async (
  options: ConversationHashOptionsType
) => {
  const { conversationId, account, env = Constants.ENV.PROD } = options || {};
  try {
    if (!isValidPushCAIP(account)) {
      throw new Error(`Invalid address!`);
    }

    const updatedConversationId = await convertToValidDID(conversationId, env);
    const accountDID = await convertToValidDID(account, env);
    const response = await getConversationHashService({
      conversationId: updatedConversationId,
      account: accountDID,
      env,
    });
    return response;
  } catch (err) {
    throw handleError(err, conversationHash.name);
  }
};

export const conversationHashV2 = async (
  options: ConversationHashOptionsType
) => {
  const { conversationId, account, env = Constants.ENV.PROD } = options || {};
  try {
    const updatedConversationId = await convertToValidDIDV2(
      conversationId,
      env,
      options.chainId!
    );

    const accountDID = await convertToValidDIDV2(
      account,
      env,
      options.chainId!
    );

    const response = await getConversationHashServiceV2({
      conversationId: updatedConversationId,
      account: accountDID,
      env,
    });
    return response;
  } catch (err) {
    throw handleError(err, conversationHash.name);
  }
};
