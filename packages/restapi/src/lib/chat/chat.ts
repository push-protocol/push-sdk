import axios from 'axios';
import { getAPIBaseUrls, isValidETHAddress, walletToPCAIP10 } from '../helpers';
import Constants, { ENV } from '../constants';
import { IFeeds } from '../types';
import { getInboxLists, getUserDID } from './helpers';

export const chat = async (options: {
  account: string;
  pgpPrivateKey?: string;
  toDecrypt?: boolean;
  env?: ENV;
  recipient: string;
}): Promise<IFeeds> => {
  const {
    account,
    pgpPrivateKey,
    env = Constants.ENV.PROD,
    toDecrypt = false,
    recipient,
  } = options || {};
  const user = await getUserDID(account, env);
  const recipientWallet = await getUserDID(recipient, env);
  if (!isValidETHAddress(user)) throw new Error(`Invalid address ${user}`);
  if (!isValidETHAddress(recipientWallet))
    throw new Error(`Invalid address ${recipientWallet}`);
  const API_BASE_URL = getAPIBaseUrls(env);
  const apiEndpoint = `${API_BASE_URL}/v1/chat/users/${user}/chat/${recipientWallet}`;
  try {
    const response = await axios.get(apiEndpoint);
    // If no chat between users, then returns {}
    const chat: IFeeds = response.data;
    if (Object.keys(chat).length !== 0) {
      const [feed]: IFeeds[] = await getInboxLists({
        lists: [chat],
        user,
        toDecrypt,
        pgpPrivateKey,
        env,
      });
      return feed;
    } else {
      return chat;
    }
  } catch (err) {
    console.error(`[Push SDK] - API ${chat.name}: `, err);
    throw Error(`[Push SDK] - API ${chat.name}: ${err}`);
  }
};
