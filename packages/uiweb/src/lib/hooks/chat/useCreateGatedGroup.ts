import { useCallback, useState } from 'react';
import { useChatData } from './useChatData';
import * as PushAPI from '@pushprotocol/restapi';
import { GrouInfoType } from '../../components/chat/types';

export const useCreateGatedGroup = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const { pgpPrivateKey, env, account } = useChatData();

  const createGatedGroup = useCallback(
    async (groupInfoType:GrouInfoType,rules: any) => {
      setLoading(true);
      try {
        const payload = {
          groupName: groupInfoType.groupName,
          groupDescription:groupInfoType.groupDescription,
          groupImage:groupInfoType.groupImage,
          isPublic: groupInfoType.isPublic,
          members: [],
          admins: [],
          account: account || undefined,
          env: env,
          pgpPrivateKey: pgpPrivateKey || undefined,
          rules: rules,
        };
        const response = await PushAPI.chat.createGroup(payload);
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
    [pgpPrivateKey, account, env]
  );

  return { createGatedGroup, error, loading };
};
