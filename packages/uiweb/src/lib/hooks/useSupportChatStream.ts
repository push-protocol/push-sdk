import { useEffect, useState } from 'react';
import {  ENV } from '../config';
import { CONSTANTS, PushAPI, SignerType } from '@pushprotocol/restapi';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { PushStream } from 'packages/restapi/src/lib/pushstream/PushStream';


export type SupportChatStreamHookOption = {
  account?: string | null,
  env?: ENV,
  user: PushAPI ,
  supportAddress: string | null,
  signer?: SignerType | null
};

export const useSupportChatStream =({ account, env , user, supportAddress, signer }: SupportChatStreamHookOption) => {
  
  const [messagesSinceLastConnection, setMessagesSinceLastConnection] = useState<any>('');
  const [isSupportChatStreamConnected, setIsSupportChatStreamConnected] = useState<boolean>(false);

  
  const attachListenersAndConnect = async (stream: PushStream) => {
    console.warn('\n--> addChatSocketEvents');
    stream.on(CONSTANTS.STREAM.CONNECT, (err:Error) => {
      console.log('CONNECTED to the stream');
      setIsSupportChatStreamConnected(true);
    });


    stream.on(CONSTANTS.STREAM.DISCONNECT, (err:Error) => {
      console.log('DIS-CONNECTED to the stream ');
      setIsSupportChatStreamConnected(false);
    });



    console.log('\t-->will attach eachMessage event now');
    stream.on(CONSTANTS.STREAM.CHAT, (message: any) => {
  
      setMessagesSinceLastConnection(message);

    });
  };

 

  useEffect(() => {
    if (!user) {
      return;
    }

    const inituser = async () => {
      // create a new connection object
      if (!user.stream) {
        const stream = await user?.initStream(
          [
            CONSTANTS.STREAM.CHAT,
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
      if (!user.stream.connected()) {
        await user.stream?.connect();
        console.debug('Connect stream: ', user);
      }

    };

    inituser();

    // Return a function to clean up the effect
    return () => {
      if (user && user.stream) {
        user.stream?.disconnect();
        console.debug('Disconnect stream: ', user);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, env, account, supportAddress, signer]);


  return {
      messagesSinceLastConnection,
      isSupportChatStreamConnected
  }
};