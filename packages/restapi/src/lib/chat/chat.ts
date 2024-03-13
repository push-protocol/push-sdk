import { getAPIBaseUrls, isValidETHAddress, walletToPCAIP10 } from '../helpers';
import Constants, { ENV } from '../constants';
import { IFeeds } from '../types';
import { axiosGet } from '../utils/axiosUtil';
import { PGPHelper, addDeprecatedInfo, getInboxLists, getUserDID } from './helpers';
import { handleError } from '../errors/ValidationError';

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
  const API_BASE_URL = getAPIBaseUrls(env);
  const apiEndpoint = `${API_BASE_URL}/v1/chat/users/${user}/chat/${recipientWallet}`;
  try {
     const response = await axiosGet(apiEndpoint);
    // If no chat between users, then returns {}
    const chat: IFeeds = response.data;
    if (Object.keys(chat).length !== 0) {
      const updatedChat = addDeprecatedInfo([chat]);
      const [feed]: IFeeds[] = await getInboxLists({
        lists: updatedChat,
        user,
        toDecrypt,
        pgpPrivateKey,
        env,
      },PGPHelper);
      return feed;
    } else {
      return chat;
    }
  } catch (err) {
    throw handleError(err, chat.name);
  }
};
