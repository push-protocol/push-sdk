import useFetchChats from '../../../../../hooks/chat/useFetchChats';
import React, { useEffect, useState, useContext, useRef } from 'react';
import styled from 'styled-components';

import {
  ChatMainStateContext,
  ChatAndNotificationPropsContext,
} from '../../../../../context';
import { ChatList } from './ChatList';
import { Section } from '../../../../reusables/sharedStyling';
import { Spinner } from '../../../../reusables/Spinner';
import { chatLimit } from '../../../../../config';
import type { ChatFeedsType } from '../../../../../types';
import { SIDEBAR_PLACEHOLDER_KEYS } from '../../../../../types';
import { useIsInViewport } from '../../../../../hooks';
import { SidebarPlaceholder } from '../SidebarPlaceholder';
import type { ChatMainStateContextType } from '../../../../../context/chatAndNotification/chat/chatMainStateContext';

export const ChatsFeedList = () => {
  const { chatsFeed, setChatsFeed,finishedFetchingChats,setFinishedFetchingChats } =
    useContext<ChatMainStateContextType>(ChatMainStateContext);
  const pageRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState<number>(1);
  const [paginateLoading, setPaginateLoading] = useState<boolean>(false);
  const isInViewport1 = useIsInViewport(pageRef, '1px');
  const { decryptedPgpPvtKey, account, env } = useContext<any>(
    ChatAndNotificationPropsContext
  );
  const { fetchChats, loading } = useFetchChats();

  const fetchChatList = async () => {
    const feeds = await fetchChats({ page, chatLimit });
    const firstFeeds: ChatFeedsType = { ...feeds };
    setChatsFeed(firstFeeds);
  };

  useEffect(() => {
    if (Object.keys(chatsFeed).length) {
      return;
    }
    if (decryptedPgpPvtKey) {
      fetchChatList();
    }
  }, [fetchChats, env, page, account]);

  useEffect(() => {
    if (
      !isInViewport1 ||
      loading || finishedFetchingChats
      // ||
      // Object.keys(chatsFeed).length < chatLimit
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
      const feeds = await fetchChats({ page, chatLimit });
      if(!Object.keys(feeds || {}).length) setFinishedFetchingChats(true);
      const newFeed: ChatFeedsType = { ...chatsFeed, ...feeds };
      setChatsFeed(newFeed);
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
      flexDirection="column"
    >
      {(!loading || paginateLoading) && Object.keys(chatsFeed || {}).length ? (
        <ChatList chatsFeed={chatsFeed} />
      ) : (
        !paginateLoading &&
        loading && (
          <Section margin="10px 0">
            <Spinner />
          </Section>
        )
      )}
      {!loading && Object.keys(chatsFeed).length === 0 && (
        <SidebarPlaceholder id={SIDEBAR_PLACEHOLDER_KEYS.CHAT} />
      )}

      <div ref={pageRef} style={{ padding: '1px' }}></div>

      {paginateLoading && (
        <Section margin="10px  0">
          <Spinner />
        </Section>
      )}
    </ChatListCard>
  );
};

//styles
const ChatListCard = styled(Section)`
  padding:0px 3px 0px 0px;
  &::-webkit-scrollbar-thumb {
    background: rgb(181 181 186);
    border-radius: 10px;
  }

  &::-webkit-scrollbar {
    width: 5px;
  }
`;
