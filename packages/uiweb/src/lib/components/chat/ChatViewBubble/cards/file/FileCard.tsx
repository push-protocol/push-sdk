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
export const FileCard = ({ chat, isGroup }: { chat: IMessagePayload; position: number; isGroup: boolean }) => {
  const fileContent: FileMessageContent = JSON.parse(chat?.messageContent);
  const name = fileContent.name;

  const content = fileContent.content as string;
  const size = fileContent.size;

  return (
    <Section
      alignSelf="start"
      maxWidth="100%"
      background="#343536"
      borderRadius="8px"
      justifyContent="space-around"
      padding="10px 13px"
      gap="15px"
      width="fit-content"
    >
      <Image
        src={FILE_ICON(name?.split('.').slice(-1)[0])}
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
          {shortenText(name, 11)}
        </Span>
        <Span
          color="#fff"
          fontSize="12px"
        >
          {formatFileSize(size)}
        </Span>
      </Section>
      <FileDownloadIconAnchor
        href={content}
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
