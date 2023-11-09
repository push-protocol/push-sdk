import * as PushAPI from '@pushprotocol/restapi';
import { Env } from '@pushprotocol/restapi';
import { useCallback, useContext, useState } from 'react';
import { useChatData } from './useChatData';
import { IGroup } from '../../types';

interface getGroup {
  groupId: string;
}

const useGetGroupByID = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const { env } = useChatData();

  const getGroupByID = useCallback(
    async ({ groupId }: getGroup) => {
      setLoading(true);
      let group: IGroup;
      try {
        group = await PushAPI.chat.getGroup({
          chatId: groupId,
          env: env,
        });
      } catch (error) {
        console.log(error);
        return;
      }
      return group;
    },
    [env]
  );

  return { getGroupByID, error, loading };
};

export default useGetGroupByID;