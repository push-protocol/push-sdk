// React + Web3 Essentials

// External Packages

// Internal Compoonents
import { Image, Section, Span } from '../../../../reusables';

// Internal Configs

// Assets

// Interfaces & Types
import { IMessagePayload } from '../../../exportedTypes';

// Constants

// Exported Interfaces & Types

// Exported Functions
export const GIFCard = ({ chat }: { chat: IMessagePayload }) => {
  // derive message
  const message =
    typeof chat.messageObj === 'object' ? (chat.messageObj?.content as string) ?? '' : (chat.messageObj as string);

  return (
    <Section
      maxWidth="512px"
      width="fit-content"
    >
      <Image
        src={message}
        alt=""
        width="100%"
      />
    </Section>
  );
};
