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
      setLoading(true);
      try {
        const chat = await PushAPI.chat.chat({
          account: account? account : '0xeeE5A266D7cD954bE3Eb99062172E7071E664023',
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
