import * as PushAPI from '@pushprotocol/restapi';
import { useCallback, useContext, useState } from 'react';
import { ChatAndNotificationPropsContext } from '../../context';

interface ApproveChatParams {
  senderAddress: string;
}

const useApproveChatRequest = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const { account, env,decryptedPgpPvtKey } =
  useContext<any>(ChatAndNotificationPropsContext);
  const approveChatRequest = useCallback(async (options:ApproveChatParams) => {
    const {

        senderAddress,
      } = options || {};
      setLoading(true);
      try {
        const response = await PushAPI.chat.approve({
          status: 'Approved',
          account: account,
          senderAddress: senderAddress,            // receiver's address or chatId of a group
          pgpPrivateKey:decryptedPgpPvtKey,
          env: env,
        });
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
