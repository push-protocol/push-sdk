import { createSocketConnection, EVENTS } from '@pushprotocol/socket';
import { useCallback, useEffect, useState } from 'react';
import { ENV } from '../../config';
import { useSpaceData } from './useSpaceData';
import * as PushAPI from '@pushprotocol/restapi';
import { SpaceDTO } from '@pushprotocol/restapi';

const SPACE_SOCKET_TYPE = 'chat';

export type PushSDKSocketHookOptions = {
  account?: string | null;
  env?: ENV;
};

export const usePushSpaceSocket = ({
  account,
  env = ENV.PROD,
}: PushSDKSocketHookOptions) => {
  const {
    spaceRequests,
    setSpaceRequests,
    popularSpaces,
    setPopularSpaces,
    mySpaces,
    setMySpaces,
    setSpaceInfo,
    pushSpaceSocket,
    setPushSpaceSocket,
    isPushSDKSocketConnected,
    setIsPushSDKSocketConnected,
    spacesObjectRef,
  } = useSpaceData();

  const addSocketEvents = useCallback(() => {
    pushSpaceSocket?.on(EVENTS.CONNECT, () => {
      setIsPushSDKSocketConnected(true);
    });

    pushSpaceSocket?.on(EVENTS.DISCONNECT, (reason: string) => {
      // console.log("space socket disconnected", reason);
      setIsPushSDKSocketConnected(false);
    });

    pushSpaceSocket?.on(EVENTS.CHAT_RECEIVED_MESSAGE, async (message: any) => {
      console.log('MESSAGE RECIEVED', message);
      if (message?.messageType === 'META') {
        // this is to update the liveSpaceData state
        await spacesObjectRef?.current?.onReceiveMetaMessage?.({
          recievedMetaMessage: message,
        });
      }
    });

    pushSpaceSocket?.on('SPACES', async (spaceInfo: SpaceDTO) => {

      /* TODO: In future, store all space info in SpaceInfo state itself, and mySpaces, popularSpaces, requests only store spaceId
        so as to only update spaceInfo once and it should reflect at every place*/
      setSpaceInfo(spaceInfo.spaceId, spaceInfo);

      const isSpaceInvite: boolean = spaceInfo?.pendingMembers?.some(
        (member) => member.wallet === account
      );
      if (isSpaceInvite) {
        const isInInvites: boolean =
          spaceRequests?.apiData?.some(
            (invite) => invite.spaceId === spaceInfo.spaceId
          ) ?? false;
        if (isInInvites) {
          const updatedRequests = spaceRequests?.apiData?.map((item) => {
            if (item.spaceId === spaceInfo.spaceId) {
              return {
                ...item,
                spaceInformation: spaceInfo,
              };
            }
            return item;
          });

          setSpaceRequests({
            apiData: updatedRequests as PushAPI.SpaceIFeeds[],
          });
        } else {
          const spaceFeed: PushAPI.SpaceIFeeds = await PushAPI.space.space({
            account: account as string,
            env,
            recipient: spaceInfo.spaceId,
            toDecrypt: false,
          });
          const updatedRequests: PushAPI.SpaceIFeeds[] = [
            spaceFeed,
            ...(spaceRequests?.apiData || []),
          ];

          setSpaceRequests({
            apiData: updatedRequests as PushAPI.SpaceIFeeds[],
          });
        }
      } else {
        const isInMySpaces: boolean =
          mySpaces?.apiData?.some(
            (invite) => invite.spaceId === spaceInfo.spaceId
          ) ?? false;
        if (isInMySpaces) {
          const updatedMySpaces = mySpaces?.apiData?.map((item) => {
            if (item.spaceId === spaceInfo.spaceId) {
              return {
                ...item,
                spaceInformation: spaceInfo,
              };
            }
            return item;
          });

          setMySpaces({
            apiData: updatedMySpaces as PushAPI.SpaceIFeeds[],
          });
        } else {
          const spaceFeed: PushAPI.SpaceIFeeds = await PushAPI.space.space({
            account: account as string,
            env,
            recipient: spaceInfo.spaceId,
            toDecrypt: false,
          });
          const updatedMySpaces: PushAPI.SpaceIFeeds[] = [
            spaceFeed,
            ...(mySpaces?.apiData || []),
          ];

          setMySpaces({
            apiData: updatedMySpaces as PushAPI.SpaceIFeeds[],
          });
        }
      }

      /*
          - Will be executed on host's end of a live space
          - When a listener joins this fires a meta message telling everyone the same
        */
      await spacesObjectRef?.current?.onJoinListener?.({
        receivedSpaceData: spaceInfo,
      });

      const updatedPopularSpaces = popularSpaces?.apiData?.map((item) => {
        if (item.spaceId === spaceInfo.spaceId) {
          return {
            ...item,
            spaceInformation: spaceInfo,
          };
        }
        return item;
      });

      setPopularSpaces({
        apiData: updatedPopularSpaces as PushAPI.SpaceIFeeds[],
      });
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pushSpaceSocket,
    spaceRequests,
    popularSpaces,
    mySpaces,
    setSpaceInfo,
    setPopularSpaces,
    account,
    setSpaceRequests,
    env,
    setMySpaces,
    spacesObjectRef,
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
  }, [pushSpaceSocket]);

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

  useEffect(() => {
    console.log('isPushSDKSocketConnected', isPushSDKSocketConnected);
  }, [isPushSDKSocketConnected]);

  return {
    pushSpaceSocket,
    isPushSDKSocketConnected,
  };
};
