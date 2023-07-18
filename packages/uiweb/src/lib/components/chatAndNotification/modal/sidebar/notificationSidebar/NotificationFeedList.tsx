import type { NotificationFeedsType } from '../../../../../types';
import React, { useContext } from 'react';
import type { chainNameType, INotificationItemTheme} from '../../../../notification';
import { notificationLightTheme } from '../../../../notification';
import { NotificationItem } from '../../../../notification';
import { ChatAndNotificationPropsContext, NotificationMainStateContext } from '../../../../../context';
import useOnSubscribeToChannel from '../../../../../hooks/notifications/useOnSubscribeToChannel';
import { Div } from '../../../../reusables';

type NotificationFeedListPropType = {
  notificationFeeds: NotificationFeedsType;
};
const customTheme: INotificationItemTheme = {...notificationLightTheme,...{
  borderRadius:{
    ...notificationLightTheme.borderRadius,
    modal:'12px',
  },
  color:{
    ...notificationLightTheme.color,
      channelNameText:'#62626A',
      notificationTitleText:'#000',
      notificationContentText:'#62626A',
      modalBorder:'#C8C8CB',
      timestamp:'#62626A',
  },
  fontWeight:{
    ...notificationLightTheme.fontWeight,
    channelNameText:600,
    notificationTitleText:600,
    notificationContentText:500,
    timestamp:400
  },
  fontSize:{
    ...notificationLightTheme.fontSize,
    channelNameText:'16px',
    notificationTitleText:'16px',
    notificationContentText:'16px',
    timestamp:'12px'
  },
  modalDivider:'none'
}};

export const NotificationFeedList: React.FC<NotificationFeedListPropType> = ({
  notificationFeeds,
}) => {
  const { subscriptionStatus } = useContext<any>(NotificationMainStateContext);
  const { onSubscribeToChannel } = useOnSubscribeToChannel();
  const { signer} = useContext<any>(ChatAndNotificationPropsContext);
  const isSubscribedFn = (channel: string) => {
    return !!subscriptionStatus.get(channel);
  };
  return (
    <>
      {!!Object.keys(notificationFeeds || {}).length &&
        Object.keys(notificationFeeds).map((id: string) => (
          <NotificationItem
          key={id}
            notificationTitle={notificationFeeds[id].title}
            notificationBody={notificationFeeds[id].message}
            cta={notificationFeeds[id].cta} 
            app={notificationFeeds[id].app}
            icon={notificationFeeds[id].icon}
            image={notificationFeeds[id].image}
            // theme={'light'}
            customTheme={customTheme}
            isSpam={(!!signer&& !subscriptionStatus.get(notificationFeeds[id].channel))}
            subscribeFn={
              (!!signer&& !subscriptionStatus.get(notificationFeeds[id].channel))
                ? () =>
                    onSubscribeToChannel({
                      channelAddress: notificationFeeds[id].channel,
                    })
                : undefined
            }
            isSubscribedFn={
              (!!signer&& !subscriptionStatus.get(notificationFeeds[id].channel))
                ? async () => isSubscribedFn(notificationFeeds[id].channel)
                : undefined
            }
            chainName={notificationFeeds[id].blockchain as chainNameType}
            url={notificationFeeds[id].url}
          />
        ))}
       
    </>
  );
};

//styles
