import Constants from '../constants';
import { AccountEnvOptionsType } from '../types';
import { history } from './historicalMessages';

/**
 *  GET /v1/chat/conversationhash/:threadhash
*/

export interface LatestMessagesOptionsType extends Omit<AccountEnvOptionsType, "account"> {
  threadhash: string;
}

export const latest = async (
  options: LatestMessagesOptionsType
) => {
  const {
    threadhash,
    env = Constants.ENV.PROD,
  } = options || {};

  return history({threadhash, limit:1, env});
}
