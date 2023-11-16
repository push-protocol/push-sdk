

import { useCallback, useContext, useState } from 'react';

import { useChatData } from './useChatData';




  interface HistoryMessagesParams {
    chatId?: string;
    limit?: number;
  }
  

const useFetchHistoryMessages
 = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const { account, env, pushUser } = useChatData();

  const historyMessages = useCallback(async ({chatId}: HistoryMessagesParams) => {

    setLoading(true);
    try {
        const chatHistory = await pushUser.chat.history(chatId)
          chatHistory.reverse();
       return chatHistory;
    } catch (error: Error | any) {
      setLoading(false);
      setError(error.message);
      console.log(error);
      return;
    } finally {
      setLoading(false);
    }
  }, [account,env, pushUser]);

  return { historyMessages, error, loading };
};

export default useFetchHistoryMessages;