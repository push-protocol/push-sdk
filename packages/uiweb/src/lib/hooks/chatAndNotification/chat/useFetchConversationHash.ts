import * as PushAPI from '@pushprotocol/restapi';
import { Env } from '@pushprotocol/restapi';
import { useCallback, useContext, useState } from 'react';
import { Constants } from '../../../config';
import { ChatAndNotificationPropsContext } from '../../../context';

interface conversationHashParams {
    conversationId: string;
}

const useGetConversationHash = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const { account, env } =
  useContext<any>(ChatAndNotificationPropsContext);

  const getConversationHash = useCallback(
    async ({ conversationId }: conversationHashParams) => {
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
