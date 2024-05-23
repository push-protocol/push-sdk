import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';

import { Div, Section, Span } from '../reusables/sharedStyling';
import { ChatProfile, ChatViewList, IChatTheme, MessageInput } from '../chat';
import { useChatData } from '../../hooks';
import { SponserPushIcon } from '../../icons/SponserPush';
import { ThemeContext } from '../chat/theme/ThemeProvider';
import { MinimizeIcon } from '../../icons/Minimize';
import { deriveChatId } from '../../helpers';

/**
 * @interface IThemeProps
 * this interface is used for defining the props for styled components
 */
interface IThemeProps {
  theme?: IChatTheme;
}

type ModalProps = {
  chatId: string;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  modalTitle: string;
  welcomeComponent: React.ReactNode;
};
export const Modal: React.FC<ModalProps> = ({ chatId, isModalOpen, setIsModalOpen, modalTitle, welcomeComponent }) => {
  const { user } = useChatData();
  const theme = useContext(ThemeContext);
  // set loading state
  const [initialized, setInitialized] = useState({
    loading: true,
    derivedChatId: '',
  });

  useEffect(() => {
    const fetchDerivedChatId = async () => {
      setInitialized((currentState) => ({ ...currentState, loading: true }));

      if (chatId) {
        const id = await deriveChatId(chatId, user);
        setInitialized({ loading: false, derivedChatId: id });
      } else {
        setInitialized({ loading: false, derivedChatId: '' });
      }
    };

    fetchDerivedChatId();
  }, [chatId, user]); // Re-run this effect if chatId or env changes
  return (
    <Container theme={theme}>
      {/* check other inputs for the components */}
      <HeaderSection
        theme={theme}
        position="relative"
      >
        <Span
          textAlign="center"
          fontSize="20px"
          fontWeight="500"
          color={theme?.textColor?.chatWidgetModalHeadingText}
        >
          {modalTitle}
        </Span>
        <Section
          position="absolute"
          right="5px"
          onClick={() => setIsModalOpen(!isModalOpen)}
        >
          <MinimizeIcon />
        </Section>
      </HeaderSection>
      {!initialized.loading && chatId ? (
        <Section
          flexDirection="column"
          height="82%"
        >
          <Section flex="0 1 auto">
            <ChatProfile chatId={initialized.derivedChatId} />
          </Section>
          <Section
            flex="1 1 auto"
            overflow="hidden"
            padding="0 2px"
            flexDirection="column"
            justifyContent="start"
          >
            {!user || (user && user?.readmode()) ? (
              <>{welcomeComponent}</>
            ) : (
              <ChatViewList chatId={initialized.derivedChatId} />
            )}
          </Section>

          <Section
            flex="0 1 auto"
            position="static"
          >
            <MessageInput
              chatId={initialized.derivedChatId}
              autoConnect={false}
            />
          </Section>
        </Section>
      ) : null}
      <Div
        width="100%"
        textAlign="center"
      >
        <SponserPushIcon color={theme?.textColor?.chatWidgetModalHeadingText} />
      </Div>
    </Container>
  );
};

//styles
const Container = styled.div<IThemeProps>`
  display: flex;
  gap: 10px;
  flex-direction: column;
  box-sizing: border-box;
  background: ${(props) => props.theme?.backgroundColor?.chatWidgetModalBackground};
  border: ${(props) => props.theme?.border?.chatWidget};

  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.07);
  border-radius: ${(props) => props.theme?.borderRadius?.chatWidget};
  height: 585px;
  max-height: 585px;
  width: 350px;
  max-width: 350px;
  padding: 0 15px;
`;
const HeaderSection = styled(Section)<IThemeProps>`
  border-bottom: ${(props) => props.theme.border?.chatWidget};
  align-items: center;
  justify-content: center;
  padding: 17px;
`;
