import * as PushAPI from '@pushprotocol/restapi';
import { useCallback, useState } from 'react';
import { ENV } from '../../config';
import { useChatData } from './useChatData';

interface VerifyAccessControlParams {
  chatId: string;
  did: string;
}

const useVerifyAccessControl = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const { pgpPrivateKey, env, account } = useChatData();

  const verifyAccessControl = useCallback(
    async (options: VerifyAccessControlParams) => {
      const { chatId, did } = options || {};
      setLoading(true);
      try {
        const response = await PushAPI.chat.getGroupAccess({
          chatId: chatId,
          did: did,
          env: env,
        });
        setLoading(false);
        if (!response) {
          return false;
        }
        return;
      } catch (error: Error | any) {
        setLoading(false);
        setError(error.message);
        console.log(error);
        return;
      }
    },
    [pgpPrivateKey, account]
  );
  return {verifyAccessControl, error, loading};
};

export default useVerifyAccessControl;