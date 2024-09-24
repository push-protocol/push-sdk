import * as PushAPI from '@pushprotocol/restapi';
import { useCallback, useContext, useState } from 'react';
import { useChatData } from '..';
import { ENV } from '../../config';
import { setAccessControl } from '../../helpers';
import useVerifyAccessControl from './useVerifyAccessControl';

interface SendMessageParams {
  message: string;
  chatId: string;
  messageType?: 'Text' | 'Image' | 'File' | 'GIF' | 'MediaEmbed' | 'Reply';
  replyRef?: string;
}

const usePushSendMessage = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const { user } = useChatData();

  const sendMessage = useCallback(
    async (options: SendMessageParams) => {
      const { chatId, message, messageType, replyRef } = options || {};
      setLoading(true);

      const messagePayload: any = {
        type: messageType,
        content: message,
      };

      if (replyRef !== undefined) {
        messagePayload.type = 'Reply';
        messagePayload.content = {
          type: messageType,
          content: message,
        };
        messagePayload.reference = replyRef;
      }
      console.log(messagePayload);

      try {
        const response = await user?.chat.send(chatId, messagePayload);
        setLoading(false);
        if (!response) {
          return false;
        }
        return response;
      } catch (error: Error | any) {
        setLoading(false);
        setError(error.message);
        console.log(error);
        return error.message;
      }
    },
    [user]
  );

  return { sendMessage, error, loading };
};

export default usePushSendMessage;
