import * as PushAPI from '@pushprotocol/restapi';
import { useCallback, useContext, useState } from 'react';
import { useChatData } from './useChatData';

interface RejectChatParams {
  chatId: string;
}

const useRejectChatRequest = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useChatData();

  const rejectChatRequest = useCallback(
    async (options: RejectChatParams) => {
      const { chatId } = options || {};
      setLoading(true);
      try {
        const response = await user?.chat.reject(chatId);

        setLoading(false);
        return response;

        // To test false response
        // return new Promise((resolve) => {
        //   setTimeout(() => {
        //     setLoading(false);
        //     resolve({ status: 200, message: 'OK' });
        //   }, 4000);
        // });
      } catch (error: Error | any) {
        setLoading(false);
        setError(error.message);
        console.log(error);
        return;
      }
    },

    [user]
  );

  return { rejectChatRequest, error, loading };
};

export default useRejectChatRequest;
