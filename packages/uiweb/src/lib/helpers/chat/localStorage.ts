import { IFeeds, IMessageIPFS } from '@pushprotocol/restapi';
import { ChatFeedsType, LocalStorageKeys } from '../../types';


type SetDataType = {
  chatId:string,
  value:{unread:number,totalMsg:number};
};
type SetTotalMsgType = {
    chatId:string,
    totalMsg:number;
  };
//store only if there isnt a chat
export const setData = ({ chatId, value }: SetDataType): void => {
  localStorage.setItem(chatId, JSON.stringify(value));
};

export const setTotalMsg = ({ chatId, totalMsg }: SetTotalMsgType): void => {
    const chat = getData(chatId);
    chat.totalMsg = totalMsg;
    localStorage.setItem(chatId, JSON.stringify(chat));
  };

  
//add return type
export const getData = (key: string) => {
 const chat= JSON.parse(localStorage.getItem(key)??'');
 if(chat)
  return chat;
 return;
};

