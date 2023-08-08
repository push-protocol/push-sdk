
import * as PushAPI from '@pushprotocol/restapi';
import type { IMessageIPFS } from '@pushprotocol/restapi';
import { useCallback, useContext, useState } from 'react';
import { ChatDataContext } from '../../context';




  interface HistoryMessagesParams {
    threadHash: string;
    limit?: number;
  }
  

const useFetchHistoryMessages
 = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const { account, env,decryptedPgpPvtKey } =
  useContext<any>(ChatDataContext);

  const historyMessages = useCallback(async ({threadHash,limit = 10,}:HistoryMessagesParams) => {

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
          chatHistory.reverse();
          console.log(chatHistory)
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

export default useFetchHistoryMessages;
