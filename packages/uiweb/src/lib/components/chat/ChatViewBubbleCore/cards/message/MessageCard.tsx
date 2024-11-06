// React + Web3 Essentials
import { Fragment, ReactElement, ReactNode, useContext, useEffect, useState } from 'react';

// External Packages
import moment from 'moment';
import { CopyBlock, dracula } from 'react-code-blocks';
import styled, { keyframes } from 'styled-components';

// Internal Compoonents
import { extractWebLink, getFormattedMetadata, hasWebLink } from '../../../../../utilities';
import { Anchor, Button, Section, Span } from '../../../../reusables';
import { ThemeContext } from '../../../theme/ThemeProvider';

import { IPreviewCallback, PreviewRenderer } from './PreviewRenderer';

// Internal Configs

// Assets

// Interfaces & Types
import { IMessagePayload, TwitterFeedReturnType } from '../../../exportedTypes';

interface IMsgFragments {
  msg: string;
  type: string;
}

// Constants

// Exported Interfaces & Types

// Exported Functions
export const MessageCard = ({
  chat,
  position,
  account,
  color = 'inherit', // default to inherit
  previewMode = false,
  activeMode = false,
}: {
  chat: IMessagePayload;
  position: number;
  account: string;
  color?: string;
  previewMode?: boolean;
  activeMode?: boolean;
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

  // break message to derive different types
  const splitMessageToMessages = (item: IMsgFragments): IMsgFragments[] => {
    // split message into code blocks
    const splitMessageToCodeBlocks = (fragment: IMsgFragments): IMsgFragments[] => {
      const codeBlockRegex = /(```[\s\S]*?```)/g; // Regex to match code blocks
      const fragments = [];
      let lastIndex = 0;

      // Ensure fragment.msg is a string before attempting to use replace
      if (typeof fragment.msg === 'string') {
        fragment.msg.replace(codeBlockRegex, (match, p1, offset) => {
          // Add text before the code block if it exists
          if (offset > lastIndex) {
            fragments.push({
              msg: fragment.msg.substring(lastIndex, offset),
              type: fragment.type,
            });
          }
          // Add the code block
          fragments.push({
            msg: p1,
            type: 'code',
          });
          lastIndex = offset + p1.length;
          return match; // This return is not used, required for replace function signature
        });

        // Add any remaining text after the last code block
        if (lastIndex < fragment.msg.length) {
          fragments.push({
            msg: fragment.msg.substring(lastIndex),
            type: fragment.type,
          });
        }
      } else {
        // Handle cases where fragment.msg is not a string
        console.error(
          'UIWEB::components::ChatViewBubble::cards::MessageCard::splitMessageToCodeBlocks:fragment.msg is not a string',
          fragment.msg
        );
      }

      return fragments;
    };

    // start with array of messages
    const chunks = [
      {
        msg: item.msg,
        type: item.type,
      },
    ];

    // for each message in messages, split it into code blocks and replace array
    chunks.forEach((item, index) => {
      chunks.splice(index, 1, ...splitMessageToCodeBlocks(item));
    });

    return chunks;
  };

  // if preview mode, reduce the message to 100 characters and only 3 lines
  const reduceMessage = (message: string) => {
    const limitedMessage = message.slice(0, 100);
    const lines = limitedMessage.split('\n');
    const reducedMessage = lines.slice(0, 3).join(' ');
    return reducedMessage;
  };

  // convert to fragments which can have different types
  // if preview mode, skip fragments and only reduce message
  const fragments = previewMode
    ? [{ msg: reduceMessage(message), type: 'text' }]
    : splitMessageToMessages({ msg: message, type: 'text' });

  // To render individual fragments
  const renderTxtFragments = (message: string, fragmentIndex: number): ReactNode => {
    return message.split('\n').map((line: string, lineIndex: number) => (
      <Span
        key={`${fragmentIndex}-${lineIndex}`} // Updated key to be more unique
        alignSelf="start"
        textAlign="left"
        lineHeight="1.4em"
        fontSize={position ? `${theme.fontSize?.chatSentBubbleText}` : `${theme.fontSize?.chatReceivedBubbleText}`}
        fontWeight={
          position ? `${theme.fontWeight?.chatSentBubbleText}` : `${theme.fontWeight?.chatReceivedBubbleText}`
        }
        color={color}
      >
        {line.split(' ').map((word: string, wordIndex: number) => {
          const link = hasWebLink(word) ? extractWebLink(word) : '';
          return (
            <Fragment key={`${fragmentIndex}-${lineIndex}-${wordIndex}`}>
              {link ? (
                <MessageAnchor
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={initialized.loading ? 'loading' : ''}
                >
                  {word}
                </MessageAnchor>
              ) : (
                word
              )}{' '}
              {/* Ensure spaces are maintained between words */}
            </Fragment>
          );
        })}
      </Span>
    ));
  };

  // To render code fragment
  const renderCodeFragment = (message: string, fragmentIndex: number): ReactElement => {
    // split code and language
    const regex = /```(\S*)\s*([\s\S]*?)```/; // Regex to capture optional language and code within backticks
    const match = message.match(regex);
    const language = match?.[1] || 'plaintext';
    const code = message.split('\n').slice(1, -1).join('\n').trim();

    return (
      <CodeSection>
        <StyledCopyBlock
          key={fragmentIndex}
          text={code}
          language={language}
          // showLineNumbers={false}
          // wrapLines={true}
          theme={dracula}
        />
      </CodeSection>
    );
  };

  // Render entire message
  return (
    <MessageCardSection
      className={initialized.additionalClasses}
      justifyContent="stretch"
      width="fill-available"
    >
      {/* Preview Renderer - Start with assuming preview is there, callback handles no preview */}
      <MessagePreviewSection
        width="100%"
        minWidth="inherit"
        maxWidth="inherit"
        background={theme.backgroundColor?.chatReceivedBubbleBackground}
      >
        <PreviewRenderer
          message={message}
          account={account}
          messageId={chat.link ?? 'null'}
          previewCallback={previewCallback}
          previewMode={previewMode}
        />
      </MessagePreviewSection>

      {/* Message Rendering - Always happens */}
      <MessageSection
        gap="5px"
        border={position ? `${theme.border?.chatSentBubble}` : `${theme.border?.chatReceivedBubble}`}
        padding={theme.padding?.chatBubbleInnerContentPadding}
        justifyContent="start"
        flexDirection="column"
        maxWidth="inherit"
        minWidth="72px"
        position="relative"
      >
        <Section
          flexDirection="column"
          maxWidth="inherit"
        >
          {fragments.map((fragment, fragmentIndex) => {
            if (fragment.type === 'text') {
              return renderTxtFragments(fragment.msg, fragmentIndex);
            } else if (fragment.type === 'code') {
              return renderCodeFragment(fragment.msg, fragmentIndex);
            } else {
              return null;
            }
          })}
        </Section>

        {/* Timestamp rendering only when no preview mode */}
        {!previewMode && (
          <Span
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
            color={color}
            right="0px"
            width="auto"
            alignSelf="flex-end"
          >
            {time}
          </Span>
        )}
      </MessageSection>
    </MessageCardSection>
  );
};

const MessagePreviewSection = styled(Section)`
  overflow: hidden;
  max-width: 100%;
`;

const MessageSection = styled(Section)`
  box-sizing: border-box;
  max-width: 100%;
`;

const MessageCardSection = styled(Section)`
  display: grid;
  align-self: flex-start;
  flex-direction: column;
  max-width: 100%;

  &.video,
  &.frame {
    max-width: 512px;
    min-width: 200px;

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

const CodeSection = styled(Section)`
  margin: 16px 0;
  border-radius: 12px;
  align-self: stretch;
  max-width: inherit;

  div:first-of-type {
    max-width: inherit;
    width: 100%;
    padding: 20px;
    font-weight: 300;
    font-family: monospace;
    overflow: scroll;
    justify-content: flex-start;
  }
`;

const StyledCopyBlock = styled(CopyBlock)``;

const fader = keyframes`
  0% { opacity: 0.5; }
  50% { opacity: 1; }
  100% { opacity: 0.5; }
`;

const MessageAnchor = styled(Anchor)`
  &:first-child.loading {
    animation: ${fader} 1.5s ease-in infinite;
  }
`;
