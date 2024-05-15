// React + Web3 Essentials

// External Packages

// Internal Compoonents
import { Image, Section, Button } from '../../../../reusables';

// Internal Configs

// Assets

// Interfaces & Types

// Constants

// Exported Interfaces & Types

// Exported Functions

export const Reaction = ({ chat }: { chat: IMessagePayload }) => {
  return (
    <Section
      alignSelf={position ? 'end' : 'start'}
      maxWidth="65%"
      width="fit-content"
      margin="5px 0"
    >
      <Button>{chat?.cid}</Button>
    </Section>
  );
};
