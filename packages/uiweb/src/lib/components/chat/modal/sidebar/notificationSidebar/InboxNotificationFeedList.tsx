import useFetchChats from '../../../../../hooks/chat/useFetchChats';
import React, { useEffect, useState, useContext, useRef } from 'react';
import styled from 'styled-components';

import { NotificationMainStateContext } from '../../../../../context';

import { Div, Section, Span } from '../../../../reusables/sharedStyling';
import { Spinner } from '../../../../reusables/Spinner';

import { useIsInViewport } from '../../../../../hooks';
import { NotificationFeedList } from './NotificationFeedList';
import useFetchNotification from '../../../../../hooks/notifications/useFetchNotification';

export const InboxNotificationFeedList = () => {
  const { inboxNotifsFeed} = useContext<any>(NotificationMainStateContext);
  const pageRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState<number>(1);
  const [paginateLoading, setPaginateLoading] = useState<boolean>(false);
  const isInViewport1 = useIsInViewport(pageRef, '1px');
  const { fetchNotification } = useFetchNotification();
  
  // const fetchChatList = async () => {
  //   const feeds = await fetchChats({ page, chatLimit });
  //   const firstFeeds: ChatFeedsType = { ...feeds };
  //   setChatsFeed(firstFeeds);
  // };

  // useEffect(() => {
  //   if (Object.keys(chatsFeed).length) {
  //     return;
  //   }
  //   if (decryptedPgpPvtKey) {
  //     fetchChatList();
  //   }
  // }, [fetchChats, decryptedPgpPvtKey, env, page,account]);

  // useEffect(() => {
  //   if (
  //     !isInViewport1 ||
  //     loading ||
  //     Object.keys(chatsFeed).length < chatLimit
  //   ) {
  //     return;
  //   }

  //   const newPage = page + 1;
  //   setPage(newPage);
  //   // eslint-disable-next-line no-use-before-define
  //   callFeeds(newPage);
  // }, [isInViewport1]);

  // const callFeeds = async (page: number) => {
  //   if (!decryptedPgpPvtKey) {
  //     return;
  //   }
  //   try {
  //     setPaginateLoading(true);
  //     const feeds = await fetchChats({ page, chatLimit });
  //     const newFeed: ChatFeedsType = { ...chatsFeed, ...feeds };
  //     setChatsFeed(newFeed);
  //   } catch (error) {
  //     console.log(error);
  //     setPaginateLoading(false);
  //   } finally {
  //     setPaginateLoading(false);
  //   }
  // };

 
console.log(inboxNotifsFeed)

  return (
    <InboxNotifListCard
      overflow="hidden auto"
      justifyContent="start"
      flexDirection="column"
      padding='0 3px'
    >
      <Div>
        <NotificationFeedList notificationFeeds={inboxNotifsFeed} />
        </Div>
    

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
