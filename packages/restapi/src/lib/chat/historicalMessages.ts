import Constants from '../constants';
import { AccountEnvOptionsType } from '../types';
import { getMessagesService } from './helpers';

/**
 *  GET /v1/chat/conversationhash/:threadhash
*/

enum FetchLimit {
  MIN = 1,
  DEFAULT = 10,
  MAX = 30
}

export interface HistoricalMessagesOptionsType extends Omit<AccountEnvOptionsType, "account"> {
  threadhash: string;
  limit?: number;
}

export const history = async (
  options: HistoricalMessagesOptionsType
) => {
  const {
    threadhash,
    limit = FetchLimit.DEFAULT,
    env = Constants.ENV.PROD,
  } = options || {};

  if(limit < FetchLimit.MIN || limit > FetchLimit.MAX) {
    if(limit < FetchLimit.MIN)
      throw new Error(`Limit must be more than equal to ${FetchLimit.MIN}`);
    else
      throw new Error(`Limit must be less than equal to ${FetchLimit.MAX}`);
  }

  return getMessagesService({threadhash, limit, env});
}
