import Constants from '../constants';
import { isValidETHAddress, walletToPCAIP10 } from '../helpers';
import { ConversationHashOptionsType } from '../types';
import { getConversationHashService } from './helpers';

export const conversationHash = async (
  options: ConversationHashOptionsType
) => {
  const { conversationId, account, env = Constants.ENV.PROD } = options || {};
  try {
    if (!isValidETHAddress(account)) {
      throw new Error(`Invalid address!`);
    }

    const updatedConversationId = isValidETHAddress(conversationId) ? walletToPCAIP10(conversationId) : conversationId

    const response = await getConversationHashService({
      conversationId: updatedConversationId,
      account,
      env,
    });
    return response;
  } catch (err) {
    console.error(`[Push SDK] - Error - API ${conversationHash.name} - `, err);
    throw Error(`[Push SDK] - Error - API ${conversationHash.name} - `);
  }
};
