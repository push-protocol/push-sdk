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
  isCAIP?: boolean
};

export const useSDKSocket = ({ account, env = '', isCAIP, socketType = 'chat',apiKey }: SDKSocketHookOptions) => {
  
  const [epnsSDKSocket, setEpnsSDKSocket] = useState<any>(null);
  const [isSDKSocketConnected, setIsSDKSocketConnected] = useState(epnsSDKSocket?.connected);

  const addSocketEvents = () => {
    console.warn('\n--> addSocketEvents');
    epnsSDKSocket?.on(EVENTS.CONNECT, () => {
      console.log('CONNECTED: ');
      epnsSDKSocket?.emit("CREATE_INTENT", { hi: "abc" }, (message: any) => {
        console.log(message)
    })
      setIsSDKSocketConnected(true);
    });

    epnsSDKSocket?.on(EVENTS.DISCONNECT, () => {
      console.log('DIS-CONNECTED: ');
      setIsSDKSocketConnected(false);
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
      console.log(env)
      const main = async () => {
        const connectionObject = createSocketConnection({
          user: account,
          env,
          apiKey,
          socketType,
          socketOptions: { autoConnect: true , reconnectionAttempts: 3}
        });
        console.log('sleeping');
        await sleep(7000);
        console.log('awake');
        console.warn('new connection object: ', connectionObject);
        // set to context
        setEpnsSDKSocket(connectionObject);
      };
      main().catch((err) => console.error(err));
      // const connectionObject = createSocketConnection({
      //   user: account,
      //   env,
      //   apiKey,
      //   socketType,
      //   socketOptions: { autoConnect: false }
      // });
      // console.log('sleeping');
      // await sleep(4000);
      // console.log('awake');
      // console.warn('new connection object: ', connectionObject);
      // // set to context
      // setEpnsSDKSocket(connectionObject);
    }
    function sleep(ms: any) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, env, isCAIP]);


  return {
      epnsSDKSocket,
      isSDKSocketConnected,
  }
};