import Constants from '../constants';
import { AccountEnvOptionsType } from '../types';
import { history } from './historicalMessages';

export interface LatestMessagesOptionsType extends AccountEnvOptionsType {
  threadhash: string;
  toDecrypt?: boolean;
  pgpPrivateKey?: string;
}

export const latest = async (options: LatestMessagesOptionsType) => {
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
