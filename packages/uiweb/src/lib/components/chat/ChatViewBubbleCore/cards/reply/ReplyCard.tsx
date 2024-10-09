// React + Web3 Essentials
import { useContext, useEffect, useState } from 'react';

// External Packages
import styled from 'styled-components';

// Internal Compoonents
import { useChatData } from '../../../../../hooks';
import { Section, Span } from '../../../../reusables';

import { ThemeContext } from '../../../theme/ThemeProvider';
import { CardRenderer } from '../../CardRenderer';

// Internal Configs

// Assets

// Interfaces & Types
import { IMessagePayload } from '../../../exportedTypes';

// Constants

// Exported Interfaces & Types
// Extend Section via ReplySectionProps
interface ReplySectionProps extends React.ComponentProps<typeof Section> {
  borderBG?: string;
}

// Exported Functions
export const ReplyCard = ({
  reference,
  chatId,
  position,
}: {
  reference: string | null;
  chatId: string | undefined;
  position?: number;
}) => {
  // get theme
  const theme = useContext(ThemeContext);

  // get user
  const { user } = useChatData();

  // set and get reply payload
  const [replyPayloadManager, setReplyPayloadManager] = useState<{
    payload: IMessagePayload | null;
    loaded: boolean;
    err: string | null;
  }>({ payload: null, loaded: false, err: null });

  // resolve reply payload
  useEffect(() => {
    const resolveReplyPayload = async () => {
      if (!replyPayloadManager.loaded) {
        if (reference && chatId) {
          try {
            const payloads = await user?.chat.history(chatId, { reference: reference, limit: 1 });
            const payload = payloads ? payloads[0] : null;

            // check if payload is reply
            // if so, change the message type to content one
            if (payload?.messageType === 'Reply') {
              payload.messageType = payload?.messageObj?.content?.messageType;
              payload.messageObj = payload?.messageObj?.content?.messageObj;
            }

            // finally set the reply
            setReplyPayloadManager({ ...replyPayloadManager, payload: payload, loaded: true });
          } catch (err) {
            setReplyPayloadManager({
              ...replyPayloadManager,
              payload: null,
              loaded: true,
              err: 'Unable to load Preview',
            });
          }
        } else {
          setReplyPayloadManager({
            ...replyPayloadManager,
            payload: null,
            loaded: true,
            err: 'Reply reference not found',
          });
        }
      }
    };
    resolveReplyPayload();
  }, [replyPayloadManager, reference, user?.chat, chatId]);

  // render
  return (
    <ReplySection
      key={`card-reply-${replyPayloadManager.payload?.link ?? 'null'}`}
      maxWidth="512px"
      minWidth="200px"
      width="fill-available"
      background={
        position
          ? theme.backgroundColor?.chatPreviewSentBubbleBackground
          : theme.backgroundColor?.chatPreviewRecievedBubbleBackground
      }
      margin={theme.margin?.chatBubbleReplyMargin}
      borderRadius={theme.borderRadius?.chatBubbleReplyBorderRadius}
      borderBG={
        position
          ? theme.backgroundColor?.chatPreviewSentBorderBubbleBackground
          : theme.backgroundColor?.chatPreviewRecievedBorderBubbleBackground
      }
    >
      {/* Initial State */}
      {!replyPayloadManager.loaded && (
        <Span
          alignSelf="start"
          textAlign="left"
          lineHeight="1.4em"
          width="inherit"
          fontSize={position ? `${theme.fontSize?.chatSentBubbleText}` : `${theme.fontSize?.chatReceivedBubbleText}`}
          fontWeight={
            position ? `${theme.fontWeight?.chatSentBubbleText}` : `${theme.fontWeight?.chatReceivedBubbleText}`
          }
          padding={theme.padding?.chatBubbleInnerContentPadding}
          color={position ? `${theme.textColor?.chatSentBubbleText}` : `${theme.textColor?.chatReceivedBubbleText}`}
        >
          Loading Preview...
        </Span>
      )}

      {/* Error State */}
      {replyPayloadManager.loaded && replyPayloadManager.err && (
        <Span
          alignSelf="start"
          textAlign="left"
          lineHeight="1.4em"
          width="inherit"
          fontSize={position ? `${theme.fontSize?.chatSentBubbleText}` : `${theme.fontSize?.chatReceivedBubbleText}`}
          fontWeight={
            position ? `${theme.fontWeight?.chatSentBubbleText}` : `${theme.fontWeight?.chatReceivedBubbleText}`
          }
          padding={theme.padding?.chatBubbleInnerContentPadding}
          color={position ? `${theme.textColor?.chatSentBubbleText}` : `${theme.textColor?.chatReceivedBubbleText}`}
        >
          {replyPayloadManager.err}
        </Span>
      )}

      {/* Loaded State */}
      {replyPayloadManager.loaded && replyPayloadManager.payload && (
        <Section
          flexDirection="column"
          alignItems="flex-start"
          overflow="hidden"
          width="fill-available"
        >
          <Span
            padding="8px 12px 0px"
            fontSize="10px"
            color={theme.textColor?.chatSentBubbleText}
          >
            <Span
              fontWeight="500"
              padding="0px"
            >
              {`${replyPayloadManager.payload.fromDID?.split(':')[1].slice(0, 6)}...${replyPayloadManager.payload.fromDID
                ?.split(':')[1]
                .slice(-6)}`}
            </Span>
          </Span>
          <CardRenderer
            key={`card-render-${replyPayloadManager.payload?.link ?? 'null'}`}
            chat={replyPayloadManager.payload}
            position={position ?? 0}
            previewMode={true}
          />
        </Section>

      )}
    </ReplySection>
  );
};

const ReplySection = styled(Section) <ReplySectionProps>`
  border-left: 4px solid ${({ borderBG }) => borderBG || 'transparent'};
`;
