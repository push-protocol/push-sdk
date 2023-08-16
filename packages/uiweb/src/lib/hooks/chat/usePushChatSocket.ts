import { createSocketConnection, EVENTS } from '@pushprotocol/socket';
import { useCallback, useEffect, useState } from 'react';
import { ENV } from '../../config';
import * as PushAPI from '@pushprotocol/restapi';
import type { IMessageIPFS } from '@pushprotocol/restapi';
import { isAccountsEqual } from '../../components/space/helpers/account';
import { useChatData } from './useChatData';
import { SOCKET_TYPE } from '../../types';
import { getChatId } from '../../helpers';

export type PushChatSocketHookOptions = {
  account?: string | null;
  env?: ENV;
};

export const usePushChatSocket = () => {
  const {
    account,
    pgpPrivateKey,
    pushChatSocket,
    setPushChatSocket,
    setIsPushChatSocketConnected,
    isPushChatSocketConnected,
    connectedProfile,
    env,
  } = useChatData();

  const [messagesSinceLastConnection, setMessagesSinceLastConnection] =
    useState<any>({});
  const [
    groupInformationSinceLastConnection,
    setGroupInformationSinceLastConnection,
  ] = useState<any>({});

  // useEffect(() => {
  //   // console.log(pgpPrivateKey, "pgppppppppp")
  //   // console.log(connectedProfile, "connectedProfileeeeeeeee")
  // }, [pgpPrivateKey, connectedProfile])

  const addSocketEvents = useCallback(() => {
    console.log('addSocketEvents');
    pushChatSocket?.on(EVENTS.CONNECT, () => {
      setIsPushChatSocketConnected(true);
    });

    pushChatSocket?.on(EVENTS.DISCONNECT, (reason: string) => {
      setIsPushChatSocketConnected(false);
    });

    pushChatSocket?.on(EVENTS.CHAT_RECEIVED_MESSAGE, async (chat: any) => {
      console.log(chat)
      console.log(connectedProfile)
      console.log(pgpPrivateKey)
      if (!connectedProfile || !pgpPrivateKey) {
        return;
      }
      console.log(chat)
      if (
       ( chat.messageCategory === 'Request') &&
        (chat.messageContent === null) &&
        (chat.messageType === null)
      ) {
        return;
      }
      console.log(chat)
      const response = await PushAPI.chat.decryptConversation({
        messages: [chat],
        connectedUser: connectedProfile,
        pgpPrivateKey: pgpPrivateKey,
        env: env,
      });
      console.log(chat)

      if (response && response.length) {
        setMessagesSinceLastConnection(response[0]);
      }
    });
    pushChatSocket?.on(EVENTS.CHAT_GROUPS, (groupInfo: any) => {
      /**
       * We receive a group creation or updated event.
       */
      setGroupInformationSinceLastConnection(groupInfo);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pushChatSocket,
    account,
    pgpPrivateKey,
    messagesSinceLastConnection,
    env,
    connectedProfile,
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
  }, [pushChatSocket, pgpPrivateKey, connectedProfile]);

  /**
   * Whenever the required params to create a connection object change
   *  - disconnect the old connection
   *  - create a new connection object
   */
  useEffect(() => {
    if (account) {
      if (pushChatSocket && pushChatSocket.connected) {
        // pushChatSocket?.disconnect();
      } else {
        const main = async () => {
          const connectionObject = createSocketConnection({
            user: account,
            env,
            socketType: SOCKET_TYPE.CHAT,
            socketOptions: { autoConnect: true, reconnectionAttempts: 3 },
          });
          console.warn('new connection object: ', connectionObject);

          setPushChatSocket(connectionObject);
        };
        main().catch((err) => console.error(err));
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, env]);

  return {
    pushChatSocket,
    isPushChatSocketConnected,
    messagesSinceLastConnection,
    groupInformationSinceLastConnection,
  };
};
