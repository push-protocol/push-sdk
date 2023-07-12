import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { LiveSpaceProfileContainer } from './LiveSpaceProfileContainer';
import { SpaceMembersSectionModal } from './SpaceMembersSectionModal';

import { Button, Image, Item, Text } from '../../../config';
import MicOnIcon from '../../../icons/micon.svg';
import MicEngagedIcon from '../../../icons/MicEngage.svg';
import MuteIcon from '../../../icons/Muted.svg';
import ShareIcon from '../../../icons/Share.svg';
import MembersIcon from '../../../icons/Members.svg';
import { SpaceDTO } from '@pushprotocol/restapi';

import { useSpaceData } from '../../../hooks';
import { Player } from '@livepeer/react';

interface LiveWidgetContentProps {
  spaceData?: SpaceDTO;
  // temp props only for testing demo purpose for now
  isHost?: boolean;
}
export const LiveWidgetContent: React.FC<LiveWidgetContentProps> = ({
  spaceData,
  isHost,
}) => {
  const tempImageUrl =
    'https://imgv3.fotor.com/images/blog-richtext-image/10-profile-picture-ideas-to-make-you-stand-out.jpg';
  const [showMembersModal, setShowMembersModal] = useState<boolean>(false);
  const [isMicOn, setIsMicOn] = useState<boolean>(true);
  const [playBackUrl, setPlayBackUrl] = useState<string>('');
  const {
    spacesObjectRef,
    spaceObjectData,
    isSpeaker,
    isListener,
    setSpaceWidgetId,
    isJoined,
    initSpaceObject,
  } = useSpaceData();

  const handleJoinSpace = async () => {
    if (!spaceData) {
      return;
    }

    await initSpaceObject(spaceData?.spaceId as string);

    if (isListener) {
      console.log('joining as a listner');
      await spacesObjectRef?.current?.join();
      setSpaceWidgetId(spaceData?.spaceId as string);
      console.log('space joined');
    }
  };

  useEffect(() => {
    const createAudioStream = async () => {
      console.log('isSpeaker', isSpeaker);
      if (isSpeaker && !spaceObjectData?.connectionData?.local.stream) {
        // create audio stream as we'll need it to start the mesh connection
        console.log('creating audio stream');
        await spacesObjectRef.current.createAudioStream();
      }
    };
    createAudioStream();
  }, [isSpeaker]);

  useEffect(() => {
    if (
      !spaceObjectData?.connectionData?.local.stream ||
      !isSpeaker ||
      spaceObjectData.connectionData.incoming.length > 1
    )
      return;

    const joinSpaceAsSpeaker = async () => {
      console.log('joining as a speaker');
      await spacesObjectRef?.current?.join();
      setSpaceWidgetId(spaceData?.spaceId as string);
      console.log('space joined');
    };
    joinSpaceAsSpeaker();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spaceObjectData?.connectionData?.local.stream]);

  useEffect(() => {
    if (!spaceObjectData.spaceDescription) return;
    const playBackUrl = spaceObjectData.spaceDescription;
    setPlayBackUrl(playBackUrl);
  }, [spaceObjectData.spaceDescription]);

  // console.log('spaceObjectData', spaceObjectData);
  // console.log('playBackUrl', playBackUrl);
  // console.log('isListener', isListener);

  return (
    <>
      <Item
        flex={'1'}
        display={'flex'}
        padding={'16px 10px'}
        flexWrap={'wrap'}
        justifyContent={'flex-start'}
        gap={'24px 12px'}
        overflowY={'auto'}
        alignContent={'flex-start'}
      >
        {isSpeaker &&
          spaceObjectData.connectionData.incoming.map((profile) => (
            <LiveSpaceProfileContainer
              isHost={isHost}
              isSpeaker={isSpeaker}
              wallet={profile.address}
              image={tempImageUrl}
              stream={profile.stream}
            />
          ))}
        {isListener &&
          spaceObjectData.members.map((profile) => (
            <LiveSpaceProfileContainer
              isHost={isHost}
              isSpeaker={isSpeaker}
              wallet={profile.wallet}
              image={tempImageUrl}
            />
          ))}
      </Item>
      <Item padding={'28px 10px'} width={'90%'}>
        {isJoined ? (
          <Item
            borderRadius={'8px'}
            background={'#EDE9FE'}
            display={'flex'}
            justifyContent={'space-between'}
            padding={'6px 8px'}
          >
            <Item
              cursor={'pointer'}
              display={'flex'}
              alignItems={'center'}
              gap={'8px'}
              padding={'10px'}
              onClick={() =>
                isHost || isSpeaker ? setIsMicOn(!isMicOn) : null
              }
            >
              <Image
                width={'14px'}
                height={'20px'}
                src={
                  isHost || isSpeaker
                    ? isMicOn
                      ? MicEngagedIcon
                      : MuteIcon
                    : MicOnIcon
                }
                alt="Mic Icon"
              />
              <Text color="#8B5CF6" fontSize={'14px'} fontWeight={600}>
                {isHost || isSpeaker
                  ? isMicOn
                    ? 'Speaking'
                    : 'Muted'
                  : 'Request'}
              </Text>
            </Item>
            <Item display={'flex'} alignItems={'center'} gap={'16px'}>
              <Image
                width={'21px'}
                height={'24px'}
                src={MembersIcon}
                cursor={'pointer'}
                onClick={() => setShowMembersModal(true)}
                alt="Members Icon"
              />
              <Image
                width={'24px'}
                height={'24px'}
                src={ShareIcon}
                cursor={'pointer'}
                alt="Share Icon"
              />
              <Button
                color="#8B5CF6"
                fontSize={'14px'}
                fontWeight={600}
                width={'100px'}
                height={'100%'}
                cursor={'pointer'}
                border={'1px solid #8B5CF6'}
                borderRadius={'12px'}
              >
                {!isHost ? 'Leave' : 'End space'}
              </Button>
            </Item>
            {isListener && playBackUrl.length > 0 && (
              <PeerPlayer
                title="spaceAudio"
                playbackId={playBackUrl}
                autoPlay
              />
            )}
          </Item>
        ) : (
          <Button
            height={'36px'}
            width={'100%'}
            border={'none'}
            borderRadius={'8px'}
            cursor={'pointer'}
            background={
              'linear-gradient(87.17deg, #EA4EE4 0%, #D23CDF 0.01%, #8B5CF6 100%), linear-gradient(87.17deg, #EA4E93 0%, #DB2777 0.01%, #9963F7 100%), linear-gradient(87.17deg, #B6A0F5 0%, #F46EF7 50.52%, #FFDED3 100%, #FFCFC5 100%), linear-gradient(0deg, #8B5CF6, #8B5CF6), linear-gradient(87.17deg, #B6A0F5 0%, #F46EF7 57.29%, #FF95D5 100%), #FFFFFF'
            }
            onClick={handleJoinSpace}
          >
            <Text color="white" fontSize={'16px'} fontWeight={'600'}>
              Join this space
            </Text>
          </Button>
        )}
        {showMembersModal ? (
          <SpaceMembersSectionModal
            onClose={() => setShowMembersModal(false)}
          />
        ) : null}
      </Item>
    </>
  );
};

const PeerPlayer = styled(Player)`
  width: 0;
  height: 0;
}`;
