import { useEffect, useState } from 'react';
import {
  createSocketConnection,
  EVENTS
} from '@pushprotocol/socket';


export type SDKSocketHookOptions = {
  account?: string | null,
  env?: string,
  socketType?: 'chat' | 'notification',
  apiKey: string,
};

export const useSDKSocket = ({ account, env = '', socketType = 'chat',apiKey }: SDKSocketHookOptions) => {
  
  const [epnsSDKSocket, setEpnsSDKSocket] = useState<any>(null);
  const [messagesSinceLastConnection, setMessagesSinceLastConnection] = useState<any>(null);
  const [isSDKSocketConnected, setIsSDKSocketConnected] = useState(epnsSDKSocket?.connected);

  const addSocketEvents = () => {
    console.warn('\n--> addSocketEvents');
    epnsSDKSocket?.on(EVENTS.CONNECT, () => {
      console.log('CONNECTED: ');
      setIsSDKSocketConnected(true);
    });

    epnsSDKSocket?.on(EVENTS.DISCONNECT, () => {
      console.log('DIS-CONNECTED: ');
      setIsSDKSocketConnected(false);
    });
    console.log('\t-->will attach eachMessage event now');
    epnsSDKSocket?.on(EVENTS.CHAT_RECEIVED_MESSAGE, (chat: any) => {
      /**
       * We receive a 1 message.
       */
      console.log("\n\n\n\neachMessage event: ", chat);

      // do stuff with data
      setMessagesSinceLastConnection((chats: any) => {
        return {...chat,decrypted:false};
      });
    });
  };

  const removeSocketEvents = () => {
    console.warn('\n--> removeSocketEvents');
    epnsSDKSocket?.off(EVENTS.CONNECT);
    epnsSDKSocket?.off(EVENTS.DISCONNECT);
  };

  useEffect(() => {
    if (epnsSDKSocket) {
      addSocketEvents();
    }
  
    return () => {
      if (epnsSDKSocket) {
        removeSocketEvents();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [epnsSDKSocket]);


  /**
   * Whenever the requisite params to create a connection object change
   *  - disconnect the old connection 
   *  - create a new connection object
   */
  useEffect(() => {
    if (account) {
      if (epnsSDKSocket) {
        // console.log('=================>>> disconnection in the hook');
        epnsSDKSocket?.disconnect();
      }
      const main = async () => {
        const connectionObject = createSocketConnection({
          user: account,
          env,
          apiKey,
          socketType,
          socketOptions: { autoConnect: true , reconnectionAttempts: 3}
        });

        console.warn('new connection object: ', connectionObject);

        setEpnsSDKSocket(connectionObject);
      };
      main().catch((err) => console.error(err));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, env]);


  return {
      epnsSDKSocket,
      isSDKSocketConnected,
      messagesSinceLastConnection
  }
};