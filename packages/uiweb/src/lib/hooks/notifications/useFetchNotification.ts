import * as PushAPI from '@pushprotocol/restapi';
import type { ParsedResponseType} from '@pushprotocol/restapi';
import { useCallback, useContext, useState } from 'react';
import { ChatAndNotificationPropsContext } from '../../context';
import { ParsedNotificationType } from '../../types';
import { convertReponseToParsedArray } from '../../helpers/notification';


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
        const results = await PushAPI.user.getFeeds({
          user: account, // user address in CAIP
          raw: true,
          env: env,
          page: page,
          spam,
          limit: limit
        });
        const parsedResponse = convertReponseToParsedArray(results);
        const modifiedNotifObj = Object.fromEntries(
          parsedResponse.map((e: any) => [`notif${e.sid}`, e])
        );
        
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
