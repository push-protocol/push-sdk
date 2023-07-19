import React, { useEffect, useState, useContext, useRef } from 'react';
import styled from 'styled-components';

import {
  ChatAndNotificationPropsContext,
  NotificationMainStateContext,
} from '../../../../../context';

import { Div, Section } from '../../../../reusables/sharedStyling';
import { Spinner } from '../../../../reusables/Spinner';

import { useIsInViewport } from '../../../../../hooks';
import { NotificationFeedList } from './NotificationFeedList';
import useFetchNotification from '../../../../../hooks/notifications/useFetchNotification';
import type {
  NotificationFeedsType, ParsedNotificationType} from '../../../../../types';
import {
  SIDEBAR_PLACEHOLDER_KEYS,
} from '../../../../../types';
import { notificationLimit } from '../../../../../config';
import { SidebarPlaceholder } from '../SidebarPlaceholder';

export const InboxNotificationFeedList = () => {
  const {
    inboxNotifsFeed,
    setInboxNotifsFeed,
    allInboxNotifFeed,
    setAllInboxNotifsFeed,
    setSpamNotifsFeed,
    spamNotifsFeed,
  } = useContext<any>(NotificationMainStateContext);
  const pageRef = useRef<HTMLDivElement>(null);
  const { account, env } = useContext<any>(ChatAndNotificationPropsContext);
  const [page, setPage] = useState<number>(1);
  const [paginateLoading, setPaginateLoading] = useState<boolean>(false);
  const isInViewport1 = useIsInViewport(pageRef, '1px');
  const { fetchNotification, loading } = useFetchNotification();

 
  const fetchSpamNotificationList = async () => {
    const feeds: NotificationFeedsType | undefined = await fetchNotification({
      page: 1,
      limit: notificationLimit,
      spam: true,
    });
    //change type of notification
    if (feeds) {
      const firstFeeds: NotificationFeedsType = { ...feeds };
      setSpamNotifsFeed(firstFeeds);
    }
  };

  useEffect(() => {
    if (Object.keys(spamNotifsFeed).length) {
      return;
    }
    fetchSpamNotificationList();
  }, [env, account]);

  const fetchInboxNotificationList = async () => {
    const feeds: NotificationFeedsType | undefined = await fetchNotification({
      page: 1,
      limit: notificationLimit,
    });
    //change type of notification
    if (feeds) {
      const firstFeeds: NotificationFeedsType = { ...feeds };
      setInboxNotifsFeed(firstFeeds);
    }
  };
  useEffect(() => {
    if (Object.keys(inboxNotifsFeed).length) {
      return;
    }
    if (account) {
      fetchInboxNotificationList();
    }
  }, [fetchNotification, env, page, account]);

  useEffect(() => {
    if (Object.keys(allInboxNotifFeed).length) {
      return;
    }
    if (account) {
      (async () => {
        const feeds = await fetchNotification({ page, limit: 10000 });
        setAllInboxNotifsFeed({ ...feeds });
      })();
    }
  }, [fetchNotification, env, page, account]);

  useEffect(() => {
   
    if (
      !isInViewport1 ||
      loading 
      ||
      Object.keys(inboxNotifsFeed).length < notificationLimit
    ) {
      return;
    }

    const newPage = page + 1;
    setPage(newPage);
    // eslint-disable-next-line no-use-before-define
    callFeeds(newPage);
  }, [isInViewport1]);

  const callFeeds = async (page: number) => {
    if (!account) {
      return;
    }
    try {
      setPaginateLoading(true);
      const feeds = await fetchNotification({ page, limit: notificationLimit });      
      const newFeed:NotificationFeedsType = {...inboxNotifsFeed,...feeds};
    
      setInboxNotifsFeed(newFeed);
    } catch (error) {
      console.log(error);
      setPaginateLoading(false);
    } finally {
      setPaginateLoading(false);
    }
  };

  return (
    <InboxNotifListCard
      overflow="hidden auto"
      justifyContent="start"
      flexDirection="column"
      padding="0 3px"
    >
      {(!loading || paginateLoading) &&
      Object.keys(inboxNotifsFeed || {}).length ? (
        <Div>
          <NotificationFeedList notificationFeeds={inboxNotifsFeed} />
        </Div>
      ) : (
        !paginateLoading &&
        loading && (
          <Section margin="10px 0">
            <Spinner />
          </Section>
        )
      )}
      {!loading && Object.keys(inboxNotifsFeed).length === 0 && (
        <SidebarPlaceholder id={SIDEBAR_PLACEHOLDER_KEYS.NOTIFICATION} />
      )}

      <div ref={pageRef} style={{padding:'1px'}}></div>

      {paginateLoading && (
        <Section margin="10px  0">
          <Spinner />
        </Section>
      )}
    </InboxNotifListCard>
  );
};

//styles
const InboxNotifListCard = styled(Section)`
  &::-webkit-scrollbar-thumb {
    background: rgb(181 181 186);
    border-radius: 10px;
  }

  &::-webkit-scrollbar {
    width: 5px;
  }
`;
