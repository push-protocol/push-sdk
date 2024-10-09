import React, { useContext, useEffect, useState } from 'react';
import { MODAL_BACKGROUND_TYPE, MODAL_POSITION_TYPE } from '../../../types';
import { IChatTheme, IChatViewComponentProps, IMessagePayload } from '../exportedTypes';

import { chatLimit, device } from '../../../config';
import { deriveChatId } from '../../../helpers';
import { Section, Span, Spinner } from '../../reusables';
import { ChatViewList } from '../ChatViewList';

import styled from 'styled-components';
import { useChatData } from '../../../hooks/chat/useChatData';
import useMediaQuery from '../../../hooks/useMediaQuery';
import { ChatProfile } from '../ChatProfile';
import { MessageInput } from '../MessageInput';
import { ThemeContext } from '../theme/ThemeProvider';

/**
 * @interface IThemeProps
 * this interface is used for defining the props for styled components
 */
interface IThemeProps {
  theme?: IChatTheme;
}

export const ChatViewComponent: React.FC<IChatViewComponentProps> = (options: IChatViewComponentProps) => {
  const {
    chatId = null,
    chatFilterList = [],
    messageInput = true,
    chatViewList = true,
    chatProfile = true,
    limit = chatLimit,
    emoji = true,
    file = true,
    gif = true,
    handleReply = true,
    isConnected = true,
    autoConnect = false,
    onVerificationFail,
    groupInfoModalBackground = MODAL_BACKGROUND_TYPE.OVERLAY,
    groupInfoModalPositionType = MODAL_POSITION_TYPE.GLOBAL,
    verificationFailModalBackground = MODAL_BACKGROUND_TYPE.OVERLAY,
    verificationFailModalPosition = MODAL_POSITION_TYPE.GLOBAL,
    chatProfileRightHelperComponent = null,
    chatProfileLeftHelperComponent = null,
    welcomeComponent = null,
    closeChatProfileInfoModalOnClickAway = false,
  } = options || {};

  const { user } = useChatData();
  const theme = useContext(ThemeContext);

  const isMobile = useMediaQuery(device.mobileL);

  if (!user) {
    console.warn(
      'Chat::ChatView::You need to pass either push user, or a signer, or account and pgpPrivateKey in ChatViewComponent to send messages.'
    );
  }

  // set loading state
  const [initialized, setInitialized] = useState({
    loading: true,
    derivedChatId: '',
  });

  const [replyPayload, setReplyPayload] = useState<IMessagePayload | null>(null);

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
    <Conatiner
      width="100%"
      height="inherit"
      flexDirection="column"
      justifyContent="space-between"
      overflow="hidden"
      background={theme.backgroundColor?.chatViewComponentBackground}
      borderRadius={theme.borderRadius?.chatViewComponent}
      padding={theme.padding?.chatViewPadding}
      margin={theme.margin?.chatViewMargin}
      theme={theme}
    >
      {/* If initialized is loading then show spinner */}
      {initialized.loading && (
        <Section padding="20px">
          <Spinner color={theme.spinnerColor} />
        </Section>
      )}

      {/* If chat id is present and initialized is not loading then show chat view */}
      {!initialized.loading && chatId ? (
        <>
          {/* Load ChatProfile if in options */}
          {chatProfile && (
            <Section
              margin={theme.margin?.chatProfileMargin}
              padding={theme.padding?.chatProfilePadding}
              zIndex="2"
            >
              <ChatProfile
                key={chatId}
                closeChatProfileInfoModalOnClickAway={closeChatProfileInfoModalOnClickAway}
                chatProfileRightHelperComponent={chatProfileRightHelperComponent}
                chatProfileLeftHelperComponent={chatProfileLeftHelperComponent}
                chatId={initialized.derivedChatId}
                groupInfoModalBackground={groupInfoModalBackground}
                groupInfoModalPositionType={groupInfoModalPositionType}
              />
            </Section>
          )}

          {/* Load ChatViewList if in options */}
          {/* TODO Create theme from styled and then extend theme to have tablet and mobile sizes */}
          <ChatViewSection
            flex="1 1 auto"
            overflow="hidden"
            padding={theme.padding?.chatViewListPadding}
            margin={theme.margin?.chatViewListMargin}
            flexDirection="column"
            justifyContent="start"
            zIndex="1"
          >
            {chatViewList && (
              <ChatViewList
                key={chatId}
                chatFilterList={chatFilterList}
                limit={limit}
                chatId={initialized.derivedChatId}
                setReplyPayload={setReplyPayload}
              />
            )}
          </ChatViewSection>

          {/* Load MessageInput if in options and user is present */}
          {messageInput && user && (
            <Section
              flex="0 1 auto"
              zIndex="2"
              padding={theme.padding?.messageInputPadding}
              margin={theme.margin?.messageInputMargin}
            >
              <MessageInput
                key={chatId}
                onVerificationFail={onVerificationFail}
                chatId={initialized.derivedChatId}
                file={file}
                emoji={emoji}
                gif={gif}
                replyPayload={handleReply ? replyPayload : null}
                setReplyPayload={setReplyPayload}
                isConnected={isConnected}
                verificationFailModalBackground={verificationFailModalBackground}
                verificationFailModalPosition={verificationFailModalPosition}
                autoConnect={autoConnect}
              />
            </Section>
          )}
        </>
      ) : (
        <Section overflow="auto">{welcomeComponent}</Section>
      )}
    </Conatiner>
  );
};

//styles
const Conatiner = styled(Section)<IThemeProps>`
  border: ${(props) => props.theme.border?.chatViewComponent};
  box-sizing: border-box;
`;

const ChatViewSection = styled(Section)<IThemeProps>`
  @media (${device.mobileL}) {
    margin: 0;
  }
`;
