import { ChatFeedsType, Web3NameListType } from '../../types';
import { walletToPCAIP10 } from '../address';

export const getObjectsWithMatchingKeys = (
  obj: ChatFeedsType,
  substring: string,
  web3NameList:Web3NameListType
): ChatFeedsType => {
  const matchedObjects: Record<string, any> = {};
  if (substring) {
    Object.keys(obj).forEach((key) => {
      if (key.includes(substring)) {
        matchedObjects[key] = obj[key];
      }
      else{
        Object.keys(web3NameList).forEach((key) => {
            if (web3NameList[key].includes(substring)) {
              matchedObjects[key] = obj[walletToPCAIP10(key)];
            }
          });
      }
    });
  }
  console.log(matchedObjects)
  return matchedObjects;
};
