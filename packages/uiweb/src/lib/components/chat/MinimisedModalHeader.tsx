import React, { useContext } from 'react';
import styled from 'styled-components';
import EnvelopeIcon from '../../icons/envelope.svg';
import MaximizeIcon from '../../icons/maximize.svg';
import NewChatIcon from '../../icons/newChat.svg';
import BackIcon from '../../icons/back.svg';
import MinimizeIcon from '../../icons/minimize.svg';
import { Section, Span, Image } from '../reusables/sharedStyling';
import { ChatMainStateContext, ChatPropsContext } from '../../context';
import { PushSubTabs, PushTabs, PUSH_SUB_TABS, PUSH_TABS } from '../../types';
import { useResolveWeb3Name } from '../../hooks';
import {
  pCAIP10ToWallet,
  shortenText,
} from '../../helpers';
import { ethers } from 'ethers';
import { PushSubTabTitle } from '../../config';

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
  const { env } = useContext<any>(ChatPropsContext);

  const selectedChat =
    chatsFeed[selectedChatId] ||
    requestsFeed[selectedChatId] ||
    searchedChats[selectedChatId];

  useResolveWeb3Name(selectedChat?.did, env);
  const walletLowercase = pCAIP10ToWallet(selectedChat?.did)?.toLowerCase();
  const checksumWallet = walletLowercase
    ? ethers.utils.getAddress(walletLowercase)
    : null;
  const web3Name = checksumWallet ? web3NameList[checksumWallet] : null;

  const handleBack = () => {
    if (activeSubTab) {
      setActiveSubTab(PUSH_SUB_TABS[activeSubTab as PushSubTabs]);
      setSelectedChatId(null);
      setSearchedChats(null);
    } else {
      setActiveTab(PUSH_TABS[activeTab as PushTabs]);
      setSearchedChats(null);
      setSelectedChatId(null);
    }
  };
  return (
    <Section gap="12px">
      <Image
        src={BackIcon}
        alt="back icon"
        cursor="pointer"
        onClick={() => handleBack()}
      />
      <Section gap="8px">
        <Image
          src={selectedChat.profilePicture!}
          alt="profile picture"
          width="24px"
          height="24px"
          borderRadius="100%"
        />

        <Span fontWeight="700" fontSize="16px">
          {' '}
          {web3Name ?? shortenText(selectedChat?.did?.split(':')[1],20)}
        </Span>
      </Section>
    </Section>
  );
};

export const SubTabHeader = () => {
  const { setActiveTab, activeSubTab, setSearchedChats, setSelectedChatId } =
    useContext<any>(ChatMainStateContext);

  return (
    <Section gap="12px">
      <Image
        src={BackIcon}
        alt="back icon"
        cursor="pointer"
        width="16px"
        height="16px"
        onClick={() => {
          setActiveTab(PUSH_TABS.CHATS);
          setSearchedChats(null);
          setSelectedChatId(null);
        }}
      />

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
    chatFeeds,
    requestsFeed,
    setSearchedChats,
    setSelectedChatId,
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
          Object.keys(chatFeeds || {}).length ||
          Object.keys(requestsFeed || {}).length
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
          <Image
            src={NewChatIcon}
            alt="new chat"
            cursor="pointer"
            width="20px"
            height="20px"
            onClick={() => setNewChat(true)}
          />
        )}
        <Image
          src={modalOpen ? MinimizeIcon : MaximizeIcon}
          alt="maximize"
          cursor="pointer"
          width="12px"
          height="13.4px"
          onClick={onMaximizeMinimizeToggle}
        />
      </Section>
    </Container>
  );
};

//styles
const Container = styled(Section)`
  box-sizing: border-box;
`;
