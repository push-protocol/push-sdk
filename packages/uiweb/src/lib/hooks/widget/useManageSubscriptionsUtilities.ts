import { useCallback, useState } from 'react';
import { useWidgetData } from './useWidgetData';
import * as PushAPI from '@pushprotocol/restapi';
import { WidgetErrorCodes } from '../../components/widget';

export const useManageSubscriptionsUtilities = () => {
  const [subscribeLoading, setSubscribeLoading] = useState<boolean>(false);
  const [subscribeError, setSubscribeError] = useState<string>();
  const [unsubscribeLoading, setUnsubscribeLoading] = useState<boolean>(false);
  const [unsubscribeError, setUnsubscribeError] = useState<string>();
  const { user, env, account } = useWidgetData();

  interface subscribeunsubscribeParams {
    channelAddress: string;
    channelSettings?: PushAPI.UserSetting[];
  }
  const subscribeToChannel = useCallback(
    async ({
      channelAddress,
      channelSettings = [],
    }: subscribeunsubscribeParams) => {
      setSubscribeLoading(true);
      try {
        if (user) {
          const response = await user.notification.subscribe(channelAddress, {
            settings: channelSettings,
            onSuccess: () => {
              setSubscribeLoading(false);
            },
            onError: () => {
              setSubscribeLoading(false);
              setSubscribeError(
                WidgetErrorCodes.NOTIFICATION_WIDGET_SUBSCRIBE_ERROR
              );
            },
          });

          return response;
        }
        return;
      } catch (error: Error | any) {
        setSubscribeLoading(false);
        setSubscribeError(
          WidgetErrorCodes.NOTIFICATION_WIDGET_SUBSCRIBE_ERROR
        );
        return error.message;
      }
    },
    [account, env]
  );
  const unsubscribeToChannel = useCallback(
    async ({
      channelAddress,
      channelSettings = [],
    }: subscribeunsubscribeParams) => {
      setUnsubscribeLoading(true);
      try {
        if (user) {
          const response = await user.notification.unsubscribe(channelAddress, {
            settings: channelSettings,
            onSuccess: () => {
              setUnsubscribeLoading(false);
            },
            onError: () => {
              setUnsubscribeLoading(false);
              setUnsubscribeError(
                WidgetErrorCodes.NOTIFICATION_WIDGET_UNSUBSCRIBE_ERROR
              );
            },
          });

          return response;
        }
        return;
      } catch (error: Error | any) {
        setUnsubscribeLoading(false);
        setUnsubscribeError(
          WidgetErrorCodes.NOTIFICATION_WIDGET_UNSUBSCRIBE_ERROR
        );
        return error.message;
      }
    },
    [account, env]
  );

  return {
    subscribeToChannel,
    subscribeError,
    subscribeLoading,
    unsubscribeError,
    unsubscribeLoading,
    unsubscribeToChannel,
  };
};
