// React + Web3 Essentials
import { useContext } from 'react';

// External Packages

// Internal Compoonents
import { Image, Section, Span } from '../../../../reusables';
import { ThemeContext } from '../../../theme/ThemeProvider';
import { Tag } from '../../tag/Tag';

// Internal Configs

// Assets

// Interfaces & Types
import { IMessagePayload } from '../../../exportedTypes';

// Constants

// Exported Interfaces & Types

// Exported Functions
export const GIFCard = ({
  chat,
  background = 'transparent',
  color = 'inherit', // default to inherit
  previewMode = false,
  activeMode = false,
}: {
  chat: IMessagePayload;
  background?: string;
  color?: string;
  previewMode?: boolean;
  activeMode?: boolean;
}) => {
  // get theme
  const theme = useContext(ThemeContext);

  // derive message
  const message =
    typeof chat.messageObj === 'object' ? (chat.messageObj?.content as string) ?? '' : (chat.messageObj as string);

  return (
    <Section
      maxWidth={previewMode ? 'auto' : '512px'}
      width="fill-available"
      justifyContent="flex-start"
      background={previewMode ? 'transparent' : background}
      color={color}
      gap="0px"
    >
      <Section
        background="white"
        borderRadius="12px"
        overflow="hidden"
        margin={theme.margin?.chatBubbleContentMargin}
        maxWidth={previewMode ? '64px' : 'auto'}
        maxHeight={previewMode ? '64px' : 'auto'}
      >
        <Image
          src={message}
          alt=""
          width="100%"
        />
      </Section>

      {previewMode && (
        <Section margin="8px 0px 0px 0px">
          <Tag type="Image" />
        </Section>
      )}
    </Section>
  );
};
