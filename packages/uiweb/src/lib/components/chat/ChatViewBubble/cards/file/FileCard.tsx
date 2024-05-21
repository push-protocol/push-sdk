// React + Web3 Essentials

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
export const FileCard = ({ chat }: { chat: IMessagePayload }) => {
  // derive message
  const message =
    typeof chat.messageObj === 'object' ? (chat.messageObj?.content as string) ?? '' : (chat.messageObj as string);

  const parsedMessage = {
    name: 'Unable to load file',
    content: '',
    size: 0,
  };

  try {
    const fileContent: FileMessageContent = JSON.parse(message);
    parsedMessage.name = fileContent.name;
    parsedMessage.content = fileContent.content;
    parsedMessage.size = fileContent.size;
  } catch (error) {
    console.error('UIWeb::components::ChatViewBubble::FileCard::error while parsing image', error);
  }

  return (
    <Section
      alignSelf="start"
      maxWidth="512px"
      background="#343536"
      borderRadius="8px"
      justifyContent="space-around"
      padding="10px 13px"
      gap="15px"
      width="fit-content"
    >
      <Image
        src={FILE_ICON(parsedMessage.name?.split('.').slice(-1)[0])}
        alt="extension icon"
        width="20px"
        height="20px"
      />
      <Section
        flexDirection="column"
        gap="5px"
      >
        <Span
          color="#fff"
          fontSize="15px"
        >
          {shortenText(parsedMessage.name, 11)}
        </Span>
        <Span
          color="#fff"
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
        <MdDownload color="#575757" />
      </FileDownloadIconAnchor>
    </Section>
  );
};

const FileDownloadIconAnchor = styled.a`
  font-size: 20px;
`;
