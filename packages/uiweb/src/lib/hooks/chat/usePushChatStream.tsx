import { useEffect, useState } from 'react';
import { CONSTANTS, PushAPI, SignerType} from '@pushprotocol/restapi';
import { ENV } from '../../config';
import useGetChatProfile from '../useGetChatProfile';
import { useChatData } from './useChatData';


export type PushChatSocketHookOptions = {
    account?: string | null;
    env?: ENV;
  };

export const usePushSDKStream =() => {
  
 
  const {
    account,
    pgpPrivateKey,
    pushChatSocket : stream,
    setPushChatSocket: setStream,
    setIsPushChatSocketConnected,
    isPushChatSocketConnected,
    connectedProfile,
    setConnectedProfile,
    env,
    pushUser
  } = useChatData();

  const [messagesSinceLastConnection, setMessagesSinceLastConnection] = useState<any>({});

//   not needed anymore - can be found in messageSinceLastConnection
    const [acceptedRequestMessage, setAcceptedRequestMessage] = useState<any>({});
  const [groupInformationSinceLastConnection, setGroupInformationSinceLastConnection] = useState<any>({});

  
  const addSocketEvents = async () => {
    console.warn('\n--> addChatSocketEvents');
    stream.on(CONSTANTS.STREAM.CONNECT, (err:Error) => {
      console.log('CONNECTED: ', err);
      setIsPushChatSocketConnected(true);
    });
    await stream.connect();

    stream.on(CONSTANTS.STREAM.DISCONNECT, (err:Error) => {
      console.log('DIS-CONNECTED: ',err);
      setIsPushChatSocketConnected(false);
    });


//Listen for chat messages, your message, request, accept, rejected,
    console.log('\t-->will attach eachMessage event now');
    stream.on(CONSTANTS.STREAM.CHAT, (message: any) => {

      // do stuff with data
      setMessagesSinceLastConnection((chats: any) => {
        return {...message};
      });

      stream.on(CONSTANTS.STREAM.CHAT_OPS, (chatops: any) => {
        console.log('Alice received chat ops', chatops);
        setGroupInformationSinceLastConnection(chatops)
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
      if (stream) {
        // console.log('=================>>> disconnection in the hook');
        stream?.disconnect();
      }
      const main = async () => {
        const newstream = await pushUser?.initStream(
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
      console.log("error initializing the stream", err)
      );
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, env, pushUser,  isPushChatSocketConnected]);

  return {
    pushChatSocket : stream,
    isPushChatSocketConnected,
    messagesSinceLastConnection,
    groupInformationSinceLastConnection,
  }
};