import React, { useEffect, useState, useContext, useRef } from 'react';
import styled from 'styled-components';

import {
  ChatAndNotificationPropsContext,
  NotificationMainStateContext,
} from '../../../../../context';

import { Div, Section, Span } from '../../../../reusables/sharedStyling';
import { Spinner } from '../../../../reusables/Spinner';

import { useIsInViewport } from '../../../../../hooks';
import { NotificationFeedList } from './NotificationFeedList';
import { notificationLimit } from '../../../../../config';
import type { NotificationFeedsType } from '../../../../../types';
import useFetchNotification from '../../../../../hooks/notifications/useFetchNotification';

export const SpamNotificationFeedList = () => {
  const { spamNotifsFeed, setSpamNotifsFeed } = useContext<any>(
    NotificationMainStateContext
  );
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
    if (feeds) {
      const firstFeeds: NotificationFeedsType = { ...feeds };
      console.log(firstFeeds);
      setSpamNotifsFeed(firstFeeds);
    }
    console.log({});
  };

  useEffect(() => {
    if (Object.keys(spamNotifsFeed).length) {
      return;
    }
    fetchSpamNotificationList();
  }, [env, account]);

  useEffect(() => {
    if (
      !isInViewport1 ||
      loading ||
      Object.keys(spamNotifsFeed).length < notificationLimit
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
      console.log(page);
      const feeds = await fetchNotification({
        page,
        limit: notificationLimit,
        spam: true,
      });
      const newFeed: NotificationFeedsType = { ...spamNotifsFeed, ...feeds };
      console.log(spamNotifsFeed);
      console.log(feeds);
      console.log(newFeed);

      setSpamNotifsFeed(newFeed);
    } catch (error) {
      console.log(error);
      setPaginateLoading(false);
    } finally {
      setPaginateLoading(false);
    }
  };

  return (
    <SpamNotifListCard
      overflow="hidden auto"
      justifyContent="start"
      flexDirection="column"
      width="100%"
      padding="0 3px"
    >
      {(!loading || paginateLoading) &&
      Object.keys(spamNotifsFeed || {}).length ? (
        <Div>
          <NotificationFeedList notificationFeeds={spamNotifsFeed} />
        </Div>
      ) : (
        !paginateLoading &&
        loading && (
          <Section margin="10px 0">
            <Spinner />
          </Section>
        )
      )}
      {!loading && Object.keys(spamNotifsFeed).length === 0 && (
        <Span margin="20px 0 0 0">No messages from apps yet</Span>
      )}
      <div ref={pageRef} />

      {paginateLoading && (
        <Section margin="10px  0">
          <Spinner />
        </Section>
      )}
    </SpamNotifListCard>
  );
};

//styles
const SpamNotifListCard = styled(Section)`
  &::-webkit-scrollbar-thumb {
    background: rgb(181 181 186);
    border-radius: 10px;
  }

  &::-webkit-scrollbar {
    width: 5px;
  }
`;
