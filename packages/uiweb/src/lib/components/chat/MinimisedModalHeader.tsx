import React, { useContext } from 'react';
import styled from 'styled-components';
import EnvelopeIcon from '../../icons/chat/envelope.svg';
import MaximizeIcon from '../../icons/chat/maximize.svg';
import NewChatIcon from '../../icons/chat/newChat.svg';
import BackIcon from '../../icons/chat/back.svg';
import MinimizeIcon from '../../icons/chat/minimize.svg';
import { Section, Span, Image } from '../reusables/sharedStyling';
import { ChatMainStateContext, ChatPropsContext } from '../../context';
import { PUSH_TABS } from '../../types';
import { useResolveWeb3Name } from '../../hooks';
import { pCAIP10ToWallet, shortenUsername } from '../../helpers';
import { ethers } from 'ethers';

type MinimisedModalHeaderPropType = {
  onMaximizeMinimizeToggle: () => void;
  modalOpen: boolean;
};
type SectionStyleProps = {
  gap?: string;
};
//show reuqest tab
//show new message ui

export const UnreadChats = ({
  numberOfUnreadMessages,
  background,
  color,
}: {
  numberOfUnreadMessages: string;
  background?:string;
  color?:string
}) => {
  return (
    <Span
      fontWeight="600"
      fontSize="12px"
      color={color??"#fff"}
      background={background??"#0D67FE"}
      padding="4px 8px"
      borderRadius="100%"
    >
      {numberOfUnreadMessages}
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
    setActiveTab
  } = useContext<any>(ChatMainStateContext);
  const { env } = useContext<any>(ChatPropsContext);
  console.log(requestsFeed);

  const selectedChat =
    chatsFeed[selectedChatId] || requestsFeed[selectedChatId] || searchedChats[selectedChatId];
  useResolveWeb3Name(selectedChat?.did, env);
  console.log(selectedChat)
  const walletLowercase = pCAIP10ToWallet(selectedChat?.did)?.toLowerCase();
  const checksumWallet = walletLowercase
    ? ethers.utils.getAddress(walletLowercase)
    : null;
  const web3Name = checksumWallet ? web3NameList[checksumWallet] : null;


  return (
    <Section gap="12px">
      <Image
        src={BackIcon}
        alt="back icon"
        cursor="pointer"
        onClick={()=>setActiveTab(PUSH_TABS.CHATS)}
      />
      <Section gap="8px">
        <Image
          src={selectedChat.profilePicture!}
          alt="profile picture"
          width="36px"
          height="36px"
          borderRadius="100%"
        />

        <Span fontWeight='700' fontSize='16px'>
          {' '}
          {web3Name ?? shortenUsername(selectedChat?.did?.split(':')[1])}
        </Span>
      </Section>
    </Section>
  );
};

export const MinimisedModalHeader: React.FC<MinimisedModalHeaderPropType> = ({
  onMaximizeMinimizeToggle,
  modalOpen,
}) => {
  const { setActiveTab, setSearchedChats, selectedChatId, setNewChat,setSelectedChatId } =
    useContext<any>(ChatMainStateContext);
    // const resetToMessages  = () => {
    //   setSelectedChatId(null);
      
    //   setNewChat(false)
    // }
  return (
    <Container justifyContent="space-between" alignItems="center">
      {selectedChatId && modalOpen && <MessageBoxHeader />}
      {((!selectedChatId && modalOpen) || !modalOpen) && (
        <Section gap="12px">
          <Image src={EnvelopeIcon} alt="message icon" />
          <Section gap="4px">
            <Span
              fontWeight="700"
              fontSize="18px"
              cursor="pointer" 
              onClick={()=>setActiveTab(PUSH_TABS.CHATS)}
            >
              Messages
            </Span>
            <UnreadChats numberOfUnreadMessages="3" />
          </Section>
        </Section>
      )}
      <Section gap="20px">
        {((!selectedChatId && modalOpen) || !modalOpen) &&
         (
            <Image
              src={NewChatIcon}
              alt="new chat"
              cursor="pointer"
              onClick={() => setNewChat(true)}
            />
          )}
        <Image
          src={modalOpen ? MinimizeIcon : MaximizeIcon}
          alt="maximize"
          cursor="pointer"
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
