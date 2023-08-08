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
    decryptedPgpPvtKey,
    pushChatSocket,
    setPushChatSocket,
    setIsPushChatSocketConnected,
    isPushChatSocketConnected,
    connectedProfile,
    env
  } = useChatData();

  const [messagesSinceLastConnection,setMessagesSinceLastConnection] = useState<any>({});
  const addSocketEvents = useCallback(() => {
    console.log('addSocketEvents');
    pushChatSocket?.on(EVENTS.CONNECT, () => {
      setIsPushChatSocketConnected(true);
    });

    pushChatSocket?.on(EVENTS.DISCONNECT, (reason: string) => {
      // console.log("space socket disconnected", reason);
      setIsPushChatSocketConnected(false);
    });


    pushChatSocket?.on(
        EVENTS.CHAT_RECEIVED_MESSAGE,
        async (chat: any) => {
         console.log(chat)
         if (!connectedProfile || !decryptedPgpPvtKey) {
            return;
          }
        //   const chatId = getChatId({ msg: chat, account:account! }).toLowerCase();
          if (
            chat.messageCategory === 'Request' &&
            chat.messageContent === null &&
            chat.messageType === null
          ) {
            return;
          }
console.log(connectedProfile)
console.log(chat)
console.log(env)
console.log(decryptedPgpPvtKey)
          const response = await PushAPI.chat.decryptConversation({
            messages: [chat],
            connectedUser: connectedProfile,
            pgpPrivateKey: decryptedPgpPvtKey,
            env: env,
          });
          if (response && response.length) {
            setMessagesSinceLastConnection(chat);
          }
        }
      );

 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pushChatSocket,
    account,
    messagesSinceLastConnection,
    env,

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
  }, [pushChatSocket]);

  /**
   * Whenever the required params to create a connection object change
   *  - disconnect the old connection
   *  - create a new connection object
   */
  useEffect(() => {
    if (account) {
      if (pushChatSocket && pushChatSocket.connected) {
        // console.log('=================>>> disconnection in the hook');
        // pushChatSocket?.disconnect();
      }
      else {
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

  useEffect(() => {
    console.log('isPushChatSocketConnected', isPushChatSocketConnected);
  }, [isPushChatSocketConnected]);

  return {
    pushChatSocket,
    isPushChatSocketConnected,
    messagesSinceLastConnection
  };
};
