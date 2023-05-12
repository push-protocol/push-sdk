import React, { useContext } from 'react';
import styled from 'styled-components';
import EnvelopeIcon from '../../icons/chat/envelope.svg';
import MaximizeIcon from '../../icons/chat/maximize.svg';
import NewChatIcon from '../../icons/chat/newChat.svg';
import MinimizeIcon from '../../icons/chat/minimize.svg';
import { Section, Span } from '../reusables/sharedStyling';
import { ChatMainStateContext } from '../../context';
import { PUSH_TABS } from '../../types';

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
}: {
  numberOfUnreadMessages: string;
}) => {
  return (
    <Span
      fontWeight="600"
      fontSize="12px"
      color="#fff"
      background="#0D67FE"
      padding="4px 8px"
      borderRadius="100%"
    >
      {numberOfUnreadMessages}
    </Span>
  );
};
export const MinimisedModalHeader: React.FC<MinimisedModalHeaderPropType> = ({
  onMaximizeMinimizeToggle,
  modalOpen,
}) => {
  const { setActiveTab, setSearchedChats } =
    useContext<any>(ChatMainStateContext);
  return (
    <Container justifyContent="space-between" alignItems="center">
      <Section gap="12px">
        <Image src={EnvelopeIcon} alt="message icon" />
        <Section gap="4px">
          <Span
            fontWeight="700"
            fontSize="18px"
            cursor="pointer"
            onClick={() => setActiveTab(PUSH_TABS.CHATS)}
          >
            Messages
          </Span>
          <UnreadChats numberOfUnreadMessages="3" />
        </Section>
        <Section gap="4px">
          <Span
            fontWeight="700"
            fontSize="18px"
            cursor="pointer"
            onClick={() => setActiveTab(PUSH_TABS.REQUESTS)}
          >
            Requests
          </Span>
          <UnreadChats numberOfUnreadMessages="3" />
        </Section>
      </Section>
      <Section gap="20px">
        {/* what happens when we click it */}
        <Image
          src={NewChatIcon}
          alt="new chat"
          onClick={() => setSearchedChats(null)}
        />
        <Image
          src={modalOpen ? MinimizeIcon : MaximizeIcon}
          alt="maximize"
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

const Image = styled.img`
  cursor: pointer;
`;
