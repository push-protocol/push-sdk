import * as PushAPI from '@pushprotocol/restapi';
import { Env } from '@pushprotocol/restapi';
import { useCallback, useState } from 'react';

interface conversationHashParams {
    account: string;
    env: Env;
    conversationId: string;
}

interface conversationHashResponseType {
  threadHash: string;
}

const useGetConversationHash = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const getConversationHash = useCallback(
    async ({ conversationId,account,env }: conversationHashParams) => {
      setLoading(true);
      try {
        const response = await PushAPI.chat.conversationHash({
          conversationId,
          account: account,
          env: env
        });
        setLoading(false);
        return response;
      } catch (error: Error | any) {
        setLoading(false);
        setError(error.message);
        console.log(error);
        return;
      }
    },
    []
  );
  return { getConversationHash, error, loading };
};

export default useGetConversationHash;
