import type { IFeeds } from '@pushprotocol/restapi';
import * as PushAPI from '@pushprotocol/restapi';
import { createSocketConnection, EVENTS } from '@pushprotocol/socket';
import { useCallback, useContext, useEffect, useState } from 'react';
import {
  ChatMainStateContext,
  ChatAndNotificationPropsContext,
  NotificationMainStateContext,
} from '../../context';
import type { ChatMainStateContextType } from '../../context/chatAndNotification/chat/chatMainStateContext';
import {
  checkIfIntent,
  getChatId,
  isPCAIP,

  setData,
} from '../../helpers';
import {
  convertAddressToAddrCaip,
  convertReponseToParsedArray,
} from '../../helpers/notification';
import type { SocketType } from '../../types';
import { SOCKET_TYPE } from '../../types';

import useFetchChat from './chat/useFetchChat';
import useGetChatProfile from '../useGetChatProfile';

interface PushChatNotificationSocket {
  pushChatNotificationSocket: any;
  isSDKSocketConnected: boolean;
  messagesSinceLastConnection: any;
  groupInformationSinceLastConnection: any;
  notificationFeedSinceLastConnection: any; //add type
}

export type pushChatNotificationSocketType = {
  socketType?: SocketType;
};

const useChatNotificationSocket = ({
  socketType = SOCKET_TYPE.NOTIFICATION,
}: pushChatNotificationSocketType): PushChatNotificationSocket => {
  const [isSDKSocketConnected, setIsSDKSocketConnected] =
    useState<boolean>(false);
  const [messagesSinceLastConnection, setMessagesSinceLastConnection] =
    useState<any>('');
  const [
    groupInformationSinceLastConnection,
    setGroupInformationSinceLastConnection,
  ] = useState<any>('');
  const [
    notificationFeedSinceLastConnection,
    setNotificationFeedSinceLastConnection,
  ] = useState<any>('');
  const { fetchChat } = useFetchChat();
  const { account, env, decryptedPgpPvtKey, signer } = useContext<any>(
    ChatAndNotificationPropsContext
  );
  const {
    chats,
    setChat,
    chatsFeed,
    connectedProfile,
    setChatFeed,
    setRequestFeed,
    requestsFeed,
    selectedChatId,
  } = useContext<ChatMainStateContextType>(ChatMainStateContext);
  const { fetchChatProfile } = useGetChatProfile();
  const { subscriptionStatus, setInboxNotifFeed, setSpamNotifFeed } =
    useContext<any>(NotificationMainStateContext);
  const [pushChatNotificationSocket, setPushChatNotificationSocket] =
    useState<any>(null);
  const addSocketEvents = useCallback(() => {
    pushChatNotificationSocket?.on(EVENTS.CONNECT, () => {
      setIsSDKSocketConnected(true);
    });

    pushChatNotificationSocket?.on(EVENTS.DISCONNECT, (err: any) => {
      console.log(err);
      setIsSDKSocketConnected(false);
    });

    pushChatNotificationSocket?.on(EVENTS.USER_FEEDS, (feedItem: any) => {
      const parseApiResponse = convertReponseToParsedArray([feedItem]);
      if (subscriptionStatus.get(parseApiResponse[0].channel)) {
        setInboxNotifFeed(
          `notif${parseApiResponse[0].sid}`,
          parseApiResponse[0]
        );
      } else
        setSpamNotifFeed(
          `notif${parseApiResponse[0].sid}`,
          parseApiResponse[0]
        );

      setNotificationFeedSinceLastConnection(feedItem);
    });

    pushChatNotificationSocket?.on(
      EVENTS.CHAT_RECEIVED_MESSAGE,
      async (chat: any) => {
        if (!connectedProfile || !decryptedPgpPvtKey) {
          return;
        }
        const chatId = getChatId({ msg: chat, account }).toLowerCase();
        if (!isPCAIP(chatId)) return;
        if (
          chat.messageCategory === 'Request' &&
          chat.messageContent === null &&
          chat.messageType === null
        ) {
          if (chat.messageOrigin === 'other') {
            const user = await fetchChatProfile({ profileId: chatId,env });

            if (user || Object.keys(user || {}).length) {
              let newOne: IFeeds = {} as IFeeds;
              newOne = chatsFeed[chatId];
              newOne['publicKey'] = user!.publicKey;

              setChatFeed(chatId, newOne);
            }
          }
          return;
        }

        const response = await PushAPI.chat.decryptConversation({
          messages: [chat],
          connectedUser: connectedProfile,
          pgpPrivateKey: decryptedPgpPvtKey,
          env: env,
        });

        if (response && response.length) {
          const msg = response[0];
          let newOne: IFeeds = {} as IFeeds;
          if (chatsFeed[chatId]) {
            newOne = chatsFeed[chatId];
            setChat(chatId, {
              messages: Array.isArray(chats.get(chatId)?.messages)
                ? [...chats.get(chatId)!.messages, msg]
                : [msg],
              lastThreadHash: chats.get(chatId)?.lastThreadHash ?? msg.link,
            });
            newOne['msg'] = msg;

            setChatFeed(chatId, newOne);
          } else if (requestsFeed[chatId]) {
            newOne = requestsFeed[chatId];
            setChat(chatId, {
              messages: Array.isArray(chats.get(chatId)?.messages)
                ? [...chats.get(chatId)!.messages, msg]
                : [msg],
              lastThreadHash: chats.get(chatId)?.lastThreadHash ?? msg.link,
            });

            newOne['msg'] = msg;
            setRequestFeed(chatId, newOne);
          } else {
            const fetchedChat: IFeeds = (await fetchChat({
              recipientAddress: chatId,
            })) as IFeeds;
            console.log(chatId);
            if (
              Object.keys(fetchedChat || {}).length &&
              checkIfIntent({ chat: fetchedChat, account })
            )
              setRequestFeed(chatId, fetchedChat);
            else setChatFeed(chatId, fetchedChat);
            console.log('in here');
            console.log(msg);
            setChat(chatId, {
              messages: Array.isArray(chats.get(chatId)?.messages)
                ? [...chats.get(chatId)!.messages, msg]
                : [msg],
              lastThreadHash: chats.get(chatId)?.lastThreadHash ?? msg.link,
            });
          }
          if (selectedChatId === chatId) {
            setData({ chatId: chatId, value: newOne });
          }
        }
        setMessagesSinceLastConnection(chat);
      }
    );

    pushChatNotificationSocket?.on(EVENTS.CHAT_GROUPS, (groupInfo: any) => {
      setGroupInformationSinceLastConnection(groupInfo);
    });
  }, [
    pushChatNotificationSocket,
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
    pushChatNotificationSocket?.off(EVENTS.CONNECT);
    pushChatNotificationSocket?.off(EVENTS.DISCONNECT);
    pushChatNotificationSocket?.off(EVENTS.CHAT_GROUPS);
    pushChatNotificationSocket?.off(EVENTS.CHAT_RECEIVED_MESSAGE);
  }, [pushChatNotificationSocket]);

  useEffect(() => {
    if (pushChatNotificationSocket) {
      addSocketEvents();
    }

    return () => {
      if (pushChatNotificationSocket) {
        removeSocketEvents();
      }
    };
  }, [addSocketEvents, pushChatNotificationSocket, removeSocketEvents]);

  /**
   * Whenever the required params to create a connection object change
   *  - disconnect the old connection
   *  - create a new connection object
   */
  useEffect(() => {
    if (decryptedPgpPvtKey) {
      if (pushChatNotificationSocket) {
        pushChatNotificationSocket?.disconnect();
      }
      let chainId = 1;
      (async () => {
        chainId = await signer?.getChainId();
      })();
      // this is auto-connect on instantiation
      const connectionObject = createSocketConnection({
        user:
          socketType === SOCKET_TYPE.CHAT
            ? account
            : convertAddressToAddrCaip(account, chainId),
        socketType,
        env: env,
      });
      setPushChatNotificationSocket(connectionObject);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decryptedPgpPvtKey, env]);

  return {
    pushChatNotificationSocket,
    isSDKSocketConnected,
    messagesSinceLastConnection,
    groupInformationSinceLastConnection,
    notificationFeedSinceLastConnection,
  };
};

export default useChatNotificationSocket;
