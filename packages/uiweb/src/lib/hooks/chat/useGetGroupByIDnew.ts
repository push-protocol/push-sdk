import * as PushAPI from '@pushprotocol/restapi';
import { Env } from '@pushprotocol/restapi';
import { useCallback, useContext, useState } from 'react';
import { useChatData } from './useChatData';
import { Group } from '../../components';

interface GetGroupParams {
  groupId: string;
}

const useGetGroupByIDnew = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useChatData();

  const getGroupByIDnew = useCallback(
    async ({ groupId }: GetGroupParams) => {
      setLoading(true);
      let group: Group;
      try {
        group = await user?.chat.group.info(groupId);
       
      } catch (error) {
        console.log(error);
        return;
      }
      return group;
    },
    [user]
  );

  return { getGroupByIDnew, error, loading };
};

export default useGetGroupByIDnew;