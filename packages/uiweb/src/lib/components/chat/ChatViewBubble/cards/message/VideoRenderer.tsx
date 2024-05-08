// React + Web3 Essentials
import { useContext, useEffect, useState } from 'react';

// External Packages
import { useConnectWallet, useSetChain } from '@web3-onboard/react';
import styled from 'styled-components';

// Internal Compoonents
import { useChatData } from '../../../../../hooks';
import { IFrame } from '../../../../../types';
import { Anchor, Button, Image, Section, Span } from '../../../../reusables';
import useToast from '../../../reusables/NewToast';
import { ThemeContext } from '../../../theme/ThemeProvider';

// Internal Configs

// Assets
import { BsLightning } from 'react-icons/bs';
import { FaBell, FaLink, FaRegThumbsUp } from 'react-icons/fa';
import { MdError, MdOpenInNew } from 'react-icons/md';

// Interfaces & Types

// Constants

// Exported Interfaces & Types

// Exported Functions
export const VideoRenderer = ({ url, frameData }: { url: string; frameData: IFrame }) => {
  const { env, user, pgpPrivateKey } = useChatData();

  const [{ wallet }] = useConnectWallet();
  const [{ connectedChain }, setChain] = useSetChain();

  const frameRenderer = useToast();
  const proxyServer = 'https://proxy.push.org';
  const [FrameData, setFrameData] = useState<IFrame>(frameData as IFrame);
  const [inputText, setInputText] = useState<string>('');
  const [imageLoadingError, setImageLoadingError] = useState<boolean>(false);

  // get theme
  const theme = useContext(ThemeContext);

  return (
    <Section
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      width="100%"
      minWidth="inherit"
      maxWidth="inherit"
      background={theme.backgroundColor?.chatFrameBackground}
    >
      {FrameData.isValidFrame && (
        <>
          <Section padding="0px 0px 8px 0px">
            <Anchor
              href={url}
              target="blank"
            >
              {!imageLoadingError && (
                <Image
                  src={FrameData.frameDetails?.image ?? FrameData.frameDetails?.ogImage ?? ''}
                  alt="Frame Fallback"
                  style={{
                    width: '100%',
                  }}
                  onError={() => {
                    setImageLoadingError(true);
                  }}
                />
              )}
              {imageLoadingError && (
                <Section
                  width="100%"
                  padding="16px"
                  background={theme.backgroundColor?.chatFrameBackground}
                  color={theme.textColor?.chatReceivedBubbleText}
                >
                  Image cannot be loaded
                </Section>
              )}
            </Anchor>
          </Section>

          {/* Render Preview */}
          <Section
            padding="8px 12px"
            justifyContent="flex-end"
          >
            <PreviewAnchor
              href={url}
              target="_blank"
              rel="noreferrer"
              color={theme.textColor?.chatFrameURLText}
            >
              {new URL(url).hostname}
            </PreviewAnchor>
          </Section>
        </>
      )}
    </Section>
  );
};

const PreviewAnchor = styled(Anchor)`
  text-decoration: none;
`;
