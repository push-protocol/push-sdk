import React, { useEffect, useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';

import { Button, Container, Image, Item, Text } from '../../../config';
import { formatDate } from '../../../helpers';
import CircularProgressSpinner from '../../loader/loader';

import SpacesIcon from '../../../icons/Spaces.svg';
import TwitterIcon from '../../../icons/twitterVector.svg';
import CopyIcon from '../../../icons/copyVector.svg';
import LensterIcon from '../../../icons/lensterVector.svg';
import { SpaceDTO } from '@pushprotocol/restapi';
import { useSpaceData } from '../../../hooks';
import { generateLensterShareURL } from '../helpers/share';
import { ShareConfig } from '../exportedTypes';
import { SpaceStatus } from './WidgetContent';

import { ThemeContext } from '../theme/ThemeProvider';

enum ShareOptions {
  Twitter = 'Twitter',
  Lenster = 'Lenster',
  CopyShareUrl = 'Copy Link',
}

export type ShareOptionsValues = keyof typeof ShareOptions;

interface ScheduledWidgetContentProps {
  spaceData?: SpaceDTO;
  share?: ShareConfig;

  // temp props only for testing demo purpose for now
  isHost?: boolean;
  isTimeToStartSpace?: boolean;
  isMember?: boolean;
  spaceStatusState: any;
  setSpaceStatusState: React.Dispatch<React.SetStateAction<any>>;
}
export const ScheduledWidgetContent: React.FC<ScheduledWidgetContentProps> = ({
  spaceData,
  share,
  isHost,
  isMember,
  spaceStatusState,
  setSpaceStatusState,
}: ScheduledWidgetContentProps) => {
  const theme = React.useContext(ThemeContext);
  const { spacesObjectRef, initSpaceObject, spaceObjectData } = useSpaceData();

  const isTimeToStartSpace = true;

  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { shareUrl, shareOptions = ['Twitter', 'Lenster', 'CopyShareUrl'] } =
    share || {};

  const handleStartSpace = async () => {
    setIsLoading(!isLoading);

    console.log('initializing space object');
    await initSpaceObject?.(spaceData?.spaceId as string);

    console.log('creating audio stream');
    await spacesObjectRef?.current?.createAudioStream?.();

    setIsLoading(!isLoading);
    setIsStarted(true);
  };

  const handleStartSpaceLiveKit = async () => {
    setIsLoading(!isLoading);
    console.log(spaceStatusState)

    await initSpaceObject?.(spaceData?.spaceId as string);

    setIsLoading(!isLoading);
    setIsStarted(true);

    console.log(spaceStatusState)
  }

  const handleShareTweet = () => {
    if (!shareUrl) return;
    const url = shareUrl;
    const tweetText = 'Join this Space:'; // Replace with your desired tweet text

    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      tweetText
    )}&url=${encodeURIComponent(url)}`;

    window.open(tweetUrl, '_blank');
  };

  const handleShareLenster = () => {
    if (!shareUrl) return;
    const url = shareUrl;
    const lensterShareText = 'Join this space';

    const lensterShareUrl = generateLensterShareURL({
      text: lensterShareText,
      url,
    });

    window.open(lensterShareUrl, '_blank');
  };

  const handleCopyLink = async () => {
    try {
      if (!shareUrl) return;
      const url = shareUrl;
      await navigator.clipboard.writeText(url);
      // add a success toast here
      console.log('URL copied to clipboard:', url);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  const handleShareAction = (shareOption: ShareOptionsValues) => {
    switch (shareOption) {
      case ShareOptions.Twitter:
        handleShareTweet();
        break;
      case ShareOptions.Lenster:
        handleShareLenster();
        break;
      default:
        handleCopyLink();
        break;
    }
  };

  const getShareOptionDetails = (shareOption: ShareOptionsValues) => {
    let icon = '';
    let alt = '';

    switch (shareOption) {
      case ShareOptions.Twitter:
        icon = TwitterIcon;
        alt = 'Twitter Icon';
        break;
      case ShareOptions.Lenster:
        icon = LensterIcon;
        alt = 'Lenster Icon';
        break;
      default:
        icon = CopyIcon;
        alt = 'Copy Icon';
        break;
    }

    return { icon, alt };
  };

  // useEffect(() => {
  //   async function startSpace() {
  //     if (spaceStatusState === SpaceStatus.Live) return;
  //     if (!spaceObjectData?.connectionData?.local?.stream || !isStarted) return;
  //     console.log('SPACE STARTING');
  //     await spacesObjectRef?.current?.start?.({
  //       livepeerApiKey: 'ac9d3e33-56c2-4a22-a328-a08a46fd9356',
  //     });
  //     console.log('SPACE STARTED');
  //     setIsStarted(false);
  //     setSpaceStatusState && setSpaceStatusState(SpaceStatus.Live);
  //   }
  //   startSpace();
  // }, [isStarted]);

  useEffect(() => {
    async function startSpace() {
      if (spaceStatusState === SpaceStatus.Live) return;
      if (!isStarted) return;

      await spacesObjectRef?.current?.start?.();

      console.log('SPACE STARTED');

      setIsStarted(false);

      setSpaceStatusState && setSpaceStatusState(SpaceStatus.Live);
      console.log(spaceStatusState)
    }
    startSpace();
  }, [isStarted]);

  return (
    <ThemeProvider theme={theme}>
      <Container
        display={'flex'}
        height={'100%'}
        alignItems={'center'}
        flexDirection={'column'}
        justifyContent={'center'}
        gap={'15px'}
        padding={'0 24px'}
      >
        <Image
          width={'41px'}
          height={'41px'}
          src={SpacesIcon}
          alt="Spaces Icon"
        />
        {isHost ? (
          isTimeToStartSpace ? (
            <SpaceInfoText>It’s time to start your space</SpaceInfoText>
          ) : (
            <SpaceInfoText>
              Your space is scheduled. <br /> Share and let people know when to
              join!
            </SpaceInfoText>
          )
        ) : (
          <SpaceInfoText>
            This space will go live on{' '}
            {formatDate((spaceData?.scheduleAt as any) || new Date())}
          </SpaceInfoText>
        )}
        {isHost && isTimeToStartSpace && (
          <Button
            padding={'9px 34px'}
            borderRadius={'8px'}
            background={`${theme.btnColorPrimary}`}
            border={`1px solid ${theme.btnOutline}`}
            cursor={'pointer'}
            onClick={handleStartSpaceLiveKit}
          >
            <Text fontSize="14px" fontWeight={600} color="#fff">
              {isLoading ? <CircularProgressSpinner /> : 'Start this Space'}
            </Text>
          </Button>
        )}
        {/* {!isHost && !isMember && (
          <Button
            padding={'9px 34px'}
            borderRadius={'8px'}
            background={`${theme.btnColorPrimary}`}
            border={`1px solid ${theme.btnOutline}`}
            cursor={'pointer'}
          >
            <Text fontSize="14px" fontWeight={600} color="#fff">
              Remind Me
            </Text>
          </Button>
        )} */}
        {!isHost && isMember && (
          <Button
            padding={'9px 12px'}
            borderRadius={'8px'}
            background={`${theme.bgColorPrimary}`}
            border={`1px solid ${theme.borderColor}`}
            cursor={'pointer'}
          >
            <Text
              fontSize="14px"
              fontWeight={600}
              color={`${theme.textColorPrimary}`}
            >
              Remove Reminder
            </Text>
          </Button>
        )}
        {(!isHost || (isHost && !isTimeToStartSpace)) && shareUrl && (
          <Item display={'flex'} gap={'13px'}>
            {shareOptions.map((shareOption) => {
              const { icon, alt } = getShareOptionDetails(shareOption);
              return (
                <ShareLinkItem key={shareOption}>
                  <ShareLinkButton
                    onClick={() => handleShareAction(shareOption)}
                  >
                    <Image
                      src={icon}
                      alt={alt}
                      width={'25px'}
                      height={'22px'}
                    />
                  </ShareLinkButton>
                  <Text fontSize={'12px'} fontWeight={600}>
                    {ShareOptions[shareOption]}
                  </Text>
                </ShareLinkItem>
              );
            })}
          </Item>
        )}
      </Container>
    </ThemeProvider>
  );
};

export const SpaceInfoText = styled.span`
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  color: ${({ theme }) => theme.textColorPrimary};
`;

const ShareLinkItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
`;

const ShareLinkButton = styled.button`
  background: ${({ theme }) => theme.bgColorSecondary};
  border-radius: 14px;
  padding: 16px;
  border: none;
  cursor: pointer;
`;
