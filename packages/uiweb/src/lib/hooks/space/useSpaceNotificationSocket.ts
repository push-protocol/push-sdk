import { useCallback, useEffect, useState } from 'react';
import { createSocketConnection, EVENTS } from '@pushprotocol/socket';
import * as PushAPI from '@pushprotocol/restapi';
import { ENV } from '../../config';
import { pCAIP10ToWallet } from '../../helpers';

const NOTIFICATION_SOCKET_TYPE = 'notification';

export type SDKSpaceNotificationSocketHookOptions = {
  account?: string | null;
  env?: ENV;
  acceptSpaceRequest: (
    spaceMetaData: PushAPI.video.VideoDataType
  ) => Promise<void>;
  connectSpaceRequest: (
    spaceMetaData: PushAPI.video.VideoDataType
  ) => Promise<void>;
  broadcastRaisedHand: (
    spaceMetaData: PushAPI.video.VideoDataType
  ) => Promise<void>;
};

export const useSpaceNotificationSocket = ({
  account,
  acceptSpaceRequest,
  connectSpaceRequest,
  broadcastRaisedHand,
  env = ENV.PROD,
}: SDKSpaceNotificationSocketHookOptions) => {
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

      console.log(
        'USER FEEDS NOTIFICATION RECEIVED',
        payload?.data?.additionalMeta?.type,
        `${PushAPI.payloads.ADDITIONAL_META_TYPE.PUSH_SPACE}+1`
      );

      if (
        payload?.data?.additionalMeta?.type ===
        `${PushAPI.payloads.ADDITIONAL_META_TYPE.PUSH_SPACE}+1`
      ) {
        const receivedSpaceMetaData: PushAPI.video.VideoDataType = JSON.parse(
          payload.data.additionalMeta.data
        );

        const { callDetails, status } = receivedSpaceMetaData;

        console.log('RECEIVED ADDITIONAL META DATA', receivedSpaceMetaData);

        if (status === PushAPI.VideoCallStatus.INITIALIZED) {
          if (
            callDetails?.type ===
            PushAPI.payloads.SPACE_REQUEST_TYPE.JOIN_SPEAKER
          ) {
            console.log(
              'ON HOST, ACCEPTING REQUEST OF AN ADDED SPEAKER TO JOIN'
            );
            // TODO: see if check for speaker is req
            acceptSpaceRequest(receivedSpaceMetaData);
          }
          if (
            callDetails?.type ===
            PushAPI.payloads.SPACE_REQUEST_TYPE.ESTABLISH_MESH
          ) {
            acceptSpaceRequest(receivedSpaceMetaData);
          }

          if (
            callDetails?.type ===
            PushAPI.payloads.SPACE_REQUEST_TYPE.REQUEST_TO_PROMOTE
          ) {
            broadcastRaisedHand(receivedSpaceMetaData);

            // store in context
            // receivedSpaceMetaData.signalData
            // receivedSpaceMetaData.senderAddress
            // receivedSpaceMetaData.chatId
          }
        }
        if (status === PushAPI.VideoCallStatus.RECEIVED) {
          connectSpaceRequest(receivedSpaceMetaData);
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
  }, [acceptSpaceRequest, broadcastRaisedHand, connectSpaceRequest, notificationSocket]);

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
          user: pCAIP10ToWallet(account),
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
