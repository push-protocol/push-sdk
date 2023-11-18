import { useCallback, useState } from 'react';
import { useChatData } from './useChatData';
import * as PushAPI from '@pushprotocol/restapi';
import { GrouInfoType } from '../../components/chat/types';

export const useCreateGatedGroup = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const { env, account, pushUser } = useChatData();

  const createGatedGroup = useCallback(
    async (groupInfoType:GrouInfoType,rules: any) => {
      setLoading(true);
      try {
        const payload = {
          description:groupInfoType.groupDescription,
          image:groupInfoType.groupImage,
          private: !groupInfoType.isPublic,
          members: [],
          admins: [],
          rules: rules,
        };
        const response = await pushUser?.chat.group.create(groupInfoType.groupName, payload);
        setLoading(false);
        console.log(response)
        if (!response) {
          return false;
        }
        return true;
      } catch (error: Error | any) {
        setLoading(false);
        setError(error.message);
        return error.message;
      }
    },
    [account, env]
  );

  return { createGatedGroup, error, loading };
};
