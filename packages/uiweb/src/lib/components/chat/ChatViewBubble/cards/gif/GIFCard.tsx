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
export const GIFCard = ({ chat, position, isGroup }: { chat: IMessagePayload; position: number; isGroup: boolean }) => {
  return (
    <Section
      alignSelf={position ? 'end' : 'start'}
      maxWidth="65%"
      margin="5px 0"
      width="fit-content"
    >
      <Image
        src={chat?.messageContent}
        alt=""
        width="100%"
        borderRadius={position ? '12px 0px 12px 12px' : '0px 12px 12px 12px'}
      />
    </Section>
  );
};
