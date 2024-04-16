import React, { useContext, useEffect, useState } from 'react';
import { MODAL_BACKGROUND_TYPE, MODAL_POSITION_TYPE } from '../../../types';
import {
  IChatTheme,
  IChatViewComponentProps,
} from '../exportedTypes';

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

export const ChatViewComponent: React.FC<IChatViewComponentProps> = (
  options: IChatViewComponentProps
) => {
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
  } = options || {};

  const { env, signer, account, pgpPrivateKey } = useChatData();
  const theme = useContext(ThemeContext);

  const isMobile = useMediaQuery(device.mobileL);

  if (!signer && !(!!account && !!pgpPrivateKey) && !isConnected) {
    console.warn("Chat::ChatView::You need to pass a signer or account and pgpPrivateKey to ChatViewComponent to send messages.")
  }

  // set loading state
  const [initialized, setInitialized] = useState({
    loading: true,
    derivedChatId: '',
  });

  useEffect(() => {
    const fetchDerivedChatId = async () => {
      setInitialized(currentState => ({ ...currentState, loading: true}));

      if (chatId) {
        const id = await deriveChatId(chatId, env);
        setInitialized({ loading: false, derivedChatId: id });
      } else {
        setInitialized({ loading: false, derivedChatId: '' });
      }
    };

    fetchDerivedChatId();
  }, [chatId, env]); // Re-run this effect if chatId or env changes

  return (
    <Conatiner
      width="100%"
      height="inherit"
      flexDirection="column"
      justifyContent="space-between"
      overflow="hidden"
      background={theme.backgroundColor?.chatViewComponentBackground}
      borderRadius={theme.borderRadius?.chatViewComponent}
      padding="13px"
      theme={theme}
    >
      {initialized.loading && <Section padding="20px"><Spinner color={theme.spinnerColor} /></Section>}
      {!initialized.loading && chatId ? (
        <>
          {chatProfile && 
          <ChatProfile
            key={chatId}
            chatProfileRightHelperComponent={chatProfileRightHelperComponent}
            chatProfileLeftHelperComponent={chatProfileLeftHelperComponent}
            chatId={initialized.derivedChatId}
            groupInfoModalBackground={groupInfoModalBackground}
            groupInfoModalPositionType={groupInfoModalPositionType}
          />}
          <Section
            flex="1 1 auto"
            overflow="hidden"
            padding={isMobile ? '0 10px' : '0 20px'}
            margin="0 0px 10px 0px"
            flexDirection="column"
            justifyContent="start"
          >
            { chatViewList && (
              <ChatViewList
                key={chatId}
                chatFilterList={chatFilterList}
                limit={limit}
                chatId={initialized.derivedChatId}
              />
            )}
          </Section>
          {/* )} */}
          {!signer && !(!!account && !!pgpPrivateKey) && !isConnected && (
            <Section flex="0 1 auto">
              <Span>
                
              </Span>
            </Section>
          )}
          {messageInput &&
            (!!signer || (!!account && !!pgpPrivateKey) || isConnected) && (
              <Section flex="0 1 auto" position="static">
                <MessageInput
                  key={chatId}
                  onVerificationFail={onVerificationFail}
                  chatId={initialized.derivedChatId}
                  file={file}
                  emoji={emoji}
                  gif={gif}
                  isConnected={isConnected}
                  verificationFailModalBackground={
                    verificationFailModalBackground
                  }
                  verificationFailModalPosition={verificationFailModalPosition}
                  autoConnect={autoConnect}
                />
              </Section>
            )}
        </>
      ) : (
        <Section overflow='auto'>
        { welcomeComponent }
        </Section>
      )}
    </Conatiner>
  );
};

//styles
const Conatiner = styled(Section)<IThemeProps>`
  border: ${(props) => props.theme.border?.chatViewComponent};
  box-sizing: border-box;
`;
