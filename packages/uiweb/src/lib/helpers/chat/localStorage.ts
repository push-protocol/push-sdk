import { IFeeds, IMessageIPFS } from '@pushprotocol/restapi';
import { ChatFeedsType, LocalStorageKeys } from '../../types';


type SetDataType = {
  chatId:string,
  value:IFeeds;
};

//store only if there isnt a chat
export const setData = ({ chatId, value }: SetDataType): void => {
  localStorage.setItem(chatId, JSON.stringify(value));
};



  
//add return type
export const getData = (key: string):IFeeds | null => {
 const chatJson=localStorage.getItem(key);
 const chat = chatJson?JSON.parse(chatJson):null;
 return chat;
};

