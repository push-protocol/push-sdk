import React, { useContext } from 'react';
import { MODAL_BACKGROUND_TYPE, MODAL_POSITION_TYPE } from '../../../types';
import {
  IChatTheme,
  IChatViewComponentProps,
} from '../exportedTypes';

import { chatLimit, device } from '../../../config';
import { deriveChatId } from '../../../helpers';
import { Section, Span } from '../../reusables';
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

  // const [conversationHash, setConversationHash] = useState<string>();

  const theme = useContext(ThemeContext);

  const isMobile = useMediaQuery(device.mobileL);

  if (!signer && !(!!account && !!pgpPrivateKey) && !isConnected) {
    console.warn("Chat::ChatView::You need to pass a signer or account and pgpPrivateKey to ChatViewComponent to send messages.")
  }

  // Use derive chatId to remove chatid: from chatId
  const derivedChatId = chatId ? deriveChatId(chatId) : '';

  return (
    <Conatiner
      width="100%"
      height="inherit"
      flexDirection="column"
      justifyContent={derivedChatId ? "space-between" : 'center'}
      overflow="hidden"
      background={theme.backgroundColor?.chatViewComponentBackground}
      borderRadius={theme.borderRadius?.chatViewComponent}
      padding="13px"
      theme={theme}
    >
      {chatId ? (
        <>
          {chatProfile && 
          <ChatProfile
            chatProfileRightHelperComponent={chatProfileRightHelperComponent}
            chatProfileLeftHelperComponent={chatProfileLeftHelperComponent}
            chatId={derivedChatId}
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
                chatFilterList={chatFilterList}
                limit={limit}
                chatId={derivedChatId}
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
                  onVerificationFail={onVerificationFail}
                  chatId={derivedChatId}
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
