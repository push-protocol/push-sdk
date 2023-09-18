import * as PushAPI from '@pushprotocol/restapi';
import { Env } from '@pushprotocol/restapi';
import { useCallback, useContext, useState } from 'react';
import { useChatData } from './useChatData';

interface conversationHashParams {
  conversationId: string;
}

const useFetchConversationHash = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const { account, env } = useChatData();

  const fetchConversationHash = useCallback(
    async ({ conversationId }: conversationHashParams) => {
      setLoading(true);
      try {
        const response = await PushAPI.chat.conversationHash({
          conversationId,
          account: account!,
          env: env,
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
    [env, account]
  );
  return { fetchConversationHash, error, loading };
};

export default useFetchConversationHash;
