
import type { Env, IFeeds } from '@pushprotocol/restapi';
import * as PushAPI from '@pushprotocol/restapi';
import { useCallback, useState } from 'react';
import { ChatFeedsType } from '../..';


interface FetchRequestsParams {
    account: string;
    decryptedPgpPvtKey: string;
    env: Env;
  }

const useFetchRequests = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const fetchRequests = useCallback(async ({account,env,decryptedPgpPvtKey}:FetchRequestsParams) => {

    setLoading(true);
    try {
      const requests:IFeeds[] = await PushAPI.chat.requests({
        account: account,
        toDecrypt: decryptedPgpPvtKey?true:false,
        pgpPrivateKey: String(decryptedPgpPvtKey),
        env: env
      });

      //conversation to map from array
      const modifiedRequestsObj: ChatFeedsType= {};

      for (const request of requests) {
        modifiedRequestsObj[request.did ?? request.chatId] = request;
      }

      return modifiedRequestsObj;
    } catch (error: Error | any) {
      setLoading(false);
      setError(error.message);
      console.log(error);
      return;
    } finally {
      setLoading(false);
    }
  }, []);

  return { fetchRequests, error, loading };
};

export default useFetchRequests;
