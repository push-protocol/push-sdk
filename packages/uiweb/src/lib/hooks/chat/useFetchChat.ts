import * as PushAPI from '@pushprotocol/restapi';
import { Env } from '@pushprotocol/restapi';
import { useCallback, useContext, useState } from 'react';
import { useChatData } from './useChatData';




const useFetchChat = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const { account, env, pushUser } = useChatData();


  const fetchChat = useCallback(
    async () => {
      setLoading(true);
      try {
        const chat = await pushUser.chat.list("CHATS")
        console.log(chat)
        return chat[0];
      } catch (error: Error | any) {
        setLoading(false);
        setError(error.message);
        console.log(error);
        return;
      }
      finally {
        setLoading(false);
      }
    },
    [env,account, pushUser]
  );

  return { fetchChat, error, loading };
};

export default useFetchChat;