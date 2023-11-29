
import { useCallback, useState } from 'react';
import { useChatData } from './useChatData';
import { IGroup } from '../../types';

interface getGroup {
  groupId: string;
}

const useGetGroupByID = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const { pushUser } = useChatData();

  const getGroupByID = useCallback(
    async ({ groupId }: getGroup) => {
      setLoading(true);
      let group: IGroup | undefined;
      try {
        group = await pushUser?.chat.group.info(groupId);
        console.log(group)
      } catch (error) {
        console.log(error);
        return;
      }
      return group;
    },
    [pushUser]
  );

  return { getGroupByID, error, loading };
};

export default useGetGroupByID;