// React + Web3 Essentials
import { RefObject, useContext, useEffect, useRef, useState } from 'react';

// External Packages

// Internal Compoonents
import { Button, Image, Section, Span, Spinner } from '../../../reusables';
import { ThemeContext } from '../../theme/ThemeProvider';

// Internal Configs

// Assets

// Interfaces & Types
import { IReactionsForChatMessages } from '../../../../types';

interface IReactions {
  [key: string]: string[];
}

// Constants

// Exported Interfaces & Types

// Exported Functions
export const Reactions = ({ chatReactions }: { chatReactions: IReactionsForChatMessages[] }) => {
  // get theme
  const theme = useContext(ThemeContext);

  // transform to IReactions
  const uniqueReactions = chatReactions.reduce((acc, reaction) => {
    const contentKey = (reaction as any).messageObj?.content || '';
    if (!acc[contentKey]) {
      acc[contentKey] = [];
    }

    // eliminate duplicate
    if (!acc[contentKey].includes((reaction as any).fromCAIP10)) {
      acc[contentKey].push((reaction as any).fromCAIP10);
    }

    return acc;
  }, {} as IReactions);

  // generate a unique key for the reactions
  const reactionsKey = chatReactions.map((reaction) => reaction.reference).join('-');

  console.debug('UIWeb::components::ChatViewBubble::Reactions::uniqueReactions', uniqueReactions);

  // render reactions
  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {Object.keys(uniqueReactions).length > 2 ? (
        <Section
          key={`reactions-${reactionsKey}`}
          borderRadius={theme.borderRadius?.reactionsBorderRadius}
          background={theme.backgroundColor?.chatReceivedBubbleBackground}
          padding={theme.padding?.reactionsPadding}
          border={theme.border?.reactionsHoverBorder}
          gap="4px"
        >
          <Span
            fontSize="medium"
            whiteSpace="nowrap"
          >
            {Object.keys(uniqueReactions).join(' ')}
          </Span>
          <Span
            fontSize="medium"
            fontWeight="500"
            padding="0 4px"
            color={theme.textColor?.chatReceivedBubbleText}
          >
            {Object.values(uniqueReactions).reduce((total, reactions) => total + reactions.length, 0)}
          </Span>
        </Section>
      ) : (
        Object.entries(uniqueReactions).map(([content, reactions]) => (
          <Section
            key={`reactions-${content}-${reactionsKey}`}
            borderRadius={theme.borderRadius?.reactionsBorderRadius}
            background={theme.backgroundColor?.chatReceivedBubbleBackground}
            padding={theme.padding?.reactionsPadding}
            border={theme.border?.reactionsHoverBorder}
            gap="4px"
          >
            <Span
              fontSize="medium"
              whiteSpace="nowrap"
            >
              {content}
            </Span>
            <Span
              fontSize="medium"
              fontWeight="500"
              padding="0 4px"
              color={theme.textColor?.chatReceivedBubbleText}
              whiteSpace="nowrap"
            >
              {reactions.length}
            </Span>
          </Section>
        ))
      )}
    </>
  );
};
