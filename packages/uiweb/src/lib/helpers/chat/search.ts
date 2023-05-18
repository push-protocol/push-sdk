import { Env, IUser } from '@pushprotocol/restapi';
import { add } from 'date-fns';
import { ethers } from 'ethers';
import { CoreContractChainId, InfuraAPIKey, ProfilePicture } from '../../config';
import { GetProfileParams } from '../../hooks/chat/useGetchatProfile';
import { ChatFeedsType, Web3NameListType } from '../../types';
import { walletToPCAIP10 } from '../address';
import { getUdResolver } from '../udResolver';
import { displayDefaultUser } from './user';

export const getObjectsWithMatchingKeys = (
  obj: ChatFeedsType,
  substring: string,
  web3NameList: Web3NameListType
): ChatFeedsType => {
  const matchedObjects: Record<string, any> = {};
  if (substring) {
    Object.keys(obj).forEach((key) => {
      if (key.includes(substring)) {
        matchedObjects[key] = obj[key];
      } else {
        Object.keys(web3NameList).forEach((key) => {
          if (web3NameList[key].includes(substring)) {
            matchedObjects[key] = obj[walletToPCAIP10(key)];
          }
        });
      }
    });
  }
  console.log(matchedObjects);
  return matchedObjects;
};

type getNewChatUserParamType = {
  searchText: string;
  fetchChatProfile: ({
    profileId,
  }: GetProfileParams) => Promise<IUser | undefined>;
  env:Env
};

export const getNewChatUser = async ({
  searchText,
  fetchChatProfile,
  env
}: getNewChatUserParamType): Promise<IUser | undefined> => {
  let chatProfile: IUser | undefined;
  let address:string | null =null;
  const udResolver = getUdResolver(env);
  const provider = new ethers.providers.InfuraProvider(CoreContractChainId[env], InfuraAPIKey);
  if (ethers.utils.isAddress(searchText)) {
   address = searchText;
  }
  else{
    if (searchText.includes('.')) {
        try {

          address =
            (await provider.resolveName(searchText)) ||
            // (await library.resolveName(searchText)) ||
            (await udResolver.owner(searchText));

console.log(address)
        } catch (err) {
          console.log(err);
        }
      }
  }
  if(address){
    chatProfile = await fetchChatProfile({ profileId: address });
    if (chatProfile) {
    } else {
      chatProfile = displayDefaultUser({ caip10: walletToPCAIP10(address) });
    }
    return chatProfile;
  }
  return;
};
