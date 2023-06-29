import useFetchRequests from '../../../../../hooks/chat/useFetchRequests';
import React, { useEffect, useState, useContext, useRef } from 'react';
import styled from 'styled-components';
import { ChatMainStateContext, ChatAndNotificationPropsContext } from '../../../../../context';
import { ChatList } from './ChatList';
import { Section, Span } from '../../../../reusables/sharedStyling';
import { Spinner } from '../../../../reusables/Spinner';
import { requestLimit } from '../../../../../config';
import type { ChatFeedsType } from '../../../../../types';
import { useIsInViewport } from '../../../../../hooks';
import type { ChatMainStateContextType } from '../../../../../context/chatAndNotification/chat/chatMainStateContext';

export const RequestsFeedList = () => {
  const { requestsFeed, setRequestsFeed } = useContext<ChatMainStateContextType>(ChatMainStateContext);
  const pageRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState<number>(1);
  const [paginateLoading, setPaginateLoading] = useState<boolean>(false);
  const isInViewport1 = useIsInViewport(pageRef, '1px');
  const { decryptedPgpPvtKey, env } =
    useContext<any>(ChatAndNotificationPropsContext);
  const { fetchRequests, loading } = useFetchRequests();

  const fetchRequestList = async () => {
    const feeds = await fetchRequests({ page, requestLimit });
    const firstFeeds: ChatFeedsType = { ...feeds };
    setRequestsFeed(firstFeeds);
  };

  useEffect(() => {
    if (Object.keys(requestsFeed).length) {
      return;
    }
    if (decryptedPgpPvtKey) {
      fetchRequestList();
    }
  }, [fetchRequests, decryptedPgpPvtKey, env, page]);

  useEffect(() => {
    if (
      !isInViewport1 ||
      loading ||
      Object.keys(requestsFeed).length < requestLimit
    ) {
      return;
    }

    const newPage = page + 1;
    setPage(newPage);
    // eslint-disable-next-line no-use-before-define
    callFeeds(newPage);
  }, [isInViewport1]);

  const callFeeds = async (page: number) => {
    if (!decryptedPgpPvtKey) {
      return;
    }
    try {
      setPaginateLoading(true);
      const feeds = await fetchRequests({ page, requestLimit });
      const newFeed: ChatFeedsType = { ...requestsFeed, ...feeds };
      setRequestsFeed(newFeed);
    } catch (error) {
      console.log(error);
      setPaginateLoading(false);
    } finally {
      setPaginateLoading(false);
    }
  };


  return (
    <ChatListCard
    overflow="hidden auto"
    justifyContent="start"
    width='100%'
    flexDirection="column"
    borderWidth="1px 0 00"
    borderStyle={ "dashed none none none"}
    borderColor="#dddddf transparent transparent transparent"
  >
    {(!loading || paginateLoading) && Object.keys(requestsFeed || {}).length ? (
      <ChatList chatsFeed={requestsFeed} />
    ) : (
      !paginateLoading && loading && (
        <Section margin="10px  0">
          <Spinner />
        </Section>
      )
    )}
    {!loading && Object.keys(requestsFeed).length === 0 && (
      <Span margin='20px 0 0 0'>No Requests yet</Span>
    )}

<div ref={pageRef} style={{padding:'1px'}}></div>

    {paginateLoading && (
      <Section margin="10px 0">
        <Spinner />
      </Section>
    )}
  </ChatListCard>
  );
};

//styles
const ChatListCard = styled(Section)`
  &::-webkit-scrollbar-thumb {
    background: rgb(181 181 186);
    border-radius: 10px;
  }

  &::-webkit-scrollbar {
    width: 5px;
  }
`;
