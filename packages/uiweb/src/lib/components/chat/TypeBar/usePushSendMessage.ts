import * as PushAPI from '@pushprotocol/restapi';
import { Env, IFeeds } from '@pushprotocol/restapi';
import { useCallback, useContext, useState } from 'react';
import { Constants } from '../../../config';
import {
  ChatMainStateContext,
  ChatAndNotificationPropsContext,
} from '../../../context';
import type { ChatMainStateContextType } from '../../../context/chatAndNotification/chat/chatMainStateContext';
import { SendMessageParams } from '../exportedTypes';
import { useChatData } from '../../../hooks';

const usePushSendMessage = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const { setChatFeed, setChat, chatsFeed, chats, selectedChatId } =
    useContext<ChatMainStateContextType>(ChatMainStateContext);
  const { pgpPrivateKey, env, account } = useChatData();

  const sendMessage = useCallback(
    async (options: SendMessageParams) => {
      const { receiver, message, messageType } = options || {};
      setLoading(true);
      try {
        const response = await PushAPI.chat.send({
          messageContent: message,
          messageType: messageType,
          receiverAddress: receiver,
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
        return;
      }
    },
    [pgpPrivateKey, setChat, selectedChatId, chats]
  );

  return { sendMessage, error, loading };
};

export default usePushSendMessage;
