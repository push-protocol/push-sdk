import { createSocketConnection, EVENTS } from '@pushprotocol/socket';
import { useCallback, useEffect, useState } from 'react';
import { ENV } from '../../config';
import { useSpaceData } from './useSpaceData';
import * as PushAPI from "@pushprotocol/restapi";
import { SpaceDTO, SpaceIFeeds } from '@pushprotocol/restapi';

const SPACE_SOCKET_TYPE = 'chat';

export type PushSDKSocketHookOptions = {
  account?: string | null;
  env?: ENV;
};

export const usePushSpaceSocket = ({
  account,
  env = ENV.PROD,
}: PushSDKSocketHookOptions) => {
  const { spaceRequests, setSpaceRequests } = useSpaceData();
  const [pushSpaceSocket, setPushSpaceSocket] = useState<any>(null);
  const [isPushSDKSocketConnected, setIsPushSDKSocketConnected] =
    useState<boolean>(false);

  const addSocketEvents = useCallback(() => {
    pushSpaceSocket?.on(EVENTS.CONNECT, () => {
      setIsPushSDKSocketConnected(true);
    });

    pushSpaceSocket?.on(EVENTS.DISCONNECT, () => {
      setIsPushSDKSocketConnected(false);
    });

    pushSpaceSocket?.on(
      EVENTS.CHAT_RECEIVED_MESSAGE,
      async () => {
        /** */
      }
    );

    pushSpaceSocket?.on('SPACES', (spaceInfo: SpaceDTO) => {
      console.log(spaceInfo);

      const updatedData = spaceRequests?.apiData?.map(item => {
        if (item.spaceId === spaceInfo.spaceId) {
          return {
            ...item,
            spaceInformation: spaceInfo
          };
        }
        return item;
      });
      
      setSpaceRequests({ 
        apiData: updatedData as PushAPI.SpaceIFeeds[]
      })
    });
  }, [
    pushSpaceSocket
  ]);

  const removeSocketEvents = useCallback(() => {
    pushSpaceSocket?.off(EVENTS.CONNECT);
    pushSpaceSocket?.off(EVENTS.DISCONNECT);
    pushSpaceSocket?.off(EVENTS.CHAT_GROUPS);
    pushSpaceSocket?.off(EVENTS.CHAT_RECEIVED_MESSAGE);
  }, [pushSpaceSocket]);

  useEffect(() => {
    if (pushSpaceSocket) {
      addSocketEvents();
    }

    return () => {
      if (pushSpaceSocket) {
        removeSocketEvents();
      }
    };
  }, [addSocketEvents, pushSpaceSocket, removeSocketEvents]);

  /**
   * Whenever the required params to create a connection object change
   *  - disconnect the old connection
   *  - create a new connection object
   */
  useEffect(() => {
    if (account) {
      if (pushSpaceSocket) {
        // console.log('=================>>> disconnection in the hook');
        pushSpaceSocket?.disconnect();
      }
      const main = async () => {
        const connectionObject = createSocketConnection({
          user: account,
          env,
          socketType: SPACE_SOCKET_TYPE,
          socketOptions: { autoConnect: true, reconnectionAttempts: 3 },
        });
        console.warn('new connection object: ', connectionObject);

        setPushSpaceSocket(connectionObject);
      };
      main().catch((err) => console.error(err));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, env]);

  return {
    pushSpaceSocket,
    isPushSDKSocketConnected,
  };
};
