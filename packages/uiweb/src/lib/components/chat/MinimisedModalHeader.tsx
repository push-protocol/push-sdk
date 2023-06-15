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
} from '../../context';
import type { PushSubTabs, PushTabs } from '../../types';
import { PUSH_SUB_TABS, PUSH_TABS } from '../../types';
import { useResolveWeb3Name } from '../../hooks';
import { pCAIP10ToWallet, shortenText } from '../../helpers';
import { ethers } from 'ethers';
import { PushSubTabTitle } from '../../config';
import { Tooltip } from '../reusables';

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
  const {
    selectedChatId,
    chatsFeed,
    requestsFeed,
    web3NameList,
    searchedChats,
    setActiveTab,
    setActiveSubTab,
    activeSubTab,
    activeTab,
    setSearchedChats,
    setSelectedChatId,
  } = useContext<any>(ChatMainStateContext);
  const { env } = useContext<any>(ChatAndNotificationPropsContext);
  const selectedChat =
    chatsFeed[selectedChatId] ||
    requestsFeed[selectedChatId] ||
    (searchedChats ? searchedChats[selectedChatId] : null);

  useResolveWeb3Name(selectedChat?.did, env);
  const walletLowercase = pCAIP10ToWallet(selectedChat?.did)?.toLowerCase();
  const checksumWallet = walletLowercase
    ? ethers.utils.getAddress(walletLowercase)
    : null;
  const web3Name = checksumWallet ? web3NameList[checksumWallet] : null;

  const handleBack = () => {
    if (activeSubTab) {
      setActiveSubTab(PUSH_SUB_TABS[activeSubTab as PushSubTabs]);
    } else {
      setActiveTab(PUSH_TABS[activeTab as PushTabs]);
    }
    if (activeSubTab === PUSH_SUB_TABS.REQUESTS || !activeSubTab) {
      setSelectedChatId(null);

      setSearchedChats(null);
    }
  };
  return (
    <Section gap="12px">
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
          <Span fontWeight="700" fontSize="16px" cursor="pointer">
            {' '}
            {selectedChat?.name
              ? shortenText(selectedChat?.name, 30)
              : web3Name ?? shortenText(selectedChat?.did?.split(':')[1], 20)}
          </Span>
        </Tooltip>
      </Section>
    </Section>
  );
};

export const SubTabHeader = () => {
  const {
    setActiveTab,
    activeSubTab,
    activeTab,
    setSearchedChats,
    setSelectedChatId,
  } = useContext<any>(ChatMainStateContext);
  const { setSearchedNotifications } = useContext<any>(
    NotificationMainStateContext
  );
  return (
    <Section gap="12px">
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

      <Span fontWeight="700" fontSize="16px">
        {PushSubTabTitle[activeSubTab as PushSubTabs].title}
      </Span>
    </Section>
  );
};

export const MinimisedModalHeader: React.FC<MinimisedModalHeaderPropType> = ({
  onMaximizeMinimizeToggle,
  modalOpen,
}) => {
  const {
    setActiveTab,
    activeSubTab,
    selectedChatId,
    setNewChat,
    chatsFeed,
    requestsFeed,
    setSearchedChats,
    setSelectedChatId,
    newChat,
    searchedChats,
  } = useContext<any>(ChatMainStateContext);

  const condition =
    (selectedChatId && modalOpen) ||
    (!selectedChatId && modalOpen && activeSubTab);
  return (
    <Container
      justifyContent="space-between"
      alignItems="center"
      padding={`0 0 ${condition ? '19px' : '23px'} 0 `}
      borderWidth={`0 0 ${condition ? '1px' : '0'} 0 `}
      borderStyle={`none none ${condition ? 'dashed' : 'none'} none `}
      borderColor={`transparent transparent ${
        condition ? '#ededee' : 'transparent'
      }  transparent`}
    >
      {selectedChatId &&
        !!(
          Object.keys(chatsFeed || {}).length ||
          Object.keys(requestsFeed || {}).length ||
          Object.keys(searchedChats || {}).length
        ) &&
        modalOpen && <MessageBoxHeader />}
      {!selectedChatId && modalOpen && activeSubTab && <SubTabHeader />}
      {((!selectedChatId && modalOpen && !activeSubTab) || !modalOpen) && (
        <Section gap="4px">
          <Span
            fontWeight="700"
            fontSize="18px"
            cursor={!modalOpen ? 'default' : 'pointer'}
            onClick={() => {
              setActiveTab(PUSH_TABS.CHATS);

              setSearchedChats(null);
              setSelectedChatId(null);
            }}
          >
            Messages
          </Span>
          {/* <UnreadChats 
          // numberOfUnreadMessages="3"
           /> */}
        </Section>
      )}
      <Section gap="20px">
        {((!selectedChatId && modalOpen && !activeSubTab) || !modalOpen) && (
          <Div
            width="20px"
            height="20px"
            cursor="pointer"
            onClick={() => setNewChat(true)}
          >
            <NewChatIcon />
          </Div>
        )}
        <Div
          width="12px"
          height="13.4px"
          cursor="pointer"
          alignSelf="baseline"
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
