import type { IFeeds, IMessageIPFS } from '@pushprotocol/restapi';
import * as PushAPI from '@pushprotocol/restapi';
import { createSocketConnection, EVENTS } from '@pushprotocol/socket';
import { useCallback, useContext, useEffect, useState } from 'react';
import { ChatMainStateContext, ChatPropsContext } from '../../context';
import { ChatMainStateContextType } from '../../context/chat/chatMainStateContext';
import { checkIfIntent, isPCAIP, pCAIP10ToWallet } from '../../helpers';

import useFetchChat from './useFetchChat';

const CHAT_SOCKET_TYPE = 'chat';

interface PushChatSocket {
  isSDKSocketConnected: boolean;
  messagesSinceLastConnection: any; // replace any with the actual type of messages
  groupInformationSinceLastConnection: any; // replace any with the actual type of group information
}

const usePushChatSocket = (): PushChatSocket => {
  const [isSDKSocketConnected, setIsSDKSocketConnected] =
    useState<boolean>(false);
  const [messagesSinceLastConnection, setMessagesSinceLastConnection] =
    useState<any>('');
  const [
    groupInformationSinceLastConnection,
    setGroupInformationSinceLastConnection,
  ] = useState<any>('');
  const { fetchChat } = useFetchChat();
  const { account, env, decryptedPgpPvtKey } =
    useContext<any>(ChatPropsContext);
  const {
    chats,
    setChat,
    chatsFeed,
    connectedProfile,
    setChatFeed,
    setRequestFeed,
    requestsFeed,
    pushChatSocket,
    setPushChatSocket,
  } = useContext<ChatMainStateContextType>(ChatMainStateContext);

  const addSocketEvents = useCallback(() => {
    pushChatSocket?.on(EVENTS.CONNECT, () => {
      setIsSDKSocketConnected(true);
    });

    pushChatSocket?.on(EVENTS.DISCONNECT, (err: any) => {
      console.log(err);
      setIsSDKSocketConnected(false);
    });

    pushChatSocket?.on(
      EVENTS.CHAT_RECEIVED_MESSAGE,
      async (chat: IMessageIPFS) => {
        console.log(chat);
        if (!connectedProfile || !decryptedPgpPvtKey) {
          return;
        }
        if (
          pCAIP10ToWallet(chat.fromDID).toLowerCase() === account.toLowerCase()
        ) {
          return;
        }
        const response = await PushAPI.chat.decryptConversation({
          messages: [chat],
          connectedUser: connectedProfile,
          pgpPrivateKey: decryptedPgpPvtKey,
          env: env,
        });
      
        if (response && response.length) {
          console.log('in here chat');
          const msg = response[0];
          const chatId = !isPCAIP(msg.toDID) ? msg.toDID : msg.fromDID;

          if (chatsFeed[chatId]) {
            const newOne: IFeeds = chatsFeed[chatId];
            console.log('in chtsfeed');
            setChat(chatId, {
              messages: Array.isArray(chats.get(chatId)?.messages)
                ? [...chats.get(chatId)!.messages, msg]
                : [msg],
              lastThreadHash: chats.get(chatId)?.lastThreadHash ?? msg.link,
            });
            newOne['msg'] = msg;
            setChatFeed(chatId, newOne);
          } else if (requestsFeed[chatId]) {
            console.log('in here  existing request');
            const newOne: IFeeds = requestsFeed[chatId];
            setChat(chatId, {
              messages: Array.isArray(chats.get(chatId)?.messages)
                ? [...chats.get(chatId)!.messages, msg]
                : [msg],
              lastThreadHash: chats.get(chatId)?.lastThreadHash ?? msg.link,
            });

            newOne['msg'] = msg;
            console.log(newOne);
            setRequestFeed(chatId, newOne);
          } else {
            console.log('in here request');
            const fetchedChat: IFeeds = (await fetchChat({
              recipientAddress: chatId,
            })) as IFeeds;
            console.log(fetchedChat);
            if (checkIfIntent({ chat: fetchedChat, account }))
              setRequestFeed(chatId, fetchedChat);
            else setChatFeed(chatId, fetchedChat);
            setChat(chatId, {
              messages: Array.isArray(chats.get(chatId)?.messages)
                ? [...chats.get(chatId)!.messages, msg]
                : [msg],
              lastThreadHash: chats.get(chatId)?.lastThreadHash ?? msg.link,
            });
          }
        }
        setMessagesSinceLastConnection(chat);
      }
    );

    pushChatSocket?.on(EVENTS.CHAT_GROUPS, (groupInfo: any) => {
      console.log(groupInfo);
      setGroupInformationSinceLastConnection(groupInfo);
    });
  }, [
    pushChatSocket,
    decryptedPgpPvtKey,
    chatsFeed,
    requestsFeed,
    setChat,
    chats,
    setChatFeed,
    setRequestFeed,
    fetchChat,
  ]);

  const removeSocketEvents = useCallback(() => {
    pushChatSocket?.off(EVENTS.CONNECT);
    pushChatSocket?.off(EVENTS.DISCONNECT);
    pushChatSocket?.off(EVENTS.CHAT_GROUPS);
    pushChatSocket?.off(EVENTS.CHAT_RECEIVED_MESSAGE);
  }, [pushChatSocket]);

  useEffect(() => {
    if (pushChatSocket) {
      addSocketEvents();
    }

    return () => {
      if (pushChatSocket) {
        removeSocketEvents();
      }
    };
  }, [addSocketEvents, pushChatSocket, removeSocketEvents]);

  /**
   * Whenever the required params to create a connection object change
   *  - disconnect the old connection
   *  - create a new connection object
   */
  useEffect(() => {
    if (decryptedPgpPvtKey) {
      if (pushChatSocket) {
        pushChatSocket?.disconnect();
      }

      console.log('in socket connection');

      // this is auto-connect on instantiation
      const connectionObject = createSocketConnection({
        user: account, // change to normal account after backend is corrected for lowercase
        socketType: CHAT_SOCKET_TYPE,
        env: env,
      });
      console.log(connectionObject);
      setPushChatSocket(connectionObject);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decryptedPgpPvtKey]);

  return {
    isSDKSocketConnected,
    messagesSinceLastConnection,
    groupInformationSinceLastConnection,
  };
};

export default usePushChatSocket;
