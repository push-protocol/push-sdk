import { useCallback, useEffect, useState } from 'react';
import { createSocketConnection, EVENTS } from '@pushprotocol/socket';
import * as PushAPI from '@pushprotocol/restapi';
import { useSpaceData } from './useSpaceData';
import { ENV } from '../../config';

const NOTIFICATION_SOCKET_TYPE = 'notification';

export type SDKSocketHookOptions = {
  account?: string | null;
  env?: ENV;
};

export const useSpaceNotificationSocket = ({
  account,
  env = ENV.PROD,
}: SDKSocketHookOptions) => {
  const { spacesObjectRef, setSpeakerData, setSpaceRequests, spaceRequests } =
    useSpaceData();

  const [notificationSocket, setNotificationSocket] = useState<any>(null);
  const [isNotificationSocketConnected, setIsNotificationSocketConnected] =
    useState<boolean>(false);

  const addSocketEvents = useCallback(() => {
    notificationSocket?.on(EVENTS.CONNECT, () => {
      setIsNotificationSocketConnected(true);
    });

    notificationSocket?.on(EVENTS.DISCONNECT, () => {
      setIsNotificationSocketConnected(false);
    });

    notificationSocket?.on(EVENTS.USER_FEEDS, (feedItem: any) => {
      const { payload } = feedItem;

      console.log('RECEIVED USER FEEDS NOTIF', payload);

      if (
        payload?.data?.additionalMeta?.type ===
        `${PushAPI.payloads.ADDITIONAL_META_TYPE.PUSH_VIDEO}+1`
      ) {
        const {
          status,
          callDetails,
          senderAddress,
          recipientAddress,
          signalData,
          chatId,
        }: PushAPI.video.VideoDataType = JSON.parse(
          payload.data.additionalMeta.data
        );

        if (status === PushAPI.VideoCallStatus.INITIALIZED) {
          if (
            callDetails?.type ===
            PushAPI.payloads.SPACE_REQUEST_TYPE.JOIN_SPEAKER
          ) {
            // @Nilesh
            // host has started the space and is asking speakers to join in (real-time)
            // we need to store the JSON.parse(
            // payload.data.additionalMeta.data
            // );, chatId -> spaceId

            // setSpeakerData(chatId, JSON.parse(
            //   payload.data.additionalMeta.data
            // ));
            // const updatedData = spaceRequests?.apiData?.map(item => {
            //   if (item.spaceId === chatId) {
            //     return {
            //       ...item,
            //       spaceInformation: {
            //         ...item.spaceInformation,
            //         status: 'ACTIVE'
            //       }
            //     };
            //   }
            //   return item;
            // });
            // setSpaceRequests({
            //   apiData: updatedData as PushAPI.SpaceIFeeds[]
            // })

            // so that we can use then when the speaker wants to join the space from space invites

            // TODO: see if check for speaker is req
            spacesObjectRef.current?.acceptRequest({
              senderAddress: recipientAddress,
              recipientAddress: senderAddress,
              signalData,
              chatId,
            });
          }
          if (
            callDetails?.type ===
            PushAPI.payloads.SPACE_REQUEST_TYPE.ESTABLISH_MESH
          ) {
            spacesObjectRef.current?.acceptRequest({
              signalData,
              senderAddress: recipientAddress,
              recipientAddress: senderAddress,
              chatId: chatId,
            });
          }
        }
        if (status === PushAPI.VideoCallStatus.RECEIVED) {
          spacesObjectRef.current?.connect({
            signalData,
            peerAddress: senderAddress,
          });
        }
        if (status === PushAPI.VideoCallStatus.DISCONNECTED) {
          if (
            callDetails?.type === PushAPI.payloads.SPACE_DISCONNECT_TYPE.LEAVE
          ) {
            // later -> the 'senderAddress' has left the space
          }
          if (
            callDetails?.type === PushAPI.payloads.SPACE_DISCONNECT_TYPE.STOP
          ) {
            // later -> space has been ended by the host
          }
        }
      }
    });
  }, [notificationSocket]);

  const removeSocketEvents = useCallback(() => {
    notificationSocket?.off(EVENTS.CONNECT);
    notificationSocket?.off(EVENTS.DISCONNECT);
    notificationSocket?.off(EVENTS.USER_FEEDS);
  }, [notificationSocket]);

  useEffect(() => {
    if (notificationSocket) {
      addSocketEvents();
    }

    return () => {
      if (notificationSocket) {
        removeSocketEvents();
      }
    };
  }, [addSocketEvents, notificationSocket, removeSocketEvents]);

  /**
   * Whenever the requisite params to create a connection object change
   *  - disconnect the old connection
   *  - create a new connection object
   */
  useEffect(() => {
    if (account) {
      if (notificationSocket) {
        // console.log('=================>>> disconnection in the hook');
        notificationSocket?.disconnect();
      }
      const main = async () => {
        const connectionObject = createSocketConnection({
          user: account,
          env,
          socketType: NOTIFICATION_SOCKET_TYPE,
          socketOptions: { autoConnect: true, reconnectionAttempts: 3 },
        });
        console.warn('new connection object: ', connectionObject);

        setNotificationSocket(connectionObject);
      };
      main().catch((err) => console.error(err));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, env]);

  return {
    notificationSocket,
    isNotificationSocketConnected,
  };
};
