import React, { useContext } from 'react';
import styled from 'styled-components';
import { ChatList } from './chatSidebar/ChatList';
import { Search } from './Search';
import type {
  ChatFeedsType,
  NotificationFeedsType,
  PushSubTabs,
  PushTabs,
} from '../../../../types';
import { SIDEBAR_PLACEHOLDER_KEYS } from '../../../../types';
import { PUSH_SUB_TABS, PUSH_TABS } from '../../../../types';
import {
  ChatMainStateContext,
  ChatAndNotificationPropsContext,
  NotificationMainStateContext,
  ChatAndNotificationMainContext,
} from '../../../../context';
import useFetchChats from '../../../../hooks/chatAndNotification/chat/useFetchChats';
import { Section, Span, Div } from '../../../reusables/sharedStyling';
import { ChatsFeedList } from './chatSidebar/ChatsFeedList';
import type { ChatMainStateContextType } from '../../../../context/chatAndNotification/chat/chatMainStateContext';
import { AngleArrowIcon } from '../../../../icons/AngleArrow';
import { device, PushSubTabTitle } from '../../../../config';
import {
  getAddress,
  getDefaultFeedObject,
  getNewChatUser,
  getObjectsWithMatchingKeys,
  getSearchedNotificationsList,
  shortenNumber,
  walletToPCAIP10,
} from '../../../../helpers';
import { SpamIconSvg } from '../../../../icons/Spam';
import { InboxNotificationFeedList } from './notificationSidebar/InboxNotificationFeedList';
import useGetChatProfile from '../../../../hooks/chatAndNotification/chat/useGetChatProfile';
import { NotificationFeedList } from './notificationSidebar/NotificationFeedList';
import { SidebarPlaceholder } from './SidebarPlaceholder';
import type { ChatAndNotificationMainContextType } from '../../../../context/chatAndNotification/chatAndNotificationMainContext';
import useFetchChat from '../../../../hooks/chatAndNotification/chat/useFetchChat';
import type { IFeeds } from '@pushprotocol/restapi';

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
  tabValue: PushSubTabs;
  isClickable?: boolean;
};

const Tab: React.FC<TabPropType> = ({ tabName, tabValue }) => {
  const { activeTab, setActiveTab } =
    useContext<ChatAndNotificationMainContextType>(
      ChatAndNotificationMainContext
    );
  const { setSearchedChats, setSelectedChatId } =
    useContext<ChatMainStateContextType>(ChatMainStateContext);
  const { setSearchedNotifications } = useContext<any>(
    NotificationMainStateContext
  );

  // const UnreadChats = () => {
  //   return (
  //     <Section
  //       borderRadius='100px'
  //       background={activeTab === tabValue ? '#0D67FE' : '#62626A'}
  //       height='20px'
  //       width='20px'
  //       alignSelf='center'
  //     >
  //       <Span
  //         fontSize='12px'
  //         color='#FFFFFF'
  //       >
  //         2
  //       </Span>
  //     </Section>
  //   )
  //}
  return (
    <Section
      gap="10px"
      flex="1"
      cursor="pointer"
      onClick={() => {
        setActiveTab(tabValue);
        if (activeTab === PUSH_TABS.CHATS) {
          setSearchedChats(null);
          setSelectedChatId(null);
        } else if (activeTab === PUSH_TABS.APP_NOTIFICATIONS) {
          setSearchedNotifications(null);
        }
      }}
      borderColor={activeTab === tabValue ? '#0D67FE' : '#C8C8CB'}
      borderStyle={
        activeTab === tabValue
          ? ' solid '
          : tabValue === PUSH_TABS.CHATS
          ? 'solid none solid solid'
          : 'solid solid solid none'
      }
      borderWidth="2px"
      borderRadius={
        activeTab === tabValue
          ? '8px'
          : tabValue === PUSH_TABS.CHATS
          ? '8px 0px 0px 8px'
          : '0px 8px 8px 0px'
      }
      position="relative"
      background={activeTab === tabValue ? '#F0F5FF;' : '#FFF'}
      left={tabValue === PUSH_TABS.APP_NOTIFICATIONS ? '-2.2px' : 'auto'}
      right={tabValue === PUSH_TABS.CHATS ? '-2.6px' : 'auto'}
      padding="8px 0"
      zIndex={activeTab === tabValue ? '10' : '0'}
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
      // background="rgb(13 103 254 / 28%)"
      // color="#0D67FE"
      /> */}
    </Section>
  );
};

