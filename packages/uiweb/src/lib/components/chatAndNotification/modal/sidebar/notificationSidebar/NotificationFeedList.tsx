import type { NotificationFeedsType } from '../../../../../types';
import React, { useContext } from 'react';
import type { chainNameType } from '../../../../notification';
import { NotificationItem } from '../../../../notification';
import { ChatAndNotificationPropsContext, NotificationMainStateContext } from '../../../../../context';
import useOnSubscribeToChannel from '../../../../../hooks/notifications/useOnSubscribeToChannel';

type NotificationFeedListPropType = {
  notificationFeeds: NotificationFeedsType;
};

export const NotificationFeedList: React.FC<NotificationFeedListPropType> = ({
  notificationFeeds,
}) => {
  const { subscriptionStatus } = useContext<any>(NotificationMainStateContext);
  const { onSubscribeToChannel } = useOnSubscribeToChannel();
  const { signer} = useContext<any>(ChatAndNotificationPropsContext);
  const isSubscribedFn = (channel: string) => {
    return subscriptionStatus.get(channel);
  };
  return (
    <>
      {!!Object.keys(notificationFeeds || {}).length &&
        Object.keys(notificationFeeds).map((id: string) => (
          <NotificationItem
            notificationTitle={notificationFeeds[id].title}
            notificationBody={notificationFeeds[id].message}
            cta={notificationFeeds[id].cta}
            app={notificationFeeds[id].app}
            icon={notificationFeeds[id].icon}
            image={notificationFeeds[id].image}
            theme={'light'}
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
