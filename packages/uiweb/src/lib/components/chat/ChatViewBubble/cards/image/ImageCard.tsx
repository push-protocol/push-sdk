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
import { parseJson } from '../../../../../helpers';

export const ImageCard = ({
  chat,
  position,
  isGroup,
}: {
  chat: IMessagePayload;
  position: number;
  isGroup: boolean;
}) => {
  return (
    <Section
      alignSelf={position ? 'end' : 'start'}
      maxWidth="65%"
      width="fit-content"
      margin="5px 0"
    >
      <Image
        src={parseJson(chat?.messageContent)?.content}
        alt=""
        width="100%"
        borderRadius={position ? '12px 0px 12px 12px' : '0px 12px 12px 12px'}
      />
    </Section>
  );
};
