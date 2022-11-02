import Constants from '../constants';
import { AccountEnvOptionsType } from '../types';
import { history } from './historicalMessages';

/**
 *  GET /v1/chat/conversationhash/:threadhash
*/

export interface LatestMessagesOptionsType extends AccountEnvOptionsType{
  threadhash: string;
  pgpPrivateKey?: string;
}

export const latest = async (
  options: LatestMessagesOptionsType
) => {
  const {
    threadhash,
    pgpPrivateKey = '',
    account,
    env = Constants.ENV.PROD,
  } = options || {};

  return history({threadhash, limit:1,pgpPrivateKey,account, env});
}
