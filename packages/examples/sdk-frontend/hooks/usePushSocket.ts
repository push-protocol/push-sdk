import { useEffect, useState } from "react";

import { useAccount } from "wagmi";
import { useNetwork } from "wagmi";
import { createSocketConnection, EVENTS } from "@pushprotocol/socket";
import { ENV } from "@pushprotocol/restapi/src/lib/constants";

import { getCAIPAddress } from "../helpers/getCAIPAddress";

export type PushSocketHookOptions = {
  env: ENV;
};

export const usePushSocket = ({ env }: PushSocketHookOptions) => {
  const { address } = useAccount();
  const { chain } = useNetwork();

  const [pushSocket, setPushSocket] = useState<any>(null);
  const [latestFeedItem, setLatestFeedItem] = useState<any>(null);
  const [isPushSocketConnected, setIsPushSocketConnected] = useState(
    pushSocket?.connected
  );

  const addSocketEvents = () => {
    pushSocket?.on(EVENTS.CONNECT, () => {
      console.log("CONNECTED: ");
      setIsPushSocketConnected(true);
    });

    pushSocket?.on(EVENTS.DISCONNECT, () => {
      console.log("DISCONNECTED: ");
      setIsPushSocketConnected(false);
      setLatestFeedItem([]);
    });

    pushSocket?.on(EVENTS.USER_FEEDS, (feedItem: any) => {
      console.log("RECEIVED FEED ITEM: ", feedItem);
      setLatestFeedItem(feedItem);
    });
  };

  const removeSocketEvents = () => {
    pushSocket?.off(EVENTS.CONNECT);
    pushSocket?.off(EVENTS.DISCONNECT);
    pushSocket?.off(EVENTS.USER_FEEDS);
  };

  useEffect(() => {
    if (pushSocket) {
      addSocketEvents();
    }

    return () => {
      if (pushSocket) {
        removeSocketEvents();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pushSocket]);

  /**
   * Whenever the requisite params to create a connection object change
   *  - disconnect the old connection
   *  - create a new connection object
   */
  useEffect(() => {
    if (address) {
      if (pushSocket) {
        pushSocket?.disconnect();
      }

      const connectionObject = createSocketConnection({
        user: getCAIPAddress(env, address, "User"),
        env,
        socketOptions: { autoConnect: false },
      });
      setPushSocket(connectionObject);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, env, chain?.id]);

  return {
    pushSocket,
    isPushSocketConnected,
    latestFeedItem,
  };
};
