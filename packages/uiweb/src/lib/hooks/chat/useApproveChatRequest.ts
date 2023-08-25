import * as PushAPI from '@pushprotocol/restapi';
import { useCallback, useContext, useState } from 'react';
import { useChatData } from './useChatData';

interface ApproveChatParams {
  chatId: string;
}

const useApproveChatRequest = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const { account, env,pgpPrivateKey,signer } =useChatData();
  const approveChatRequest = useCallback(async (options:ApproveChatParams) => {
    const {

        chatId,
      } = options || {};
      setLoading(true);
      try {
        const response = await PushAPI.chat.approve({
          status: 'Approved',
          account: account,
          senderAddress: chatId, 
          signer:signer,           // receiver's address or chatId of a group
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
    [account,env,signer,pgpPrivateKey]
  );

  return { approveChatRequest, error, loading };
};

export default useApproveChatRequest;
