// React + Web3 Essentials
import { Fragment, ReactElement, ReactNode, useContext, useEffect, useState } from 'react';

// External Packages
import moment from 'moment';
import styled, { keyframes } from 'styled-components';

// Internal Compoonents
import { extractWebLink, getFormattedMetadata, hasWebLink } from '../../../../../utilities';
import { Anchor, Image, Section, Span } from '../../../../reusables';
import { ThemeContext } from '../../../theme/ThemeProvider';

import { IPreviewCallback, PreviewRenderer } from './PreviewRenderer';

// Internal Configs

// Assets

// Interfaces & Types
import { IMessagePayload, TwitterFeedReturnType } from '../../../exportedTypes';

// Constants

// Exported Interfaces & Types

// Exported Functions
export const MessageCard = ({
  chat,
  position,
  isGroup,
  account,
}: {
  chat: IMessagePayload;
  position: number;
  isGroup: boolean;
  account: string;
}) => {
  // get theme
  const theme = useContext(ThemeContext);

  // get time
  const time = moment(chat.timestamp).format('hh:mm a');

  // derive message
  const message =
    typeof chat.messageObj === 'object' ? (chat.messageObj?.content as string) ?? '' : (chat.messageObj as string);

  // define state
  const [initialized, setInitialized] = useState({
    loading: true,
    additionalClasses: '',
  });

  // setup callback
  const previewCallback = (callback: IPreviewCallback) => {
    // reset initialization
    setInitialized({
      ...initialized,
      loading: callback.loading,
      additionalClasses: !callback.error ? callback.urlType : '',
    });
  };

  return (
    <MessageCardSection className={initialized.additionalClasses}>
      {/* Preview Renderer - Start with assuming preview is there, callback handles no preview */}
      <MessagePreviewSection
        alignSelf={position ? 'end' : 'start'}
        borderRadius={position ? '12px 0px 0px 0px' : '0px 12px 0px 0px'}
        margin="10px 0 0 0"
      >
        <PreviewRenderer
          message={message}
          account={account}
          messageId={chat.link ?? 'null'}
          position={position}
          background={theme.backgroundColor?.chatFrameBackground ?? ''}
          previewCallback={previewCallback}
        />
      </MessagePreviewSection>

      {/* Message Rendering - Always happens */}
      <MessageSection
        gap="5px"
        background={
          position
            ? `${theme.backgroundColor?.chatSentBubbleBackground}`
            : `${theme.backgroundColor?.chatReceivedBubbleBackground}`
        }
        border={position ? `${theme.border?.chatSentBubble}` : `${theme.border?.chatReceivedBubble}`}
        padding="8px 12px"
        borderRadius={position ? '12px 0px 12px 12px' : '0px 12px 12px 12px'}
        margin="5px 0"
        alignSelf={position ? 'end' : 'start'}
        justifyContent="start"
        minWidth="71px"
        position="relative"
        width="fit-content"
        color={position ? `${theme.textColor?.chatSentBubbleText}` : `${theme.textColor?.chatReceivedBubbleText}`}
      >
        <Section
          flexDirection="column"
          padding="5px 0 15px 0"
        >
          {message.split('\n').map((line: string, lineIndex: number) => (
            <Span
              key={lineIndex}
              alignSelf="start"
              textAlign="left"
              fontSize={
                position ? `${theme.fontSize?.chatSentBubbleText}` : `${theme.fontSize?.chatReceivedBubbleText}`
              }
              fontWeight={
                position ? `${theme.fontWeight?.chatSentBubbleText}` : `${theme.fontWeight?.chatReceivedBubbleText}`
              }
              color={position ? `${theme.textColor?.chatSentBubbleText}` : `${theme.textColor?.chatReceivedBubbleText}`}
            >
              {line.split(' ').map((word: string, wordIndex: number) =>
                hasWebLink(word) ? (
                  <>
                    <MessageAnchor
                      key={`anchor-${wordIndex}`}
                      href={extractWebLink(word) ?? ''}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={initialized.loading ? 'loading' : ''}
                    >
                      {word}
                    </MessageAnchor>
                    <Fragment key={wordIndex}> </Fragment>
                  </>
                ) : (
                  <Fragment key={wordIndex}>{word} </Fragment>
                )
              )}
            </Span>
          ))}
        </Section>

        {/* Timestamp rendering */}
        <Span
          position="absolute"
          fontSize={
            position
              ? `${theme.fontSize?.chatSentBubbleTimestampText}`
              : `${theme.fontSize?.chatReceivedBubbleTimestampText}`
          }
          fontWeight={
            position
              ? `${theme.fontWeight?.chatSentBubbleTimestampText}`
              : `${theme.fontWeight?.chatReceivedBubbleTimestampText}`
          }
          color={position ? `${theme.textColor?.chatSentBubbleText}` : `${theme.textColor?.chatReceivedBubbleText}`}
          bottom="6px"
          right="10px"
        >
          {time}
        </Span>
      </MessageSection>
    </MessageCardSection>
  );
};

const fader = keyframes`
  0% { opacity: 0.5; }
  50% { opacity: 1; }
  100% { opacity: 0.5; }
`;

const MessagePreviewSection = styled(Section)`
  overflow: hidden;
`;

const MessageSection = styled(Section)`
  box-sizing: border-box;
`;

const MessageCardSection = styled(Section)`
  flex-direction: column;

  &.video,
  &.frame {
    max-width: 512px;
    min-width: 240px;

    & > ${MessageSection} {
      width: 100%;

      box-sizing: border-box;
      margin-top: 0px;
      border-top-right-radius: 0;
      border-top-left-radius: 0;
    }
  }

  &.video {
  }

  &.frame {
  }
`;

const MessageAnchor = styled(Anchor)`
  &:first-child.loading {
    animation: ${fader} 1.5s ease-in infinite;
  }
`;