const SidebarTabs = () => {
  return (
    <Section margin=" 0 0 5px 0">
      <Tab tabName="Chat" tabValue={PUSH_TABS.CHATS} />
      <Tab tabName="App Notifications" tabValue={PUSH_TABS.APP_NOTIFICATIONS} />
    </Section>
  );
};

const SidebarSubTabs: React.FC<SidebarSubTabsPropType> = ({
  subTab,
  tabValue,
  isClickable = false,
}) => {
  const { setActiveSubTab, activeSubTab } =
    useContext<ChatAndNotificationMainContextType>(
      ChatAndNotificationMainContext
    );
  const { setSearchedChats, setSelectedChatId } =
    useContext<ChatMainStateContextType>(ChatMainStateContext);
  const { setSearchedNotifications } = useContext<any>(
    NotificationMainStateContext
  );

  return (
    <SubContainer
      justifyContent="start"
      gap="15px"
      padding="15px 8px"
      cursor={isClickable ? 'pointer' : 'default'}
      onClick={() => {
        if (isClickable) {
          setActiveSubTab(tabValue);
          if (activeSubTab === PUSH_SUB_TABS.REQUESTS) {
            setSearchedChats(null);
            setSelectedChatId(null);
          } else if (activeSubTab === PUSH_SUB_TABS.SPAM) {
            setSearchedNotifications(null);
          }
        }
      }}
    >
      <Span
        padding={
          tabValue === PUSH_SUB_TABS.REQUESTS
            ? '16px 17px 15px 18px'
            : '15px 15px 11px 16px'
        }
        borderRadius="100%"
        border="1px solid #DDDDDF"
        cursor={isClickable ? 'pointer' : 'default'}
      >
        {subTab.icon}
      </Span>
      <Section
        flexDirection="column"
        alignItems="start"
        gap="5px"
        cursor={isClickable ? 'pointer' : 'default'}
      >
        <Span fontWeight="700" fontSize="16px" color="#000">
          {subTab.title}
        </Span>
        <Span
          cursor={isClickable ? 'pointer ' : 'default'}
          textAlign="left"
          fontWeight="400"
          fontSize="16px"
          color={isClickable ? '#0D67FE ' : '#62626A'}
        >
          {subTab.subTitle}
        </Span>
      </Section>
    </SubContainer>
  );
};

