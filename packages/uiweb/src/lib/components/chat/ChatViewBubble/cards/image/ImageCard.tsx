// React + Web3 Essentials

// External Packages

// Internal Compoonents
import { Image, Section } from '../../../../reusables';

// Internal Configs

// Assets

// Interfaces & Types
import { IMessagePayload } from '../../../exportedTypes';

// Constants

// Exported Interfaces & Types

// Exported Functions
const getParsedMessage = (message: string) => {
  try {
    return JSON.parse(message);
  } catch (error) {
    console.error('UIWeb::components::ChatViewBubble::ImageCard::error while parsing image', error);
    return null;
  }
};

const getImageContent = (message: string) => getParsedMessage(message)?.content ?? '';

export const ImageCard = ({ chat }: { chat: IMessagePayload }) => {
  // derive message
  const message =
    typeof chat.messageObj === 'object' ? (chat.messageObj?.content as string) ?? '' : (chat.messageObj as string);

  return (
    <Section
      maxWidth="512px"
      width="fit-content"
    >
      <Image
        src={getImageContent(message)}
        alt=""
        width="100%"
      />
    </Section>
  );
};
