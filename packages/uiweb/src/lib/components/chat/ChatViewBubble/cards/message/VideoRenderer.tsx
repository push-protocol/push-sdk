// React + Web3 Essentials
import { useContext, useEffect, useState } from 'react';

// External Packages
import { useConnectWallet, useSetChain } from '@web3-onboard/react';
import ReactPlayer from 'react-player/lazy';
import styled from 'styled-components';

// Internal Compoonents
import { useChatData } from '../../../../../hooks';
import { IFrame } from '../../../../../types';
import { Anchor, Button, Image, Section, Span } from '../../../../reusables';
import useToast from '../../../reusables/NewToast';
import { ThemeContext } from '../../../theme/ThemeProvider';

// Internal Configs

// Assets
import { FaPlay } from 'react-icons/fa';

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
  const [playVideo, setPlayVideo] = useState<number>(-1);
  const [imageLoadingError, setImageLoadingError] = useState<boolean>(false);

  // get theme
  const theme = useContext(ThemeContext);
  console.log('UIWeb::components::chat::ChatViewBubble::cards::message::VideoRenderer.tsx:: VideoRenderer:: url', url);

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
            <ReactPlayerSection>
              <ReactPlayer
                url={url}
                light={FrameData.frameDetails?.image ?? FrameData.frameDetails?.ogImage ?? ''}
                playing={true}
                style={{ position: 'absolute', top: 0, left: 0 }}
                width="100%"
                height="100%"
              />
            </ReactPlayerSection>
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

const ReactPlayerSection = styled(Section)`
  padding-top: 56.25%;
  width: 100%;
`;
