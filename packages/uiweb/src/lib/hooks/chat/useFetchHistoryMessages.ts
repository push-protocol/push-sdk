
import * as PushAPI from '@pushprotocol/restapi';
import type { IMessageIPFS } from '@pushprotocol/restapi';
import { useCallback, useContext, useState } from 'react';
import { ChatDataContext } from '../../context';
import { useChatData } from './useChatData';




  interface HistoryMessagesParams {
    threadHash: string;
    limit?: number;
  }
  

const useFetchHistoryMessages
 = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const { account, env,pgpPrivateKey } = useChatData();

  const historyMessages = useCallback(async ({threadHash,limit = 10,}:HistoryMessagesParams) => {

    setLoading(true);
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
      setLoading(false);
      setError(error.message);
      console.log(error);
      return;
    } finally {
      setLoading(false);
    }
  }, [pgpPrivateKey,account,env]);

  return { historyMessages, error, loading };
};

export default useFetchHistoryMessages;
