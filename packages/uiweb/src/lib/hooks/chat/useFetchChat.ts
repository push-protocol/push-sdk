import * as PushAPI from '@pushprotocol/restapi';
import { Env } from '@pushprotocol/restapi';
import { useCallback, useContext, useState } from 'react';
import { useChatData } from './useChatData';


interface fetchChat {
  chatId: string;
}

const useFetchChat = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const { account, env,pgpPrivateKey } = useChatData();


  const fetchChat = useCallback(
    async ({ chatId}: fetchChat) => {
      console.log(env);
      setLoading(true);
      try {
        const chat = await PushAPI.chat.chat({
          account: account!,
          toDecrypt: pgpPrivateKey ? true : false,
          pgpPrivateKey: String(pgpPrivateKey),
          recipient: chatId,
          env: env
        });
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
    [pgpPrivateKey,env]
  );

  return { fetchChat, error, loading };
};

export default useFetchChat;
