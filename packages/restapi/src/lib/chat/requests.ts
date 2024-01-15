import { getAPIBaseUrls, isValidETHAddress } from '../helpers';
import Constants, { ENV } from '../constants';
import { IFeeds } from '../types';
import { axiosGet } from '../utils/axiosUtil';
import { IPGPHelper, PGPHelper, addDeprecatedInfo, getInboxLists, getUserDID } from './helpers';

export type RequestOptionsType = {
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
 * The first time an address wants to send a message to another peer, the address sends an intent request. This first message shall not land in this peer Inbox but in its Request box.
 * This function will return all the chats that landed on the address' Request box. The user can then approve the request or ignore it for now.
 */
export const requests = async ( 
  options: RequestOptionsType
): Promise<IFeeds[]> => {
  return await requestsCore(options, PGPHelper)
};

export const requestsCore = async ( 
  options: RequestOptionsType,
  pgpHelper:IPGPHelper,
): Promise<IFeeds[]> => {
  const {
    account,
    pgpPrivateKey,
    env = Constants.ENV.PROD,
    toDecrypt = false,
    page = 1,
    limit = 10,
  } = options || {};
  const user = await getUserDID(account, env);
  const API_BASE_URL = getAPIBaseUrls(env);
  const apiEndpoint = `${API_BASE_URL}/v1/chat/users/${user}/requests?page=${page}&limit=${limit}`;
  try {
    if (!isValidETHAddress(user)) {
      throw new Error(`Invalid address!`);
    }
    const response = await axiosGet(apiEndpoint);
    const requests: IFeeds[] = response.data.requests;
    const updatedRequests = addDeprecatedInfo(requests);
    const Feeds: IFeeds[] = await getInboxLists({
      lists: updatedRequests,
      user,
      toDecrypt,
      pgpPrivateKey,
      env,
    },pgpHelper);

    return Feeds;
  } catch (err) {
    console.error(`[Push SDK] - API ${requests.name}: `, err);
    throw Error(`[Push SDK] - API ${requests.name}: ${err}`);
  }
};