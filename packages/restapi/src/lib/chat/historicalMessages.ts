import Constants from '../constants';
import { pCAIP10ToWallet } from '../helpers';
import { AccountEnvOptionsType, IMessageIPFS } from '../types';
import { get } from '../user';
import {
  addDeprecatedInfoToMessages,
  decryptConversation,
  getMessagesService,
} from './helpers';

enum FetchLimit {
  MIN = 1,
  DEFAULT = 10,
  MAX = 30,
}

export interface HistoricalMessagesOptionsType extends AccountEnvOptionsType {
  threadhash: string;
  pgpPrivateKey?: string;
  /**
   * If true, the method will return decrypted message content in response
   */
  toDecrypt?: boolean;
  limit?: number;
}

/**
 * Get all the messages exchanged between users after the threadhash.
 */
export const history = async (
  options: HistoricalMessagesOptionsType
): Promise<IMessageIPFS[]> => {
  const {
    threadhash,
    limit = FetchLimit.DEFAULT,
    pgpPrivateKey = '',
    account,
    toDecrypt = false,
    env = Constants.ENV.PROD,
  } = options || {};

  try {
    if (limit < FetchLimit.MIN || limit > FetchLimit.MAX) {
      if (limit < FetchLimit.MIN)
        throw new Error(`Limit must be more than equal to ${FetchLimit.MIN}`);
      else
        throw new Error(`Limit must be less than equal to ${FetchLimit.MAX}`);
    }

    const messages = await getMessagesService({ threadhash, limit, env });
    const updatedMessages = addDeprecatedInfoToMessages(messages);
    const connectedUser = await get({ account: pCAIP10ToWallet(account), env });
    if (toDecrypt) {
      return await decryptConversation({
        messages: updatedMessages,
        connectedUser,
        pgpPrivateKey,
        env,
      });
    }
    return messages;
  } catch (err) {
    console.error(`[Push SDK] - API ${history.name} -: `, err);
    throw Error(`[Push SDK] - API ${history.name} -: ${err}`);
  }
};
