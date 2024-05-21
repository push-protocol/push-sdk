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

export const ImageCard = ({ chat }: { chat: IMessagePayload }) => {
  // derive message
  const message =
    typeof chat.messageObj === 'object' ? (chat.messageObj?.content as string) ?? '' : (chat.messageObj as string);

  let parsedMessage = '';
  let imageContent = '';

  try {
    parsedMessage = JSON.parse(message);
    imageContent = (parsedMessage as any)?.content ?? '';
  } catch (error) {
    console.error('UIWeb::components::ChatViewBubble::ImageCard::error while parsing image', error);
  }

  return (
    <Section
      maxWidth="512px"
      width="fit-content"
    >
      <Image
        src={imageContent}
        alt=""
        width="100%"
      />
    </Section>
  );
};
