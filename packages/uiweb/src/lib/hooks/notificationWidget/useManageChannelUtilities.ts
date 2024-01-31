import { useCallback, useState } from 'react';
import { useNotificationWidgetData } from './useNotificationWidgetData';
import { NotificationWidgetErrorCodes } from '../../components/notificationWidget';

export const useManageChannelUtilities = () => {

  const [channelInfoLoading, setChannelInfoLoading] = useState<boolean>(false);
  const [channelInfoError, setChannelInfoError] = useState<string>();
  const { user, env, account } = useNotificationWidgetData();

  interface channelInfoParams {
    channelAddress: string;
  }
  const fetchChannelInfo = useCallback(
    async ({
      channelAddress,
    }: channelInfoParams) => {
      setChannelInfoLoading(true);
      try {
        if (user) {
          const response = await user.channel.info(channelAddress);

          return response;
        }
        return;
      } catch (error: Error | any) {
        setChannelInfoLoading(false);
        setChannelInfoError(
          NotificationWidgetErrorCodes.NOTIFICATION_WIDGET_CHANNEL_INFO_ERROR
        );
        return error.message;
      }
    },
    [account, env]
  );

  return {
  channelInfoError,
  channelInfoLoading,
  fetchChannelInfo
  };
};
