import Constants from '../constants';
import { AccountEnvOptionsType } from '../types';
import { IPGPHelper, PGPHelper } from './helpers';
import { history } from './historicalMessages';

export interface LatestMessagesOptionsType extends AccountEnvOptionsType {
  threadhash: string;
  toDecrypt?: boolean;
  pgpPrivateKey?: string;
}

/**
 * Get the latest chat message
 */

export const latest = async (options: LatestMessagesOptionsType) => {
  return await latestCore(options, PGPHelper)
}
export const latestCore = async (options: LatestMessagesOptionsType, pgpHelper: IPGPHelper) => {
  const {
    threadhash,
    pgpPrivateKey = '',
    account,
    toDecrypt = false,
    env = Constants.ENV.PROD,
  } = options || {};

  return history({
    threadhash,
    toDecrypt,
    limit: 1,
    pgpPrivateKey,
    account,
    env,
  });
};
