import { createSocketConnection, EVENTS } from '@pushprotocol/socket';
import { useCallback, useEffect, useState } from 'react';
import { ENV } from '../../config';
import { useChatData } from './useChatData';
import { SOCKET_TYPE } from '../../types';
import { CONSTANTS } from '@pushprotocol/restapi';

export type PushChatSocketHookOptions = {
  account?: string | null;
  env?: ENV;
};

export const usePushChatSocket = () => {
  const {
    account,
    pushChatSocket,
    setPushChatSocket,
    setIsPushChatSocketConnected,
    isPushChatSocketConnected,
    env,
    pushUser
  } = useChatData();
  const [messagesSinceLastConnection, setMessagesSinceLastConnection] =
    useState<any>({});
  const [acceptedRequestMessage, setAcceptedRequestMessage] =
    useState<any>({});
  const [stream, setStream] = useState<any>();
  const [
    groupInformationSinceLastConnection,
    setGroupInformationSinceLastConnection,
  ] = useState<any>({});

  const addSocketEvents = useCallback(async () => {
    stream.on(CONSTANTS.STREAM.CONNECT, () => {
      setIsPushChatSocketConnected(true);
    })

    stream.on(CONSTANTS.STREAM.DISCONNECT, (reason: string) => {
      setIsPushChatSocketConnected(false);
    });

    stream.on(CONSTANTS.STREAM.CHAT, async (chat: any) => {
      if (
        (chat.messageCategory === 'Request') &&
        (chat.messageContent === null) &&
        (chat.messageType === null)
      ) {
        setAcceptedRequestMessage(chat);
      } else {
        const fromCAIP10 = chat.from;
        const toCAIP10 = chat.to.join(', ');
        const messageContent = chat.message ? chat.message.content : ''; 
        const modifiedChat = {
          ...chat,
          fromCAIP10: fromCAIP10,
          toCAIP10: toCAIP10,
          messageContent: messageContent,
        };
        delete modifiedChat.from;
        delete modifiedChat.to;

        setMessagesSinceLastConnection((chats: any) => {
          return modifiedChat;
        });
      }
    });
  }, [
    messagesSinceLastConnection,
    env,
    pushUser,
    stream
  ]);

  const removeSocketEvents = useCallback(() => {
    stream?.disconnect();
  }, [stream]);

  useEffect(() => {
    if (stream) {
      addSocketEvents();
    }

    return () => {
      if (stream) {
        removeSocketEvents();
      }
    };
  }, [stream, pushUser]);

  /**
   * Whenever the required params to create a connection object change
   *  - disconnect the old connection
   *  - create a new connection object
   */
  useEffect(() => {
    if (!stream) {
      const main = async () => {

        const stream = await pushUser?.initStream(
          [
            CONSTANTS.STREAM.CHAT,
          ],
          {}
        );
        setStream(stream);
        await stream?.connect();
        console.warn('new connection object: ', stream);
      };
      main().catch((err) => console.error(err));
    }
    // }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pushUser, env, stream]);

  return {
    isPushChatSocketConnected,
    messagesSinceLastConnection,
    acceptedRequestMessage,
    groupInformationSinceLastConnection,
  };
};
