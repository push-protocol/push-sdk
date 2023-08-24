import * as PushAPI from '@pushprotocol/restapi';
import { useCallback, useContext, useState } from 'react';
import useVerifyAccessControl from './useVerifyAccessControl';
import { useChatData } from '..';
import { ENV } from '../../config';
import { setAccessControl } from '../../helpers';

interface SendMessageParams {
  message: string;
  chatId: string;
  messageType?: 'Text' | 'Image' | 'File' | 'GIF' | 'MediaEmbed';
}

const usePushSendMessage = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const { verificationSuccessfull, setVerificationSuccessfull, setVerified } =
    useVerifyAccessControl();
  const { pgpPrivateKey, env, account } = useChatData();

  const sendMessage = useCallback(
    async (options: SendMessageParams) => {
      const { chatId, message, messageType } = options || {};
      setLoading(true);
      try {
        const response = await PushAPI.chat.send({
          messageContent: message,
          messageType: messageType,
          receiverAddress: chatId,
          account: account ? account : undefined,
          pgpPrivateKey: pgpPrivateKey ? pgpPrivateKey : undefined,
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
        return error.message;
      }
    },
    [pgpPrivateKey, account]
  );

  return { sendMessage, error, loading };
};

export default usePushSendMessage;
