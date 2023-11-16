import { useCallback,  useState } from 'react';
import { useChatData } from '..';


interface SendMessageParams {
  message: string;
  chatId: string;
  messageType?: 'Text' | 'Image' | 'File' | 'GIF' | 'MediaEmbed';
}

const usePushSendMessage = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const { env, account, pushUser } = useChatData();

  const sendMessage = useCallback(
    async (options: SendMessageParams) => {
      const { chatId, message, messageType } = options || {};
      setLoading(true);
      try {
        const response = await pushUser.chat.send(chatId, {
          type: messageType,
          content: message,
        })
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
    [ account, env, pushUser]
  );

  return { sendMessage, error, loading };
};

export default usePushSendMessage;