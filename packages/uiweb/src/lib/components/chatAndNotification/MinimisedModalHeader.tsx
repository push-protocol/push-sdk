import React, { useContext } from 'react';
import styled from 'styled-components';
import { MaximizeIcon } from '../../icons/Maximize';
import { NewChatIcon } from '../../icons/NewChat';
import { BackIcon } from '../../icons/Back';
import { MinimizeIcon } from '../../icons/Minimize';
import { Section, Span, Image, Div } from '../reusables/sharedStyling';
import {
  ChatMainStateContext,
  ChatAndNotificationPropsContext,
  NotificationMainStateContext,
  ChatAndNotificationMainContext,
} from '../../context';
import type { PushSubTabs, PushTabs } from '../../types';
import { PUSH_SUB_TABS, PUSH_TABS } from '../../types';
import { pCAIP10ToWallet, shortenText } from '../../helpers';
import { PushSubTabTitle } from '../../config';
import { Tooltip } from '../reusables';
import type { ChatAndNotificationMainContextType } from '../../context/chatAndNotification/chatAndNotificationMainContext';
import type { ChatMainStateContextType } from '../../context/chatAndNotification/chat/chatMainStateContext';
import { ChatSnap } from './modal/sidebar/chatSidebar/ChatSnap';
import { useDomianName } from '../../hooks';

type MinimisedModalHeaderPropType = {
  onMaximizeMinimizeToggle: () => void;
  modalOpen: boolean;
};

export const UnreadChats = ({
  // numberOfUnreadMessages,
  background,
  color,
}: {
  // numberOfUnreadMessages: string;
  background?: string;
  color?: string;
}) => {
  return (
    <Span
      fontWeight="600"
      fontSize="12px"
      color={color ?? '#fff'}
      background={background ?? '#0D67FE'}
      padding="8px"
      borderRadius="100%"
    >
      {/* {numberOfUnreadMessages} */}
    </Span>
  );
};

export const MessageBoxHeader = () => {
  const { activeTab, setActiveTab, setActiveSubTab, activeSubTab } =
    useContext<ChatAndNotificationMainContextType>(ChatAndNotificationMainContext);
  const { selectedChatId, chatsFeed, requestsFeed, searchedChats, setSearchedChats, setSelectedChatId } =
    useContext<ChatMainStateContextType>(ChatMainStateContext);
  const { env } = useContext<any>(ChatAndNotificationPropsContext);
  const { spamNotifsFeed } = useContext<any>(NotificationMainStateContext);
  const selectedChat =
    chatsFeed[selectedChatId as string] ||
    requestsFeed[selectedChatId as string] ||
    (Object.keys(searchedChats || {}).length ? searchedChats![selectedChatId as string] : null);
  const web3Name = useDomianName(selectedChat?.did, env);

  const handleBack = () => {
    if (
      activeSubTab &&
      ((activeSubTab === PUSH_SUB_TABS.REQUESTS && Object.keys(requestsFeed || {}).length) ||
        (activeSubTab === PUSH_SUB_TABS.SPAM && Object.keys(spamNotifsFeed || {}).length))
    ) {
      setActiveSubTab(PUSH_SUB_TABS[activeSubTab as PushSubTabs]);
    } else {
      setActiveTab(PUSH_TABS[activeTab as PushTabs]);
    }
    if (activeSubTab === PUSH_SUB_TABS.REQUESTS || !activeSubTab) {
      setSelectedChatId(null);

      setSearchedChats(null);
    }
  };

  return selectedChat ? (
    <Section
      gap="12px"
      padding="23px 2px"
    >
      <Div
        width="16px"
        height="16px"
        cursor="pointer"
        onClick={() => handleBack()}
      >
        <BackIcon />
      </Div>

      <Section gap="8px">
        <Image
          src={selectedChat.profilePicture!}
          alt="profile picture"
          width="24px"
          height="24px"
          borderRadius="100%"
        />
        <Tooltip
          content={pCAIP10ToWallet(selectedChat?.did)}
          direction="bottom-right"
        >
          <Span
            fontWeight="700"
            fontSize="16px"
            cursor="pointer"
          >
            {' '}
            {selectedChat?.name
              ? shortenText(selectedChat?.name, 30)
              : web3Name ?? shortenText(selectedChat?.did?.split(':')[1], 20)}
          </Span>
        </Tooltip>
      </Section>
    </Section>
  ) : null;
};

