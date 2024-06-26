import { useCallback, useState } from 'react';
import { useChatData } from './useChatData';
import * as PushAPI from '@pushprotocol/restapi';
import { GrouInfoType } from '../../components/chat/types';

export const useCreateGatedGroup = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const { user } = useChatData();

  const createGatedGroup = useCallback(
    async (groupInfoType: GrouInfoType, rules: any) => {
      setLoading(true);
      console.debug('user in create group ', user);
      try {
        const payload = {
          description: groupInfoType.groupDescription,
          image: groupInfoType.groupImage,
          private: !groupInfoType.isPublic,
          members: groupInfoType.members,
          admins: groupInfoType.admins,
          rules: rules,
        };
        const response = await user?.chat.group.create(groupInfoType.groupName, payload);
        setLoading(false);
        if (!response) {
          return { success: false, data: 'Something went wrong' };
        }
        return { success: true, data: response };
      } catch (error: Error | any) {
        setLoading(false);
        setError(error.message);
        return error.message;
      }
    },
    [user]
  );

  return { createGatedGroup, error, loading };
};
