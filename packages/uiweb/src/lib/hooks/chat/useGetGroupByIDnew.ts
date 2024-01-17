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
  const { pushUser } = useChatData();

  const getGroupByIDnew = useCallback(
    async ({ groupId }: GetGroupParams) => {
      setLoading(true);
      let group: Group;
      try {
        group = await pushUser?.chat.group.info(groupId);
       
      } catch (error) {
        console.log(error);
        return;
      }
      return group;
    },
    [pushUser]
  );

  return { getGroupByIDnew, error, loading };
};

export default useGetGroupByIDnew;