import * as PushAPI from '@pushprotocol/restapi';
import { Env } from '@pushprotocol/restapi';
import { useCallback, useContext, useState } from 'react';
import { useChatData } from './useChatData';
import { IGroup } from '../../types';

interface getGroup {
  searchText: string;
}

const useGetGroup = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const { env } = useChatData();

  const getGroup = useCallback(
    async ({ searchText }: getGroup) => {
      setLoading(true);
      let group: IGroup;
      try {
        group = await PushAPI.chat.getGroup({ chatId: searchText, env });
      } catch (error: Error | any) {
        if ((error.message as string).includes('No group with chatId')) {
          try {
            group = await PushAPI.chat.getGroupByName({
              groupName: searchText,
              env,
            });
          } catch (err) {
            setLoading(false);
            setError(error.message);
            console.log(error);
            return;
          }
        } else {
          setLoading(false);
          setError(error.message);
          console.log(error);
          return;
        }
      }
      return group;
    
    },
    [ env]
  );

  return { getGroup, error, loading };
};

export default useGetGroup;
