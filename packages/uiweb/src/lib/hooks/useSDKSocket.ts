import { useEffect, useState } from 'react';
import {
  createSocketConnection,
  EVENTS
} from '@pushprotocol/socket';
import {  ENV } from '../config';
import { CONSTANTS, PushAPI, SignerType } from '@pushprotocol/restapi';


export type SDKSocketHookOptions = {
  account?: string | null,
  env?: ENV,
  socketType?: 'chat' | 'notification',
  apiKey: string,
  user: PushAPI ,
  supportAddress: string | null,
    signer: SignerType | null
};

export const useSDKSocket =({ account, env = ENV.PROD, socketType = 'chat',apiKey, user, supportAddress, signer }: SDKSocketHookOptions) => {
  
  // const [epnsSDKSocket, setEpnsSDKSocket] = useState<any>(null);
  const [messagesSinceLastConnection, setMessagesSinceLastConnection] = useState<any>('');
  const [isSDKSocketConnected, setIsSDKSocketConnected] = useState<boolean>(false);
  const [stream, setStream] = useState<any>(null);
  
  const addSocketEvents = async () => {
    console.warn('\n--> addChatSocketEvents');
    stream.on(CONSTANTS.STREAM.CONNECT, (err:Error) => {
      console.log('CONNECTED: ', err);
      setIsSDKSocketConnected(true);
    });
    await stream.connect();

    stream.on(CONSTANTS.STREAM.DISCONNECT, (err:Error) => {
      console.log('DIS-CONNECTED: ',err);
      setIsSDKSocketConnected(false);
    });



    console.log('\t-->will attach eachMessage event now');
    stream.on(CONSTANTS.STREAM.CHAT, (message: any) => {

      // do stuff with data
      setMessagesSinceLastConnection((chats: any) => {
        return {...message};
      });
      // stream.disconnect();
    });
  };

 

  const removeSocketEvents = () => {
    stream?.disconnect();
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
      if (!stream) {
        // console.log('=================>>> disconnection in the hook');
        stream?.disconnect();
      }
      const main = async () => {
        const newstream = await user.initStream(
          [
            CONSTANTS.STREAM.CHAT,
          ],
          {}
        );
      
        console.warn('new connection object: ', newstream);
        setStream(newstream);
        // setEpnsSDKSocket(connectionObject);
      };
      main().catch((err) => 
      console.log('')
      );
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, env, user, supportAddress, signer, isSDKSocketConnected]);

  return {
      stream,
      isSDKSocketConnected,
      messagesSinceLastConnection
  }
};