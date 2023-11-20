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
    connectedProfile,
    setConnectedProfile,
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
    console.log('addSocketEvents');
    // if (!stre/z
    stream.on(CONSTANTS.STREAM.CONNECT, () => {
      // console.log(err,"errr");
      // console.log(connected,"connected");÷
      console.log('connecteddddd');
      setIsPushChatSocketConnected(true);
    })

    stream.on(CONSTANTS.STREAM.DISCONNECT, (reason: string) => {
      setIsPushChatSocketConnected(false);
    });

    stream.on(CONSTANTS.STREAM.CHAT, async (chat: any) => {
      console.log('chat', chat);
      if (
        (chat.messageCategory === 'Request') &&
        (chat.messageContent === null) &&
        (chat.messageType === null)
      ) {
        setAcceptedRequestMessage(chat);
      } else {
        // Extract 'from' and 'to' from the 'message' property
        const fromDID = chat.from;
        const toDID = chat.to.join(', '); // Use the appropriate separator if needed
        // Create a new object with modified properties
        const messageContent = chat.message.content;
        const modifiedChat = {
          ...chat,
          fromDID: fromDID,
          toDID: toDID,
          messageContent: messageContent,
        };
        delete modifiedChat.from;
        delete modifiedChat.to;
        console.log('modifiedChat', modifiedChat);

        setMessagesSinceLastConnection((chats: any) => {
          return modifiedChat;
        });
      }
    });


    // pushChatSocket?.on(EVENTS.CHAT_GROUPS, (groupInfo: any) => {
    //   /**
    //    * We receive a group creation or updated event.
    //    */
    //   setGroupInformationSinceLastConnection(groupInfo);
    // });

    // eslint-disable-next-line react-hooks/exhaustive-deps
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
