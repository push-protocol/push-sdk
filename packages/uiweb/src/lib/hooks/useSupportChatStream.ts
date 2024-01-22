import { useEffect, useState } from 'react';
import {
  createSocketConnection,
  EVENTS
} from '@pushprotocol/socket';
import {  ENV } from '../config';
import { CONSTANTS, PushAPI, SignerType } from '@pushprotocol/restapi';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { PushStream } from 'packages/restapi/src/lib/pushstream/PushStream';


export type SupportChatStreamHookOption = {
  account?: string | null,
  env?: ENV,
  pushUser: PushAPI ,
  supportAddress: string | null,
  signer?: SignerType | null
};

export const useSupportChatStream =({ account, env , pushUser, supportAddress, signer }: SupportChatStreamHookOption) => {
  
  const [messagesSinceLastConnection, setMessagesSinceLastConnection] = useState<any>('');
  const [isSupportChatStreamConnected, setIsSupportChatStreamConnected] = useState<boolean>(false);

  
  const attachListenersAndConnect = async (stream: PushStream) => {
    console.warn('\n--> addChatSocketEvents');
    stream.on(CONSTANTS.STREAM.CONNECT, (err:Error) => {
      console.log('CONNECTED: ', err);
      setIsSupportChatStreamConnected(true);
    });


    stream.on(CONSTANTS.STREAM.DISCONNECT, (err:Error) => {
      console.log('DIS-CONNECTED: ',err);
      setIsSupportChatStreamConnected(false);
    });



    console.log('\t-->will attach eachMessage event now', stream);
    stream.on(CONSTANTS.STREAM.CHAT, (message: any) => {

      console.log(message);
      setMessagesSinceLastConnection(message);

    });
  };

 

  useEffect(() => {
    if (!pushUser) {
      return;
    }

    const initPushUser = async () => {
      // create a new connection object
      if (!pushUser.stream) {
        const stream = await pushUser?.initStream(
          [
            CONSTANTS.STREAM.CHAT,
            CONSTANTS.STREAM.CHAT_OPS, //not in use currently
             CONSTANTS.STREAM.CONNECT,
            CONSTANTS.STREAM.DISCONNECT,
          ],
          {
            connection: {
              retries: 3, // number of retries in case of error
            },
            raw: true,
          }
        );
          
        // attach listeneres
        await attachListenersAndConnect(stream);
      }

      // establish a new connection
      if (!pushUser.stream.connected()) {
        await pushUser.stream?.connect();
        console.debug('Connect stream: ', pushUser);
      }

    };

    initPushUser();

    // Return a function to clean up the effect
    return () => {
      if (pushUser && pushUser.stream) {
        pushUser.stream?.disconnect();
        console.debug('Disconnect stream: ', pushUser);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pushUser, env, account, supportAddress, signer]);


  return {
      messagesSinceLastConnection,
      isSupportChatStreamConnected
  }
};