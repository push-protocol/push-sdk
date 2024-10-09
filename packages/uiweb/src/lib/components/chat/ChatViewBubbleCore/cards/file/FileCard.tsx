// React + Web3 Essentials
import { useContext } from 'react';

// External Packages
import styled from 'styled-components';

// Internal Compoonents
import {
  formatFileSize,
  getPfp,
  pCAIP10ToWallet,
  shortenText,
  sign,
  toSerialisedHexString,
} from '../../../../../helpers';
import { Image, Section, Span } from '../../../../reusables';
import { ThemeContext } from '../../../theme/ThemeProvider';

// Internal Configs
import { FILE_ICON, allowedNetworks } from '../../../../../config';

// Assets
import { MdDownload } from 'react-icons/md';

// Interfaces & Types
import { FileMessageContent, FrameDetails, IFrame, IFrameButton } from '../../../../../types';
import { IMessagePayload } from '../../../exportedTypes';

// Constants

// Exported Interfaces & Types

// Exported Functions

const getParsedMessage = (message: string): FileMessageContent => {
  try {
    return JSON.parse(message);
  } catch (error) {
    console.error('UIWeb::components::ChatViewBubble::FileCard::error while parsing image', error);
    return {
      name: 'Unable to load file',
      content: '',
      size: 0,
      type: '',
    };
  }
};

export const FileCard = ({
  chat,
  background,
  color,
  previewMode,
  activeMode,
}: {
  chat: IMessagePayload;
  background?: string;
  color?: string;
  previewMode: boolean;
  activeMode: boolean;
}) => {
  // get theme
  const theme = useContext(ThemeContext);

  // derive message
  const message =
    typeof chat.messageObj === 'object' ? (chat.messageObj?.content as string) ?? '' : (chat.messageObj as string);

  const parsedMessage = getParsedMessage(message);

  return (
    <Section
      alignSelf="start"
      maxWidth={previewMode ? 'auto' : '512px'}
      background={background}
      borderRadius={theme.borderRadius?.chatBubbleContentBorderRadius}
      justifyContent="space-between"
      padding={theme.padding?.chatBubbleContentPadding}
      margin={theme.margin?.chatBubbleContentMargin}
      gap="15px"
      width={previewMode ? 'fill-available' : '-webkit-fit-content'}
    >
      <Image
        src={FILE_ICON(parsedMessage.name?.split('.').slice(-1)[0])}
        alt="extension icon"
        width="20px"
        height="20px"
      />
      <Section
        flexDirection="column"
        flex={previewMode ? '1' : 'auto'}
        alignItems={previewMode ? 'flex-start' : 'center'}
        gap="5px"
      >
        <Span
          color={color}
          fontSize="15px"
        >
          {shortenText(parsedMessage.name, 11)}
        </Span>
        <Span
          color={color}
          fontSize="12px"
        >
          {formatFileSize(parsedMessage.size)}
        </Span>
      </Section>
      <FileDownloadIconAnchor
        href={parsedMessage.content}
        target="_blank"
        rel="noopener noreferrer"
        download
      >
        <MdDownload color={color} />
      </FileDownloadIconAnchor>
    </Section>
  );
};

const FileDownloadIconAnchor = styled.a`
  font-size: 20px;
`;
