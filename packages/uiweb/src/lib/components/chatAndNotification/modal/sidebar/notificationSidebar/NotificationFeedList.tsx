import type { NotificationFeedsType } from '../../../../../types';
import React, { useContext } from 'react';
import type { chainNameType} from '../../../../notification';
import { NotificationItem } from '../../../../notification';
import { NotificationMainStateContext } from '../../../../../context';
import useOnSubscribeToChannel from '../../../../../hooks/notifications/useOnSubscribeToChannel';

type NotificationFeedListPropType = {
 notificationFeeds : NotificationFeedsType;
 isSpam?:boolean
};

export const NotificationFeedList: React.FC<NotificationFeedListPropType> = ({ notificationFeeds,isSpam=false }) => {
 
  const {subscriptionStatus} = useContext<any>(
    NotificationMainStateContext
  );
  const {onSubscribeToChannel} = useOnSubscribeToChannel();
  const isSubscribedFn = (channel: string) => {
    return subscriptionStatus[channel];
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
          isSpam = {isSpam}
          subscribeFn={isSpam?() => onSubscribeToChannel({channelAddress:notificationFeeds[id].channel}):undefined}
          isSubscribedFn={isSpam? isSubscribedFn(notificationFeeds[id].channel):undefined}
          chainName={notificationFeeds[id].blockchain as chainNameType}
          url={notificationFeeds[id].url}
        />
        ))}
    </>
  );
};

//styles

