
import * as PushAPI from '@pushprotocol/restapi';
import { Env, IMessageIPFS } from '@pushprotocol/restapi';
import { useCallback, useState } from 'react';



  interface HistoryMessagesParams {
    account: string;
    decryptedPgpPvtKey: string;
    env: Env;
    threadHash: string;
    limit?: number;
  }
  

const useFetchHistoryMessages
 = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const historyMessages = useCallback(async ({account,env,decryptedPgpPvtKey,threadHash,limit,}:HistoryMessagesParams) => {

    setLoading(true);
    try {
        const chatHistory:IMessageIPFS[] = await PushAPI.chat.history({
            threadhash: threadHash,
            account: account,
            toDecrypt: decryptedPgpPvtKey ? true : false,
            pgpPrivateKey: String(decryptedPgpPvtKey),
            limit: limit,
            env: env
          });

      
      return chatHistory;
    } catch (error: Error | any) {
      setLoading(false);
      setError(error.message);
      console.log(error);
      return;
    } finally {
      setLoading(false);
    }
  }, []);

  return { historyMessages, error, loading };
};

export default useFetchHistoryMessages
;
