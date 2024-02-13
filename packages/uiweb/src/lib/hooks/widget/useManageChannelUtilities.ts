import { useCallback, useState } from 'react';
import { useWidgetData } from './useWidgetData';
import { WidgetErrorCodes } from '../../components';


interface channelInfoParams {
    channelAddress: string;
  }
export const useManageChannelUtilities = () => {

  const [channelInfoLoading, setChannelInfoLoading] = useState<boolean>(false);
  const [channelInfoError, setChannelInfoError] = useState<string>();
  const { user, env, account } = useWidgetData();

  const fetchChannelInfo = useCallback(
    async ({
      channelAddress,
    }: channelInfoParams) => {
      setChannelInfoLoading(true);
      try {
        if (user) {
          const response = await user.channel.info(channelAddress);
          setChannelInfoLoading(false);
          return response;
        }
        return;
      } catch (error: Error | any) {
        setChannelInfoLoading(false);
        setChannelInfoError(
          WidgetErrorCodes.NOTIFICATION_WIDGET_CHANNEL_INFO_ERROR
        );
        return error.message;
      }
    },
    [account, env,user]
  );

  return {
  channelInfoError,
  channelInfoLoading,
  fetchChannelInfo,
  setChannelInfoError
  };
};
