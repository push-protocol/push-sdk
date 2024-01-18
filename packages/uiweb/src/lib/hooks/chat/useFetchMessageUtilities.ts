
import * as PushAPI from '@pushprotocol/restapi';
import type { IMessageIPFS } from '@pushprotocol/restapi';
import { useCallback, useContext, useState } from 'react';
import { ChatDataContext } from '../../context';
import { useChatData } from './useChatData';




  interface HistoryMessagesParams {
    threadHash: string;
    limit?: number;
  }
  interface FetchLatestMessageParams {
    chatId: string;
    
  }
  interface FetchChatListParams {
    type: keyof typeof PushAPI.ChatListType;
    overrideAccount?:string;
    page:number;
    limit:number;
    
  }
  

const useFetchMessageUtilities
 = () => {
  const [error, setError] = useState<string>();
  const [historyLoading, setHistoryLoading] = useState<boolean>(false);
  const [latestLoading, setLatestLoading] = useState<boolean>(false);
  const [chatListLoading, setChatListLoading] = useState<boolean>(false);


  const { account, env,pgpPrivateKey ,pushUser} = useChatData();
  const fetchChatList = useCallback(async ({type,page,limit,overrideAccount = undefined}:FetchChatListParams) => {

    setChatListLoading(true);
    try {
        const chats = await pushUser?.chat
        .list(type, {
          overrideAccount: overrideAccount,
          page: page,
          limit: limit,
        })
       return chats;
    } catch (error: Error | any) {
      setChatListLoading(false);
      setError(error.message);
      console.log(error);
      return;
    } finally {
      setChatListLoading(false);
    }
  }, [pushUser,account,env]);
  const fetchLatestMessage = useCallback(async ({chatId}:FetchLatestMessageParams) => {

    setLatestLoading(true);
    try {
        const latestChat:IMessageIPFS[] = await pushUser?.chat.latest(chatId) as IMessageIPFS[];
       return latestChat;
    } catch (error: Error | any) {
      setLatestLoading(false);
      setError(error.message);
      console.log(error);
      return;
    } finally {
      setLatestLoading(false);
    }
  }, [pushUser,account,env]);

  const historyMessages = useCallback(async ({threadHash,limit = 10,}:HistoryMessagesParams) => {

    setHistoryLoading(true);
    try {
        const chatHistory:IMessageIPFS[] = await PushAPI.chat.history({
            threadhash: threadHash,
            account:account ? account : '0xeeE5A266D7cD954bE3Eb99062172E7071E664023',
            toDecrypt: pgpPrivateKey ? true : false,
            pgpPrivateKey: String(pgpPrivateKey),
            limit: limit,
            env: env
          });
          chatHistory.reverse();
       return chatHistory;
    } catch (error: Error | any) {
      setHistoryLoading(false);
      setError(error.message);
      console.log(error);
      return;
    } finally {
      setHistoryLoading(false);
    }
  }, [pgpPrivateKey,account,env]);

  return { historyMessages, error, historyLoading ,latestLoading,fetchLatestMessage,fetchChatList,chatListLoading};
};

export default useFetchMessageUtilities;