export const Sidebar = () => {
  const { loading: chatsLoading } = useFetchChats();
  const { fetchChat } = useFetchChat();

  const { newChat, setNewChat, activeTab, activeSubTab } =
    useContext<ChatAndNotificationMainContextType>(
      ChatAndNotificationMainContext
    );

  const {
    chatsFeed,
    requestsFeed,
    searchedChats,
    web3NameList,
    selectedChatId,
    setSearchedChats,
  } = useContext<ChatMainStateContextType>(ChatMainStateContext);

  const { env } = useContext<any>(ChatAndNotificationPropsContext);
  const {
    spamNotifsFeed,
    allInboxNotifFeed,
    setSearchedNotifications,
    searchedNotifications,
  } = useContext<any>(NotificationMainStateContext);
  const { fetchChatProfile } = useGetChatProfile();
  type PushSubTabDetailsType = {
    [key in PushSubTabs]: {
      title: string;
      subTitle: string;
      icon: any;
    };
  };
  const PushSubTabDetails: PushSubTabDetailsType = {
    REQUESTS: {
      title: PushSubTabTitle.REQUESTS.title,
      subTitle: ` ${shortenNumber(
        Object.keys(requestsFeed || {}).length,
        10
      )} requests from people you may know`,
      icon: <AngleArrowIcon />,
    },
    SPAM: {
      title: PushSubTabTitle.SPAM.title,
      subTitle: `${shortenNumber(
        Object.keys(spamNotifsFeed || {}).length,
        5
      )} messages in your spam box`,
      icon: <SpamIconSvg />,
    },
  };
  type handleSearchType = {
    searchedText: string;
    feed: ChatFeedsType | NotificationFeedsType;
  };
  const handleChatSearch = async ({ searchedText, feed }: handleSearchType) => {
    const result = getObjectsWithMatchingKeys(
      feed as ChatFeedsType,
      searchedText,
      web3NameList
    );
    if (Object.keys(result || {}).length) setSearchedChats(result);
    else {
      // const address = await getAddress(searchedText, env);
      let newChatFeed;
        const newChatUser = await getNewChatUser({
          searchText: searchedText,
          fetchChatProfile,
          env,
        });

        if (newChatUser) {
           newChatFeed = (await fetchChat({
            recipientAddress: newChatUser!.did,
          })) as IFeeds;
          if (!Object.keys(newChatFeed || {}).length)
            {
              newChatFeed = getDefaultFeedObject({ user: newChatUser });
              setSearchedChats({ [newChatFeed.did.toLowerCase()]: newChatFeed });
              setNewChat(true);
            }
            else{
              setSearchedChats({ [newChatFeed.did.toLowerCase()]: newChatFeed });
            }
        }
        else{
          if (!Object.keys(newChatFeed || {}).length) {
            setSearchedChats({});
          }
        }

     
    }
  };
  const onChatSearchReset = () => {
    setSearchedChats(null);
  };
  const handleNotifSearch = async ({
    searchedText,
    feed,
  }: handleSearchType) => {
    const result = getSearchedNotificationsList(
      searchedText,
      feed as NotificationFeedsType
    );
    setSearchedNotifications(result);
  };
  return (
    <Section
      flexDirection="column"
      width="100%"
      height="100%"
      justifyContent="start"
    >
      {!newChat && <SidebarTabs />}

      {activeSubTab !== PUSH_SUB_TABS.REQUESTS &&
        (activeTab === PUSH_TABS.CHATS || newChat) && (
          <Search
            feed={chatsFeed}
            handleSearch={handleChatSearch}
            onSearchReset={onChatSearchReset}
            placeholder="Search name or domain"
          />
        )}

      {activeSubTab !== PUSH_SUB_TABS.SPAM &&
        activeTab === PUSH_TABS.APP_NOTIFICATIONS &&
        !newChat && (
          <Search
            feed={allInboxNotifFeed}
            handleSearch={handleNotifSearch}
            onSearchReset={() => setSearchedNotifications(null)}
            placeholder="Search Notification"
          />
        )}

      {!searchedChats && newChat && (
        <SidebarPlaceholder id={SIDEBAR_PLACEHOLDER_KEYS.NEW_CHAT} />
      )}
      {!newChat &&
        !chatsLoading &&
        !searchedChats &&
        activeTab === PUSH_TABS.CHATS && (
          <>
            <SidebarSubTabs
              subTab={PushSubTabDetails.REQUESTS}
              tabValue="REQUESTS"
              isClickable={!!Object.keys(requestsFeed).length}
            />
            {activeSubTab !== PUSH_SUB_TABS.REQUESTS && <ChatsFeedList />}
          </>
        )}
      {!newChat &&
        !searchedNotifications &&
        activeTab === PUSH_TABS.APP_NOTIFICATIONS && (
          <>
            <SidebarSubTabs
              subTab={PushSubTabDetails.SPAM}
              tabValue="SPAM"
              isClickable={!!Object.keys(spamNotifsFeed).length}
            />
            {activeSubTab !== PUSH_SUB_TABS.SPAM && (
              <InboxNotificationFeedList />
            )}
          </>
        )}
      {(activeTab === PUSH_TABS.CHATS || newChat) && (
        <>
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
            <SidebarPlaceholder id={SIDEBAR_PLACEHOLDER_KEYS.SEARCH} />
          )}
        </>
      )}

      {activeTab === PUSH_TABS.APP_NOTIFICATIONS && !newChat && (
        <>
          <NotificationListCard>
            {searchedNotifications &&
              !!Object.keys(searchedNotifications).length && (
                <NotificationFeedList
                  notificationFeeds={searchedNotifications}
                />
              )}
          </NotificationListCard>
          {searchedNotifications &&
            !Object.keys(searchedNotifications).length && (
              <SidebarPlaceholder id={SIDEBAR_PLACEHOLDER_KEYS.SEARCH} />
            )}
        </>
      )}
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

const NotificationListCard = styled(Div)`
  overflow: hidden auto;
  padding: 0 1px;
  &::-webkit-scrollbar-thumb {
    background: rgb(181 181 186);
    border-radius: 10px;
  }

  &::-webkit-scrollbar {
    width: 5px;
  }
`;

const TabTitleSpan = styled(Span)`
  @media ${device.mobileL} {
    font-size: 14px;
  }
`;
