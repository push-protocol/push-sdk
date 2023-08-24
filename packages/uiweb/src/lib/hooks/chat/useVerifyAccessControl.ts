import * as PushAPI from '@pushprotocol/restapi';
import { useCallback, useState } from 'react';
import { ENV } from '../../config';
import { useChatData } from './useChatData';
import { setAccessControl } from '../../helpers';

interface VerifyAccessControlParams {
  chatId: string;
  did: string;
}

const useVerifyAccessControl = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  console.log('in hereeeeeee');
  const [verificationSuccessfull, setVerificationSuccessfull] =
    useState<boolean>(true);
  const [verified, setVerified] = useState<boolean>(false);

  const { pgpPrivateKey, env, account } = useChatData();
  console.log(verificationSuccessfull);

  const verifyAccessControl = useCallback(
    async (options: VerifyAccessControlParams) => {
      const { chatId, did } = options || {};
      setLoading(true);
      try {
        const response = await PushAPI.chat.getGroupAccess({
          chatId: chatId,
          did: `eip155:${did}`,
          env: env,
        });
        setLoading(false);
        if (response.chatAccess === false) {
          setVerificationSuccessfull(false);
        } else if (response.chatAccess === true) {
          setVerified(true);
          setAccessControl(chatId, false);
        }
        if (!response) {
          return false;
        }
        return;
      } catch (error: Error | any) {
        setLoading(false);
        setVerificationSuccessfull(false);
        setError(error.message);
        console.log(error);
        return;
      }
    },
    [pgpPrivateKey, account,env]
  );

  return {
    verifyAccessControl,
    error,
    loading,
    verificationSuccessfull,
    setVerificationSuccessfull,
    verified,
    setVerified,
  };
};

export default useVerifyAccessControl;
