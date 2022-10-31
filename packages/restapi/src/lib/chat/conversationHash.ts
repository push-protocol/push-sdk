import Constants from '../constants';
import { isValidETHAddress } from '../helpers';
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
    const response = await getConversationHashService({
      conversationId: conversationId,
      account,
      env,
    });
    return response;
  } catch (err) {
    console.error(
      '[EPNS-SDK] - Error - conversationHash() - ',err);
    return err;
  }
};
