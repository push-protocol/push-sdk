// React + Web3 Essentials
import { useEffect, useState } from 'react';

// External Packages
import { useConnectWallet, useSetChain } from '@web3-onboard/react';
import { ethers } from 'ethers';
import styled from 'styled-components';

// Internal Compoonents
import { FILE_ICON, allowedNetworks } from '../../../../../config';
import {
  formatFileSize,
  getPfp,
  pCAIP10ToWallet,
  shortenText,
  sign,
  toSerialisedHexString,
} from '../../../../../helpers';
import { useChatData } from '../../../../../hooks';
import { FileMessageContent, FrameButton, FrameDetails, IFrame } from '../../../../../types';
import { extractWebLink, getFormattedMetadata, hasWebLink } from '../../../../../utilities';
import { Image, Section, Span } from '../../../../reusables';
import { Button, TextInput } from '../../../reusables';
import useToast from '../../../reusables/NewToast';

// Internal Configs

// Assets
import { BsLightning } from 'react-icons/bs';
import { FaBell, FaLink, FaRegThumbsUp } from 'react-icons/fa';
import { MdError, MdOpenInNew } from 'react-icons/md';

// Interfaces & Types

// Constants

// Exported Interfaces & Types

// Exported Functions
export const VideoRenderer = ({
  url,
  account,
  messageId,
  frameData,
  position,
  background,
}: {
  url: string;
  account: string;
  messageId: string;
  frameData: IFrame;
  position: number;
  background: string;
}) => {
  const { env, user, pgpPrivateKey } = useChatData();

  const [{ wallet }] = useConnectWallet();
  const [{ connectedChain }, setChain] = useSetChain();

  const frameRenderer = useToast();
  const proxyServer = 'https://proxy.push.org';
  const [FrameData, setFrameData] = useState<IFrame>(frameData as IFrame);
  const [inputText, setInputText] = useState<string>('');
  const [imageLoadingError, setImageLoadingError] = useState<boolean>(false);
  // Fetches the metadata for the URL to fetch the Frame

  return (
    <Section>
      {FrameData.isValidFrame && (
        <Section
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          width="100%"
          background={background}
        >
          <a
            href={url}
            target="blank"
          >
            <img
              src={FrameData.frameDetails?.image ?? FrameData.frameDetails?.ogImage ?? ''}
              alt="Frame Fallback"
              style={{
                borderRadius: '12px 12px 0px 0px',
                width: '100%',
              }}
              onError={() => {
                setImageLoadingError(true);
              }}
            />
          </a>
          <div
            style={{
              display: 'flex',
              width: '96%',
              justifyContent: 'flex-end',

              marginTop: '10px',
              marginBottom: '10px',
            }}
          >
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              style={{ color: 'rgba(0, 0, 0, 0.6)', textDecoration: 'none' }}
            >
              {new URL(url).hostname}
            </a>
          </div>
        </Section>
      )}
    </Section>
  );
};
