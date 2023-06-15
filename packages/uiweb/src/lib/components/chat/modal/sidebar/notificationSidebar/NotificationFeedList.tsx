import type { NotificationFeedsType } from '../../../../../types';
import React, { useContext } from 'react';
import type { chainNameType} from '../../../../notification';
import { NotificationItem } from '../../../../notification';

type NotificationFeedListPropType = {
 notificationFeeds : NotificationFeedsType;
};

export const NotificationFeedList: React.FC<NotificationFeedListPropType> = ({ notificationFeeds }) => {

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
          chainName={notificationFeeds[id].blockchain as chainNameType}
          url={notificationFeeds[id].url}
        />
        ))}
    </>
  );
};

//styles

