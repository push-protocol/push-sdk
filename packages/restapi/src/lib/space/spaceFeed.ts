import axios from 'axios';
import { getAPIBaseUrls, isValidETHAddress } from '../helpers';
import Constants, { ENV } from '../constants';
import { IFeeds } from '../types';
import { addDeprecatedInfo, getSpaceInboxLists, getUserDID } from './../chat/helpers';

export const spaceFeed = async (options: {
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
    const response = await axios.get(apiEndpoint);
    // If no chat between users, then returns {}
    const space: IFeeds = response.data;
    if (Object.keys(space).length !== 0) {
      const [feed]: IFeeds[] = await getSpaceInboxLists({
        lists: [space],
        user,
        toDecrypt,
        pgpPrivateKey,
        env,
      });
      return feed;
    } else {
      return space;
    }
  } catch (err) {
    console.error(`[Push SDK] - API ${spaceFeed.name}: `, err);
    throw Error(`[Push SDK] - API ${spaceFeed.name}: ${err}`);
  }
};
