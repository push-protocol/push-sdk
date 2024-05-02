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
  const [verificationSuccessfull, setVerificationSuccessfull] = useState<boolean>(true);
  const [verified, setVerified] = useState<boolean>(false);

  const { user } = useChatData();

  const verifyAccessControl = useCallback(
    async (options: VerifyAccessControlParams) => {
      const { chatId, did } = options || {};
      setLoading(true);
      try {
        const response = await user?.chat.group.permissions(chatId);
        setLoading(false);
        if (response?.chat === false || response?.entry === false) {
          setVerificationSuccessfull(false);
        } else if (response?.chat === true) {
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
    [user]
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
