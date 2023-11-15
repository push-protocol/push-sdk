import { useEffect, useState } from 'react';
import {
  createSocketConnection,
  EVENTS
} from '@pushprotocol/socket';
import {  ENV } from '../config';
import { CONSTANTS, PushAPI } from '@pushprotocol/restapi';


export type SDKSocketHookOptions = {
  account?: string | null,
  env?: ENV,
  socketType?: 'chat' | 'notification',
  apiKey: string,
  userAlice: PushAPI | null
};

export const useSDKSocket =({ account, env = ENV.PROD, socketType = 'chat',apiKey, userAlice }: SDKSocketHookOptions) => {
  
  // const [epnsSDKSocket, setEpnsSDKSocket] = useState<any>(null);
  const [messagesSinceLastConnection, setMessagesSinceLastConnection] = useState<any>('');
  const [isSDKSocketConnected, setIsSDKSocketConnected] = useState<boolean>(false);
  const [stream, setStream] = useState<any>(null);
  
  const addSocketEvents = async () => {
    console.warn('\n--> addChatSocketEvents');
    stream.on(CONSTANTS.STREAM.CONNECT, (a) => {
      console.log('CONNECTED: ');
      setIsSDKSocketConnected(true);
    });
    await stream.connect();

    stream.on(CONSTANTS.STREAM.DISCONNECT, (err:any) => {
      console.log('DIS-CONNECTED: ',err);
      setIsSDKSocketConnected(false);
    });



    console.log('\t-->will attach eachMessage event now');
    stream.on(CONSTANTS.STREAM.CHAT, (message: any) => {
      console.log('Encrypted Message Received');
      /**
       * We receive a 1 message.
       */
      console.log("\n\n\n\neachMessage event: ", message);

      // do stuff with data
      setMessagesSinceLastConnection((chats: any) => {
        return {...message,decrypted:false};
      });
      // stream.disconnect();
    });
  };

  console.log(messagesSinceLastConnection)

  const removeSocketEvents = () => {
    stream.disconnect();
  };

  useEffect(() => {
    if (stream) {
      addSocketEvents();
    }
  
    return () => {
      if (stream) {
        removeSocketEvents();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stream]);


  /**
   * Whenever the requisite params to create a connection object change
   *  - disconnect the old connection 
   *  - create a new connection object
   */
  useEffect(() => {
    if (account) {
      if (stream) {
        // console.log('=================>>> disconnection in the hook');
        stream?.disconnect();
      }
      const main = async () => {
        const stream = await userAlice.initStream(
          [
            CONSTANTS.STREAM.CHAT,
          ],
          {}
        );
      
        console.warn('new connection object: ', stream);
        setStream(stream);
        // setEpnsSDKSocket(connectionObject);
      };
      main().catch((err) => console.error(err));
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, env]);

  return {
      stream,
      isSDKSocketConnected,
      messagesSinceLastConnection
  }
};