
import { useCallback, useState } from 'react';
import { useChatData } from './useChatData';

interface HistoryMessagesParams {
  chatId?: string;
  limit?: number;
  threadHash?: string | null;
}


const useFetchHistoryMessages
  = () => {
    const [error, setError] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);

    const { account, env, alias } = useChatData();

    const historyMessages = useCallback(async ({ chatId, limit = 10, threadHash }: HistoryMessagesParams) => {

      setLoading(true);
      try {
        const chatHistory = await alias.chat.history(chatId, {
          limit: limit,
          reference: threadHash,
        })
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
    }, [account, env, alias]);

    return { historyMessages, error, loading };
  };

export default useFetchHistoryMessages;