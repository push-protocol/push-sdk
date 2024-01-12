import type { IFeeds } from '@pushprotocol/restapi';
import { IMessageIPFS } from '@pushprotocol/restapi';
import { ChatFeedsType, LocalStorageKeys } from '../../types';
import * as PUSHAPI from '@pushprotocol/restapi';
import { ENV } from '../../config';

type SetDataType = {
  chatId: string;
  value: IFeeds;
};

//store only if there isnt a chat
export const setData = ({ chatId, value }: SetDataType): void => {
  localStorage.setItem(chatId, JSON.stringify(value));
};

//add return type
export const getData = (key: string): IFeeds | null => {
  const chatJson = localStorage.getItem(key);
  const chat = chatJson ? JSON.parse(chatJson) : null;
  return chat;
};

export const getPfp = async ({
  account,
  env,
}: {
  account: string;
  env: ENV;
}) => {
  const fetchData = async () => {
    try {
      const response = await PUSHAPI.user.get({
        account: account,
        env: env,
      });
      const pfp = response.profile.picture ? response.profile.picture : '';
      setPfp({ account, value: pfp });
      return pfp;
    } catch (err: Error | any) {
      console.error(err.message);
      return '';
    }
  };

  const pfp = localStorage.getItem(account);

  if (pfp === null) {
    return fetchData();
  } else {
    return pfp;
  }
};

export const setPfp = ({
  account,
  value,
}: {
  account: string;
  value: string;
}) => {
  localStorage.setItem(account, value);
};

export const setAccessControl = (chatId: string, toRemove: boolean) => {
  if (toRemove) {
    localStorage.removeItem(chatId);
  } else {
    const timestamp = new Date().getTime();
    localStorage.setItem(chatId, JSON.stringify(timestamp));
  }
};
