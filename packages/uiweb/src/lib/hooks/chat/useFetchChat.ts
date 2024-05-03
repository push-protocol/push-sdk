import { useCallback, useContext, useState } from 'react';
import { useChatData } from './useChatData';

interface fetchChat {
  chatId: string;
}

const useFetchChat = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useChatData();

  const fetchChat = useCallback(
    async ({ chatId }: fetchChat) => {
      setLoading(true);
      try {
        const chat = await user?.chat.info(chatId);
        return chat;
      } catch (error: Error | any) {
        setLoading(false);
        setError(error.message);
        console.log(error);
        return;
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  return { fetchChat, error, loading };
};

export default useFetchChat;
