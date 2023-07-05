import type { Env, IFeeds, IUser } from '@pushprotocol/restapi';
import { add } from 'date-fns';
import { ethers } from 'ethers';
import {
  CoreContractChainId,
  InfuraAPIKey,
  ProfilePicture,
} from '../../config';
import type { GetProfileParams } from '../../hooks';
import type { ChatFeedsType, NotificationFeedsType, ParsedNotificationType, Web3NameListType } from '../../types';
import { pCAIP10ToWallet, walletToPCAIP10 } from '../address';
import { getUdResolver } from '../udResolver';
import { displayDefaultUser } from './user';

export const getObjectsWithMatchingKeys = (
  obj: ChatFeedsType,
  substring: string,
  web3NameList: Web3NameListType
): ChatFeedsType => {
  const matchedObjects: Record<string, IFeeds> = {};

  if (substring) {
    Object.keys(obj).forEach((key) => {
      if (key.toLowerCase().includes(substring.toLowerCase())) {
        matchedObjects[key] = obj[key];
      } else if (obj[key].name) {
        if ((obj[key].name?.toLowerCase() as string).includes(substring.toLowerCase())) {
          matchedObjects[key] = obj[key];
        }
      } else {
        Object.keys(web3NameList).forEach((key) => {
          if (web3NameList[key].toLowerCase().includes(substring.toLowerCase())) {
          
            if(obj[walletToPCAIP10(key)])
            matchedObjects[walletToPCAIP10(key)] = obj[walletToPCAIP10(key)];
          }
        });
      }
    });
  }
  return matchedObjects;
};

type getNewChatUserParamType = {
  searchText: string;
  fetchChatProfile: ({
    profileId,
  }: GetProfileParams) => Promise<IUser | undefined>;
  env: Env;
};

export const getNewChatUser = async ({
  searchText,
  fetchChatProfile,
  env,
}: getNewChatUserParamType): Promise<IUser | undefined> => {
  let chatProfile: IUser | undefined;
  let address: string | null = null;

  address = await getAddress(searchText, env);
  if (address) {
    chatProfile = await fetchChatProfile({ profileId: address });
    if (!chatProfile)
      chatProfile = displayDefaultUser({ caip10: walletToPCAIP10(address) });
    return chatProfile;
  }
  return;
};

export const getAddress = async (searchText: string, env: Env) => {
  const udResolver = getUdResolver(env);
  const provider = new ethers.providers.InfuraProvider(
    CoreContractChainId[env],
    InfuraAPIKey
  );

  let address: string | null = null;
  if (searchText.includes('.')) {
    try {
      address =
        (await provider.resolveName(searchText)) ||
        // (await library.resolveName(searchText)) ||
        (await udResolver.owner(searchText));

      return address;
    } catch (err) {
      console.log(err);
      return null;
    }
  } else if (await ethers.utils.isAddress(pCAIP10ToWallet(searchText))) {
    return searchText;
  } else {
    return null;
  }
};

export const getSearchedNotificationsList = (
  substring: string,
  obj: NotificationFeedsType
) => {

  const matchedObjects: Record<string, ParsedNotificationType> = {};

  if (substring) {
    Object.keys(obj).forEach((key) => {
      if ((obj[key].app.toLowerCase()).includes(substring.toLowerCase())) {
        matchedObjects[key] = obj[key];
      } 
     else{
      if ((obj[key].title.toLowerCase()).includes(substring.toLowerCase())) {
        matchedObjects[key] = obj[key];
      } 
     }
    });
  }
  return matchedObjects;

};
