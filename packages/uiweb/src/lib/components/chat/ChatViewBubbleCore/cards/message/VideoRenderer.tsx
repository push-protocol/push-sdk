// React + Web3 Essentials
import { useContext, useState } from 'react';

// External Packages
import { useConnectWallet, useSetChain } from '@web3-onboard/react';
import ReactPlayer from 'react-player/lazy';
import styled, { keyframes } from 'styled-components';

// Internal Compoonents
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
  // -1 is user not interacted, 0 is loading, 1 is loaded
  const [videoLoaded, setVideoLoaded] = useState<number>(-1);

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
      {frameData.isValidFrame && (
        <>
          <Section padding="0px 0px 8px 0px">
            <ReactPlayerSection>
              {/* remove preview when video is ready */}
              {videoLoaded !== 1 && (
                <ReactPlayerImage
                  src={frameData.frameDetails?.image ?? frameData.frameDetails?.ogImage ?? ''}
                  className={videoLoaded === 0 ? 'loading' : ''}
                  alt="React Player Fallback"
                />
              )}

              <ReactPlayer
                url={url}
                light={frameData.frameDetails?.image ?? frameData.frameDetails?.ogImage ?? ''}
                playing={true}
                style={{ position: 'absolute', top: 0, left: 0 }}
                width="100%"
                height="100%"
                onClickPreview={() => {
                  setVideoLoaded(0);
                }}
                onReady={() => setVideoLoaded(1)}
              />
            </ReactPlayerSection>
          </Section>

          {/* Render Preview */}
          <Section
            padding="8px 12px"
            justifyContent="flex-end"
            flexDirection="column"
            gap="4px"
          >
            {frameData.frameDetails?.ogTitle && (
              <FrameTitleSpan
                fontSize={theme.fontSize?.chatFrameTitleText}
                fontWeight={theme.fontWeight?.chatFrameTitleText}
                color={theme.textColor?.chatFrameTitleText}
              >
                {frameData.frameDetails.ogTitle}
              </FrameTitleSpan>
            )}

            {frameData.frameDetails?.ogDescription && (
              <FrameDescriptionSpan
                fontSize={theme.fontSize?.chatFrameDescriptionText}
                color={theme.textColor?.chatFrameDescriptionText}
              >
                {frameData.frameDetails.ogDescription}
              </FrameDescriptionSpan>
            )}

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

const ReactPlayerSection = styled(Section)`
  padding-top: 56.25%;
  width: 100%;
  overflow: hidden;
`;

const fader = keyframes`
  0% { opacity: 0.5; }
  50% { opacity: 1; }
  100% { opacity: 0.5; }
`;

const ReactPlayerImage = styled(Image)`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;

  z-index: -1;
  &.loading {
    animation: ${fader} 1.5s ease-in infinite;
  }
`;

const FrameTitleSpan = styled(Span)`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  width: 100%;
  text-align: start;
`;

const FrameDescriptionSpan = styled(Span)`
  text-align: start;
  width: 100%;
`;

const PreviewAnchor = styled(Anchor)`
  align-self: flex-end;
  text-decoration: none;
`;
