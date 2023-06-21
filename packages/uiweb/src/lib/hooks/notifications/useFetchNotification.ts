import * as PushAPI from '@pushprotocol/restapi';
import type { ParsedResponseType} from '@pushprotocol/restapi';
import { useCallback, useContext, useState } from 'react';
import { ChatAndNotificationPropsContext } from '../../context';
import { ParsedNotificationType } from '../../types';


interface fetchNotification {
  page: number;
  limit: number;
  spam?: boolean;
}

const useFetchNotification = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const { account, env, } =
  useContext<any>(ChatAndNotificationPropsContext);


  const fetchNotification = useCallback(
    async ({ page,limit,spam =false}: fetchNotification) => {
      setLoading(true);
      try {
        console.log(env)
        const results = await PushAPI.user.getFeeds({
          user: account, // user address in CAIP
          raw: true,
          env: env,
          page: page,
          spam,
          limit: limit
        });
        const parsedResponse = PushAPI.utils.parseApiResponse(results);
        const map1 = new Map();
        const map2 = new Map();
        results.forEach( (each:any) => {
          map1.set(each.payload.data.sid , each.epoch);
          map2.set(each.payload.data.sid , each.sender);
      })
      parsedResponse.forEach( (each:any) => {
          each['date'] = map1.get(each.sid);
          each['epoch'] = (new Date(each['date']).getTime() / 1000);
          each['channel'] = map2.get(each.sid);
      })
       const modifiedNotifObj = Object.fromEntries(
        parsedResponse.map((e:any) => [e.sid, e])
     )
        return modifiedNotifObj;
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
    [account,env]
  );

  return { fetchNotification, error, loading };
};

export default useFetchNotification;
