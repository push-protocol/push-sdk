import { convertToValidDID, getAPIBaseUrls, isValidPushCAIP } from '../helpers';
import Constants, { ENV } from '../constants';
import { IFeeds } from '../types';
import {
  getInboxLists,
  addDeprecatedInfo,
  IPGPHelper,
  PGPHelper,
} from './helpers';
import { axiosGet } from '../utils/axiosUtil';
import { handleError } from '../errors/validationError';

export type ChatsOptionsType = {
  account: string;
  pgpPrivateKey?: string;
  /**
   * If true, the method will return decrypted message content in response
   */
  toDecrypt?: boolean;
  /**
   * page index - default 1
   */
  page?: number;
  /**
   * no of items per page - default 10 - max 30
   */
  limit?: number;
  /**
   * Environment variable
   */
  env?: ENV;
};

/**
 * Return the latest message from all wallet addresses you have talked to. This can be used when building the inbox page.
 */

export const chats = async (options: ChatsOptionsType): Promise<IFeeds[]> => {
  return await chatsCore(options, PGPHelper);
};

export const chatsCore = async (
  options: ChatsOptionsType,
  pgpHelper: IPGPHelper
): Promise<IFeeds[]> => {
  const {
    account,
    pgpPrivateKey,
    env = Constants.ENV.PROD,
    toDecrypt = false,
    page = 1,
    limit = 10,
  } = options || {};
  if (!isValidPushCAIP(account)) {
    throw new Error(`Invalid address!`);
  }
  const user = await convertToValidDID(account, env);
  const API_BASE_URL = getAPIBaseUrls(env);
  const apiEndpoint = `${API_BASE_URL}/v1/chat/users/${user}/chats?page=${page}&limit=${limit}`;
  const requestUrl = `${apiEndpoint}`;
  try {
    const response = await axiosGet(requestUrl);
    const chats: IFeeds[] = response.data.chats;
    const updatedChats = addDeprecatedInfo(chats);
    const feeds: IFeeds[] = await getInboxLists(
      {
        lists: updatedChats,
        user: user,
        toDecrypt,
        pgpPrivateKey,
        env,
      },
      pgpHelper
    );
    return feeds;
  } catch (err) {
    throw handleError(err, chats.name);
  }
};
