// React + Web3 Essentials

// External Packages
import { TwitterTweetEmbed } from 'react-twitter-embed';

// Internal Compoonents
import { Image, Section, Span } from '../../../../reusables';

// Internal Configs

// Assets

// Interfaces & Types
import { IMessagePayload } from '../../../exportedTypes';

// Constants

// Exported Interfaces & Types

// Exported Functions

export const TwitterCard = ({
  chat,
  tweetId,
  isGroup,
  position,
}: {
  chat: IMessagePayload;
  tweetId: string;
  isGroup: boolean;
  position: number;
}) => {
  return (
    <Section
      alignSelf={position ? 'end' : 'start'}
      maxWidth="100%"
    >
      <TwitterTweetEmbed tweetId={tweetId} />
    </Section>
  );
};
