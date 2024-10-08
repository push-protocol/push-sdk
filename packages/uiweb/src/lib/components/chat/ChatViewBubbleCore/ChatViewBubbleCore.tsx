// React + Web3 Essentials
import { useContext } from 'react';

// External Packages
import styled from 'styled-components';

// Internal Components
import { useChatData } from '../../../hooks';
import { ThemeContext } from '../theme/ThemeProvider';

import { deepCopy, isMessageEncrypted, pCAIP10ToWallet } from '../../../helpers';
import { IMessagePayload, TwitterFeedReturnType } from '../exportedTypes';

import { Section } from '../../reusables';
import { CardRenderer } from './CardRenderer';
import { ReplyCard } from './cards/reply/ReplyCard';

// Internal Configs

// Assets

// Interfaces & Types
interface ChatViewBubbleCoreProps extends React.ComponentProps<typeof Section> {
  borderBG?: string;
  previewMode?: boolean;
}

// Exported Default Component
export const ChatViewBubbleCore = ({
  chat,
  chatId,
  previewMode = false,
  activeMode = false,
}: {
  chat: IMessagePayload;
  chatId: string | undefined;
  previewMode?: boolean;
  activeMode?: boolean;
}) => {
  // get theme
  const theme = useContext(ThemeContext);

  // get user
  const { user } = useChatData();

  // get chat position
  const chatPosition =
    pCAIP10ToWallet(chat.fromDID).toLowerCase() !== pCAIP10ToWallet(user?.account ?? '')?.toLowerCase() ? 0 : 1;

  const renderBubble = (chat: IMessagePayload, position: number) => {
    const components: JSX.Element[] = [];

    // replace derivedMsg with chat as that's the original
    // take reference from derivedMsg which forms the reply
    // Create a deep copy of chat
    const derivedMsg = deepCopy(chat) as any;
    let replyReference = '';

    if (chat && chat.messageType === 'Reply') {
      // Reply messageObj content contains messageObj and messageType;
      replyReference = (chat as any).messageObj?.reference ?? null;
      derivedMsg.messageType = derivedMsg?.messageObj?.content?.messageType;
      derivedMsg.messageObj = derivedMsg?.messageObj?.content?.messageObj;
    }

    // Render cards - Anything not a reply is ChatViewBubbleCardRenderer
    // Reply is it's own card that calls ChatViewBubbleCardRenderer
    // This avoids transitive recursion

    // Use replyReference to check and call reply card but only if activeMode is false
    // as activeMode will be true when user is replying to a message
    if (replyReference !== '' && !activeMode) {
      // Add Reply Card
      components.push(
        <ReplyCard
          key="reply"
          reference={replyReference}
          chatId={chatId}
          position={position}
        />
      );
    }

    // Use derivedMsg to render other cards
    if (derivedMsg) {
      // Add Message Card
      components.push(
        <CardRenderer
          key="card"
          chat={derivedMsg}
          position={position}
          previewMode={previewMode}
          activeMode={activeMode}
        />
      );
    }

    // deduce background color
    // if active mode, use the normal background color as this is user replying to a message
    // if preview mode, use the reply background color
    // if not preview mode, use the normal background color
    const background = activeMode
      ? theme.backgroundColor?.chatActivePreviewBubbleBackground
      : position
        ? previewMode
          ? theme.backgroundColor?.chatPreviewSentBubbleBackground
          : theme.backgroundColor?.chatSentBubbleBackground
        : previewMode
          ? theme.backgroundColor?.chatPreviewRecievedBubbleBackground
          : theme.backgroundColor?.chatReceivedBubbleBackground;

    return (
      <ChatViewBubbleCoreSection
        flexDirection="column"
        background={background}
        borderBG={activeMode ? theme.backgroundColor?.chatActivePreviewBorderBubbleBackground : 'transparent'}
        borderRadius={activeMode ? theme.borderRadius?.chatBubbleReplyBorderRadius : '0px'}
        previewMode={previewMode}
      >
        {components}
      </ChatViewBubbleCoreSection>
    );
  };

  return renderBubble(chat, chatPosition);
};

const ChatViewBubbleCoreSection = styled(Section) <ChatViewBubbleCoreProps>`
  border-left: ${({ borderBG, previewMode }) => (previewMode ? `4px solid ${borderBG || 'transparent'}` : 'none')};
`;
