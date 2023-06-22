import type { IFeeds, IMessageIPFS } from '@pushprotocol/restapi';
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
  getData,
  isPCAIP,
  pCAIP10ToWallet,
  setData,
} from '../../helpers';
import {
  convertAddressToAddrCaip,
  convertReponseToParsedArray,
} from '../../helpers/notification';
import { ChatSocketType, CHAT_SOCKET_TYPE } from '../../types';

import useFetchChat from './useFetchChat';

interface PushChatSocket {
  pushChatSocket: any;
  isSDKSocketConnected: boolean;
  messagesSinceLastConnection: any;
  groupInformationSinceLastConnection: any;
  notificationFeedSinceLastConnection: any; //add type
}

export type pushChatSocketType = {
  socketType?: ChatSocketType;
};

const getChatId = ({
  msg,
  account,
}: {
  msg: IMessageIPFS;
  account: string;
}) => {
  if (pCAIP10ToWallet(msg.fromDID).toLowerCase() === account.toLowerCase()) {
    return msg.toDID;
  }
  return !isPCAIP(msg.toDID) ? msg.toDID : msg.fromDID;
};

const usePushChatSocket = ({
  socketType = CHAT_SOCKET_TYPE.NOTIFICATION,
}: pushChatSocketType): PushChatSocket => {
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
    pushChatSocket,
    setPushChatSocket,
  } = useContext<ChatMainStateContextType>(ChatMainStateContext);
  const { subscriptionStatus, setInboxNotifFeed, setSpamNotifFeed } =
    useContext<any>(NotificationMainStateContext);

  const addSocketEvents = useCallback(() => {
    pushChatSocket?.on(EVENTS.CONNECT, () => {
      setIsSDKSocketConnected(true);
    });

    pushChatSocket?.on(EVENTS.DISCONNECT, (err: any) => {
      console.log(err);
      setIsSDKSocketConnected(false);
    });

    pushChatSocket?.on(EVENTS.USER_FEEDS, (feedItem: any) => {
      const parseApiResponse = convertReponseToParsedArray([feedItem]);
      if (subscriptionStatus.get(parseApiResponse[0].channel))
        setInboxNotifFeed(parseApiResponse[0].sid, parseApiResponse[0]);
      else setSpamNotifFeed(parseApiResponse[0].sid, parseApiResponse[0]);

      setNotificationFeedSinceLastConnection(feedItem);
    });

    pushChatSocket?.on(EVENTS.CHAT_RECEIVED_MESSAGE, async (chat: any) => {
      if (!connectedProfile || !decryptedPgpPvtKey) {
        return;
      }

      if (
        chat.messageCategory === 'Request' &&
        chat.messageContent === null &&
        chat.messageType === null &&
        chat.messageOrigin === 'self'
      )
        return;

      const response = await PushAPI.chat.decryptConversation({
        messages: [chat],
        connectedUser: connectedProfile,
        pgpPrivateKey: decryptedPgpPvtKey,
        env: env,
      });

      if (response && response.length) {
        const msg = response[0];
        const chatId = getChatId({ msg, account });
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
        if (selectedChatId === chatId) {
          setData({ chatId: chatId, value: newOne });
        }
      }
      setMessagesSinceLastConnection(chat);
    });

    pushChatSocket?.on(EVENTS.CHAT_GROUPS, (groupInfo: any) => {
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
      let chainId = 1;
      (async () => {
        chainId = await signer.getChainId();
      })();
      // this is auto-connect on instantiation
      const connectionObject = createSocketConnection({
        user:
          socketType === CHAT_SOCKET_TYPE.CHAT
            ? account
            : convertAddressToAddrCaip(account, chainId),
        socketType,
        env: env,
      });
      setPushChatSocket(connectionObject);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decryptedPgpPvtKey, env]);

  return {
    pushChatSocket,
    isSDKSocketConnected,
    messagesSinceLastConnection,
    groupInformationSinceLastConnection,
    notificationFeedSinceLastConnection,
  };
};

export default usePushChatSocket;
