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

export const TwitterCard = ({ chat, tweetId }: { chat: IMessagePayload; tweetId: string }) => {
  return (
    <Section
      maxWidth="100%"
      width="fit-content"
      margin="5px 0"
    >
      <TwitterTweetEmbed tweetId={tweetId} />
    </Section>
  );
};
