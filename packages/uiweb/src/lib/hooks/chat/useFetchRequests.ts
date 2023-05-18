
import type { Env, IFeeds } from '@pushprotocol/restapi';
import * as PushAPI from '@pushprotocol/restapi';
import { useCallback, useContext, useState } from 'react';
import { ChatFeedsType, Constants } from '../..';
import { ChatMainStateContext, ChatPropsContext } from '../../context';




const useFetchRequests = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const { setRequestsFeed} =
  useContext<any>(ChatMainStateContext);
  const { account, env,decryptedPgpPvtKey } =
  useContext<any>(ChatPropsContext);
  
  const fetchRequests = useCallback(async () => {

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
      setRequestsFeed(modifiedRequestsObj);
    } catch (error: Error | any) {
      setLoading(false);
      setError(error.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [decryptedPgpPvtKey]);

  return { fetchRequests, error, loading };
};

export default useFetchRequests;
