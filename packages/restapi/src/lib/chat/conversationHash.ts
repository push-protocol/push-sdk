import axios from 'axios';
import Constants from '../constants';
import { ConversationHashOptionsType } from '../types';
import { getConversationHashService } from './helpers';

export const conversationHash = async (
  options: ConversationHashOptionsType
) => {
  const { conversationId, account, env = Constants.ENV.PROD } = options || {};
  try {

    const response = await getConversationHashService({
      conversationId: conversationId,
      account,
      env,
    });
    return response;
  } catch (err) {
    console.error(
      '[EPNS-SDK] - Error - conversationHash() - ',
      JSON.stringify(err)
    );
    return err;
  }
};
