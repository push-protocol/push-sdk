import * as PushAPI from '@pushprotocol/restapi';
import { useCallback, useContext, useState } from 'react';
import { useChatData } from './useChatData';

interface ApproveChatParams {
  chatId: string;
}

const useApproveChatRequest = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const { account, env,pgpPrivateKey } =useChatData();
  const approveChatRequest = useCallback(async (options:ApproveChatParams) => {
    const {

        chatId,
      } = options || {};
      setLoading(true);
      try {
        console.log(account)
        const response = await PushAPI.chat.approve({
          status: 'Approved',
          account: account,
          senderAddress: chatId,            // receiver's address or chatId of a group
          pgpPrivateKey:pgpPrivateKey,
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
    []
  );

  return { approveChatRequest, error, loading };
};

export default useApproveChatRequest;
