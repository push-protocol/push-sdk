import * as PushAPI from '@pushprotocol/restapi';
import { Env } from '@pushprotocol/restapi';
import { useCallback, useContext, useState } from 'react';
import { useChatData } from './useChatData';


interface fetchChat {
  chatId?: string;
}

const useFetchChat = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const { account, env,pgpPrivateKey, alias } = useChatData();


  const fetchChat = useCallback(
    async () => {
      setLoading(true);
      try {
        console.log("chatss calling in hook before", alias);
        const chat = await alias.chat.list("CHATS")
        console.log('chatss in hook', chat);
        return chat;
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
    [pgpPrivateKey,env,account, alias]
  );

  return { fetchChat, error, loading };
};

export default useFetchChat;
