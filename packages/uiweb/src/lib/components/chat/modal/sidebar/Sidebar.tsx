import React, { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { ChatList } from './ChatList';
import { Search } from './Search';
import { PushTabs, PUSH_TABS } from '../../../../types';
import { ChatMainStateContext, ChatPropsContext } from '../../../../context';
import useFetchChats from '../../../../hooks/chat/useFetchChats';
import { Spinner } from '../../../reusables/Spinner';
import { Section, Span } from '../../../reusables/sharedStyling';
import { UnreadChats } from '../../MinimisedModalHeader';
import useFetchRequests from '../../../../hooks/chat/useFetchRequests';
import { RequestsFeedList } from './RequestsFeedList';
import { ChatsFeedList } from './ChatsFeedList';

const chatLimit = 10;

export type TabPropType = {
  tabName: string;
  tabValue: PushTabs;
};

const Tab: React.FC<TabPropType> = ({ tabName, tabValue }) => {
  const { setActiveTab, activeTab } = useContext<any>(ChatMainStateContext);
  return (
    <Section
      gap="10px"
      flex="1"
      borderStyle="solid"
      borderColor={activeTab === tabValue ? '#0D67FE' : '#DDDDDF'}
      borderWidth={activeTab === tabValue ? '0 0 2px 0' : '0 0 1px 0'}
      padding="0 0 15px 0"
    >
      <Span
        color={activeTab === tabValue ? '#0D67FE' : '#62626A'}
        fontSize="16px"
        fontWeight="600"
        cursor="pointer"
        onClick={() => setActiveTab(tabValue)}
      >
        {tabName}
      </Span>
      <UnreadChats
        numberOfUnreadMessages="2"
        background="rgb(13 103 254 / 28%)"
        color="#0D67FE"
      />
    </Section>
  );
};

const SidebarTabs = () => {
  return (
    <Section padding=" 0 0 10px 0">
      <Tab tabName="Chat" tabValue={PUSH_TABS.CHATS} />
      <Tab tabName="Requests" tabValue={PUSH_TABS.REQUESTS} />
    </Section>
  );
};

export const Sidebar = () => {
  const { loading: chatsLoading } = useFetchChats();
  const { chatsFeed, activeTab, requestsFeed, searchedChats, newChat } =
    useContext<any>(ChatMainStateContext);
  const { decryptedPgpPvtKey, account, env } =
    useContext<any>(ChatPropsContext);

  const testRef = useRef<HTMLDivElement>(null);
  const [chatPage, setChatPage] = useState<number>(1);

  const { fetchChats } = useFetchChats();
  const { fetchRequests } = useFetchRequests();

  const fetchChatList = async () => {
    await fetchChats();
  };
  const fetchRequestList = async () => {
    await fetchRequests();
  };

  useEffect(() => {
    if (decryptedPgpPvtKey) {
      fetchChatList();
      fetchRequestList();
    }
  }, [account, decryptedPgpPvtKey, env, chatPage]);

  return (
    <Container
      margin="24px 0 0 0"
      flexDirection="column"
      width="100%"
      height="100%"
      justifyContent="start"
    >
      {!newChat && <SidebarTabs />}
      <Search
        chatsFeed={activeTab === PUSH_TABS.CHATS ? chatsFeed : requestsFeed}
      />

      {!newChat &&
        !chatsLoading &&
        !searchedChats &&
        activeTab === PUSH_TABS.CHATS && <ChatsFeedList />}

      {!newChat &&
        !chatsLoading &&
        !searchedChats &&
        activeTab === PUSH_TABS.REQUESTS && <RequestsFeedList />}

      {searchedChats && !!Object.keys(searchedChats).length && (
        <ChatList chatsFeed={searchedChats} />
      )}
      {searchedChats && !Object.keys(searchedChats).length && (
        <Span width="100%" margin="10px 0 0 10px" textAlign="left">
          No user found
        </Span>
      )}

      {/* Spinner not working */}
      {chatsLoading && <Spinner />}
    </Container>
  );
};

//styles
const Container = styled(Section)``;
