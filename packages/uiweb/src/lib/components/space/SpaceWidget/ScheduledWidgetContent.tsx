import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { Button, Container, Image, Item, Text } from '../../../config';
import { formatDate } from '../../../helpers';

import SpacesIcon from '../../../icons/Spaces.svg';
import TwitterIcon from '../../../icons/twitterVector.svg';
import CopyIcon from '../../../icons/copyVector.svg';
import LensterIcon from '../../../icons/lensterVector.svg';
import { SpaceDTO } from '@pushprotocol/restapi';
import { useSpaceData } from '../../../hooks';
import { generateLensterShareURL } from '../helpers/share';
import { ShareConfig } from '../exportedTypes';
import { SpaceStatus } from './WidgetContent';

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
  isSpaceLive: any;
  setIsSpaceLive: React.Dispatch<React.SetStateAction<any>>;
}
export const ScheduledWidgetContent: React.FC<ScheduledWidgetContentProps> = ({
  spaceData,
  share,
  isHost,
  isMember,
  isSpaceLive,
  setIsSpaceLive,
}: ScheduledWidgetContentProps) => {
  const isTimeToStartSpace = true;
  const { spacesObjectRef, initSpaceObject, spaceObjectData } = useSpaceData();
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const { shareUrl, shareOptions = ['Twitter', 'Lenster', 'CopyShareUrl'] } =
    share || {};

  const handleStartSpace = async () => {
    console.log('initializing space object');
    await initSpaceObject?.(spaceData?.spaceId as string);

    console.log('creating audio stream');
    await spacesObjectRef?.current?.createAudioStream?.();

    setIsStarted(true);
    console.log('Space Started');
  };

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

  useEffect(() => {
    async function startSpace() {
      if (isSpaceLive === SpaceStatus.Live) return;
      if (!spaceObjectData?.connectionData?.local?.stream || !isStarted) return;
      await spacesObjectRef?.current?.start?.({
        livepeerApiKey: '6d29b32d-78d4-4a5c-9848-a4a0669eb530',
      });
      setIsStarted(false);
      setIsSpaceLive && setIsSpaceLive(SpaceStatus.Live);
    }
    startSpace();
  }, [isStarted]);

  console.log('Rendering ScheduledWidgetContent');
  console.log('isStarted?', isStarted);

  return (
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
          background={'#8B5CF6'}
          border={'1px solid #703BEB'}
          cursor={'pointer'}
          onClick={handleStartSpace}
        >
          <Text fontSize="14px" fontWeight={600} color="#fff">
            Start this space
          </Text>
        </Button>
      )}
      {!isHost && !isMember && (
        <Button
          padding={'9px 34px'}
          borderRadius={'8px'}
          background={'#8B5CF6'}
          border={'1px solid #703BEB'}
          cursor={'pointer'}
        >
          <Text fontSize="14px" fontWeight={600} color="#fff">
            Remind Me
          </Text>
        </Button>
      )}
      {!isHost && isMember && (
        <Button
          padding={'9px 12px'}
          borderRadius={'8px'}
          background={'#fff'}
          border={'1px solid #D4D4D8'}
          cursor={'pointer'}
        >
          <Text fontSize="14px" fontWeight={600} color="#333333">
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
                <ShareLinkButton onClick={() => handleShareAction(shareOption)}>
                  <Image src={icon} alt={alt} width={'25px'} height={'22px'} />
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
  );
};

export const SpaceInfoText = styled.span`
  font-size: 18px;
  font-weight: 600;
  text-align: center;
`;

const ShareLinkItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
`;

const ShareLinkButton = styled.button`
  background: #e4e4e7;
  border-radius: 14px;
  padding: 16px;
  border: none;
  cursor: pointer;
`;
