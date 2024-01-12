
import type { Env, IFeeds } from '@pushprotocol/restapi';
import * as PushAPI from '@pushprotocol/restapi';
import { useCallback, useContext, useState } from 'react';
import type { ChatFeedsType} from '../../../';
import { Constants } from '../../../';
import { ChatMainStateContext, ChatAndNotificationPropsContext } from '../../../context';
import type { ChatMainStateContextType } from '../../../context/chatAndNotification/chat/chatMainStateContext';


interface fetchRequests {
    page: number;
    requestLimit: number;
  }

const useFetchRequests = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const { setRequestsFeed} =
  useContext<ChatMainStateContextType>(ChatMainStateContext);
  const { account, env,decryptedPgpPvtKey } =
  useContext<any>(ChatAndNotificationPropsContext);
  
  const fetchRequests = useCallback(async ({ page, requestLimit }: fetchRequests)  => {

    setLoading(true);
    try {
      const requests:IFeeds[] = await PushAPI.chat.requests({
        account: account,
        toDecrypt: decryptedPgpPvtKey?true:false,
        pgpPrivateKey: String(decryptedPgpPvtKey),
        page,
        limit:requestLimit,
        env: env
      });

      //conversation to map from array
      const modifiedRequestsObj: ChatFeedsType= {};
      for (const request of requests) {
        if(!request?.groupInformation)
        modifiedRequestsObj[request.did.toLowerCase() ?? request.chatId] = request;
      }
      return modifiedRequestsObj;
    } catch (error: Error | any) {
      setLoading(false);
      setError(error.message);
      console.error(error);
      return;
    } finally {
      setLoading(false);
    }
  }, [decryptedPgpPvtKey,env]);

  return { fetchRequests, error, loading };
};

export default useFetchRequests;
