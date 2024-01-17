
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
  

const useFetchMessageUtilities
 = () => {
  const [error, setError] = useState<string>();
  const [historyLoading, setHistoryLoading] = useState<boolean>(false);
  const [latestLoading, setLatestLoading] = useState<boolean>(false);


  const { account, env,pgpPrivateKey ,pushUser} = useChatData();
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

  return { historyMessages, error, historyLoading ,latestLoading,fetchLatestMessage};
};

export default useFetchMessageUtilities;