export const SubTabHeader = () => {
  const { activeTab, setActiveTab, activeSubTab } =
    useContext<ChatAndNotificationMainContextType>(ChatAndNotificationMainContext);
  const { setSearchedChats, setSelectedChatId } = useContext<ChatMainStateContextType>(ChatMainStateContext);
  const { setSearchedNotifications } = useContext<any>(NotificationMainStateContext);
  return (
    <Section
      gap="12px"
      padding="23px 2px"
    >
      <Div
        width="16px"
        height="16px"
        cursor="pointer"
        onClick={() => {
          setActiveTab(activeTab);
          if (activeSubTab === PUSH_SUB_TABS.REQUESTS) {
            setSearchedChats(null);
            setSelectedChatId(null);
          }
          if (activeSubTab === PUSH_SUB_TABS.SPAM) {
            setSearchedNotifications(null);
          }
        }}
      >
        <BackIcon />
      </Div>

      <Span
        fontWeight="700"
        fontSize="16px"
      >
        {PushSubTabTitle[activeSubTab as PushSubTabs].title}
      </Span>
    </Section>
  );
};

export const MinimisedModalHeader: React.FC<MinimisedModalHeaderPropType> = ({
  onMaximizeMinimizeToggle,
  modalOpen,
}) => {
  const { newChat, setNewChat, setActiveTab, activeSubTab } =
    useContext<ChatAndNotificationMainContextType>(ChatAndNotificationMainContext);

  const { selectedChatId, chatsFeed, requestsFeed, setSearchedChats, setSelectedChatId, searchedChats } =
    useContext<ChatMainStateContextType>(ChatMainStateContext);

  const SnapMessageHeader = () => {
    const selectedChat =
      chatsFeed[selectedChatId as string] ||
      requestsFeed[selectedChatId as string] ||
      (Object.keys(searchedChats || {}).length ? searchedChats![selectedChatId as string] : null);
    return (
      <ChatSnap
        chat={selectedChat}
        id={selectedChatId as string}
        modalOpen={modalOpen}
      />
    );
  };

  const condition = (selectedChatId && modalOpen) || (!selectedChatId && modalOpen && activeSubTab);
  const snapCondition = selectedChatId && !modalOpen;
  return (
    <Container
      justifyContent="space-between"
      alignItems="center"
      padding={`${snapCondition ? '12px' : '0'} 0 `}
      borderWidth={`0 0 ${condition ? '1px' : '0'} 0 `}
      borderStyle={`none none ${condition ? 'dashed' : 'none'} none `}
      borderColor={`transparent transparent ${condition ? '#ededee' : 'transparent'}  transparent`}
    >
      {selectedChatId &&
        !!(
          Object.keys(chatsFeed || {}).length ||
          Object.keys(requestsFeed || {}).length ||
          Object.keys(searchedChats || {}).length
        ) &&
        modalOpen && <MessageBoxHeader />}

      {selectedChatId && !modalOpen && <SnapMessageHeader />}

      {!selectedChatId && modalOpen && activeSubTab && <SubTabHeader />}
      {((!selectedChatId && modalOpen && !activeSubTab) || (!modalOpen && !selectedChatId)) && (
        <Section gap="4px">
          <Span
            fontWeight="700"
            fontSize="18px"
            padding="24px 2px"
            cursor={!modalOpen ? 'default' : 'pointer'}
            onClick={() => {
              setActiveTab(PUSH_TABS.CHATS);
              setSearchedChats(null);
              setSelectedChatId(null);
            }}
          >
            {newChat ? 'New Message' : 'Messages'}
          </Span>
          {/* <UnreadChats 
          // numberOfUnreadMessages="3"
           /> */}
        </Section>
      )}
      <Section gap="20px">
        {((!selectedChatId && modalOpen && !activeSubTab && !newChat) || (!modalOpen && !selectedChatId)) && (
          <Div
            width="20px"
            height="20px"
            cursor="pointer"
            onClick={() => {
              if (modalOpen) {
                setNewChat(true);
              }
            }}
          >
            <NewChatIcon />
          </Div>
        )}
        <Div
          width="12px"
          height="13.4px"
          cursor="pointer"
          // alignSelf={selectedChatId && !modalOpen ? 'center' : 'baseline'}
          margin="0 0 10px 0"
          alignSelf="center"
          onClick={onMaximizeMinimizeToggle}
        >
          {modalOpen ? <MinimizeIcon /> : <MaximizeIcon />}
        </Div>
      </Section>
    </Container>
  );
};

//styles
const Container = styled(Section)`
  box-sizing: border-box;
`;
