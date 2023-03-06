import { useEffect, useState } from 'react';
import {
  createSocketConnection,
  EVENTS
} from '@pushprotocol/socket';

import { getCAIPAddress, ENV } from '../helpers';

export type SDKSocketHookOptions = {
  account?: string | null,
  env?: ENV,
  chainId?: number,
  isCAIP?: boolean
};

export const useSDKSocket = ({ account, env = ENV.PROD, chainId, isCAIP }: SDKSocketHookOptions) => {
  
  const [epnsSDKSocket, setEpnsSDKSocket] = useState<any>(null);
  const [feedsSinceLastConnection, setFeedsSinceLastConnection] = useState<any>([]);
  const [isSDKSocketConnected, setIsSDKSocketConnected] = useState(epnsSDKSocket?.connected);
  const [lastConnectionTimestamp, setLastConnectionTimestamp] = useState('');

  const addSocketEvents = () => {
    console.warn('\n--> addSocketEvents');
    epnsSDKSocket?.on(EVENTS.CONNECT, () => {
      console.log('CONNECTED: ');
      setIsSDKSocketConnected(true);
      setLastConnectionTimestamp((new Date()).toUTCString());
    });

    epnsSDKSocket?.on(EVENTS.DISCONNECT, () => {
      console.log('DIS-CONNECTED: ');
      setIsSDKSocketConnected(false);
      setFeedsSinceLastConnection([]);
      setLastConnectionTimestamp('');
    });

    console.log('\t-->will attach eachFeed event now');
    epnsSDKSocket?.on(EVENTS.USER_FEEDS, (feed: any) => {
      /**
       * We receive a 1 feed item.
       */
      console.log("\n\n\n\neachFeed event: ", feed);

      // do stuff with data
      setFeedsSinceLastConnection((oldFeeds: any) => {
        return [...oldFeeds, feed]
      });
    });
  };

  const removeSocketEvents = () => {
    console.warn('\n--> removeSocketEvents');
    epnsSDKSocket?.off(EVENTS.CONNECT);
    epnsSDKSocket?.off(EVENTS.DISCONNECT);
    epnsSDKSocket?.off(EVENTS.USER_FEEDS);
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
      
      const connectionObject = createSocketConnection({
        user: getCAIPAddress(env, account, 'User'),
        env,
        socketOptions: { autoConnect: false }
      });
      console.warn('new connection object: ', connectionObject);
      // set to context
      setEpnsSDKSocket(connectionObject);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, env, chainId, isCAIP]);


  return {
      epnsSDKSocket,
      isSDKSocketConnected,
      feedsSinceLastConnection,
      lastConnectionTimestamp
  }
};