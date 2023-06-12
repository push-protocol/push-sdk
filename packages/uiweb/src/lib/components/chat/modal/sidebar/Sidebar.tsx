import React, { useContext } from 'react';
import styled from 'styled-components';
import { ChatList } from './ChatList';
import { Search } from './Search';
import type {
  PushSubTabs,
  PushTabs} from '../../../../types';
import {
  PUSH_SUB_TABS,
  PUSH_TABS,
} from '../../../../types';
import { ChatMainStateContext, ChatPropsContext } from '../../../../context';
import useFetchChats from '../../../../hooks/chat/useFetchChats';
import { Spinner } from '../../../reusables/Spinner';
import { Section, Span, Image } from '../../../reusables/sharedStyling';
import { ChatsFeedList } from './ChatsFeedList';
import type { ChatMainStateContextType } from '../../../../context/chat/chatMainStateContext';
import { AngleArrowIcon } from '../../../../icons/AngleArrow';
import { device } from '../../../../config';
import { shortenNumber } from '../../../../helpers';

export type TabPropType = {
  tabName: string;
  tabValue: PushTabs;
};

type SidebarSubTabsPropType = {
  subTab: {
    title: string;
    subTitle: string;
    icon: any;
  };
  tabValue: 'REQUESTS';
};

const Tab: React.FC<TabPropType> = ({ tabName, tabValue }) => {
  const { setActiveTab, activeTab, setSearchedChats, setSelectedChatId } =
    useContext<any>(ChatMainStateContext);

  return (
    <Section
      gap="10px"
      flex="1"
      borderStyle="solid"
      cursor="pointer"
      onClick={() => {
        setActiveTab(tabValue);
        setSearchedChats(null);
        setSelectedChatId(null);
      }}
      borderColor={activeTab === tabValue ? '#0D67FE' : '#DDDDDF'}
      borderWidth={activeTab === tabValue ? '0 0 2px 0' : '0 0 1px 0'}
      padding="0 0 15px 0"
    >
      <TabTitleSpan
        color={activeTab === tabValue ? '#0D67FE' : '#62626A'}
        fontSize="16px"
        fontWeight="600"
        cursor="pointer"
      >
        {tabName}
      </TabTitleSpan>
      {/* <UnreadChats
        // numberOfUnreadMessages="2"
        background="rgb(13 103 254 / 28%)"
        color="#0D67FE"
      /> */}
    </Section>
  );
};

const SidebarTabs = () => {
  return (
    <Section padding=" 0 0 10px 0">
      <Tab tabName="Chat" tabValue={PUSH_TABS.CHATS} />
      <Tab tabName="App Notifications" tabValue={PUSH_TABS.APP_NOTIFICATIONS} />
    </Section>
  );
};

const SidebarSubTabs: React.FC<SidebarSubTabsPropType> = ({
  subTab,
  tabValue,
}) => {
  const { setActiveSubTab, setSearchedChats, setSelectedChatId } =
    useContext<any>(ChatMainStateContext);

  return (
    <SubContainer
      justifyContent="start"
      gap="15px"
      padding="15px 8px"
      cursor="pointer"
      onClick={() => {
        setActiveSubTab(tabValue);
        setSelectedChatId(null);
        setSearchedChats(null);
      }}
    >
      <Span
        padding="15px 16px 14px 17px"
        borderRadius="100%"
        border="1px solid #DDDDDF"
        cursor="pointer"
      >
        {subTab.icon}
      </Span>
      <Section
        flexDirection="column"
        alignItems="start"
        gap="5px"
        cursor="pointer"
      >
        <Span fontWeight="700" fontSize="16px" color="#000">
          {subTab.title}
        </Span>
        <Span textAlign="left" fontWeight="400" fontSize="16px" color="#62626A">
          {subTab.subTitle}
        </Span>
      </Section>
    </SubContainer>
  );
};

export const Sidebar = () => {
  const { loading: chatsLoading } = useFetchChats();
  const {
    chatsFeed,
    requestsFeed,
    activeTab,
    setRequestsFeed,
    searchedChats,
    activeSubTab,
    newChat,
  } = useContext<ChatMainStateContextType>(ChatMainStateContext);
  const { decryptedPgpPvtKey, account, env } =
    useContext<any>(ChatPropsContext);

  type PushSubTabDetailsType = {
    [key in PushSubTabs]: {
      title: string;
      subTitle: string;
      icon: any;
    };
  };
  const PushSubTabDetails: PushSubTabDetailsType = {
    REQUESTS: {
      title: 'Chat request',
      subTitle: `you have ${shortenNumber(
        Object.keys(requestsFeed || {}).length
      )} requests from people you may know`,
      icon: <AngleArrowIcon/>,
    },
  };

  return (
    <Section
      //   margin="24px 0 0 0"
      flexDirection="column"
      width="100%"
      height="100%"
      justifyContent="start"
    >
      {!newChat && <SidebarTabs />}
      {activeTab === PUSH_TABS.CHATS &&
        activeSubTab !== PUSH_SUB_TABS.REQUESTS && (
          <Search chatsFeed={chatsFeed} />
        )}

      {!newChat &&
        !chatsLoading &&
        !searchedChats &&
        activeTab === PUSH_TABS.CHATS && (
          <>
            <SidebarSubTabs
              subTab={PushSubTabDetails['REQUESTS']}
              tabValue="REQUESTS"
            />
            {activeSubTab !== PUSH_SUB_TABS.REQUESTS && <ChatsFeedList />}
          </>
        )}
      <ChatListCard
        overflow="hidden auto"
        justifyContent="start"
        gap="2.5px"
        width="100%"
        flexDirection="column"
      >
        {searchedChats && !!Object.keys(searchedChats).length && (
          <ChatList chatsFeed={searchedChats} />
        )}
      </ChatListCard>
      {searchedChats && !Object.keys(searchedChats).length && (
        <Span width="100%" margin="10px 0 0 10px" textAlign="left">
          No user found
        </Span>
      )}

      {/* Spinner not working shift to chatsFeedList */}
      {chatsLoading && <Spinner />}
    </Section>
  );
};

//styles
const SubContainer = styled(Section)`
  border-bottom: 1px dashed #ededee;
  cursor: pointer;
  &:hover {
    background: #f4f5fa;
  }
`;
const ChatListCard = styled(Section)`
  &::-webkit-scrollbar-thumb {
    background: rgb(181 181 186);
    border-radius: 10px;
  }

  &::-webkit-scrollbar {
    width: 5px;
  }
`;

const TabTitleSpan = styled(Span)`
  @media ${device.mobileS} {
    font-size: 15px;
  }
`;
