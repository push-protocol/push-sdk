import React, { useEffect, useState, useRef, useContext } from 'react';
import styled, { keyframes } from 'styled-components';
import { Player } from '@livepeer/react';
import * as PushAPI from '@pushprotocol/restapi';
import { SpaceDTO } from '@pushprotocol/restapi';

import { LiveSpaceProfileContainer } from './LiveSpaceProfileContainer';
import { SpaceMembersSectionModal } from './SpaceMembersSectionModal';

import { createBlockie } from '../helpers/blockies';
import { ThemeContext } from '../theme/ThemeProvider';

import CircularProgressSpinner from '../../loader/loader';

import { Button, Image, Item, Text } from '../../../config';
import MicOnIcon from '../../../icons/micon.svg';
import MicEngagedIcon from '../../../icons/MicEngage.svg';
import MuteIcon from '../../../icons/Muted.svg';
import ShareIcon from '../../../icons/Share.svg';
import MembersIcon from '../../../icons/Members.svg';
import { useSpaceData } from '../../../hooks';


interface LiveWidgetContentProps {
  spaceData?: SpaceDTO;
  // temp props only for testing demo purpose for now
  isHost?: boolean;
}

export const LiveWidgetContent: React.FC<LiveWidgetContentProps> = ({
  spaceData,
  isHost,
}) => {
  const [showMembersModal, setShowMembersModal] = useState<boolean>(false);
  const [playBackUrl, setPlayBackUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDDOpen, setIsDDOpen] = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null);

  const theme = useContext(ThemeContext);

  const {
    spacesObjectRef,
    spaceObjectData,
    setSpaceObjectData,
    isSpeaker,
    isListener,
    setSpaceWidgetId,
    isJoined,
    initSpaceObject,
  } = useSpaceData();
  console.log(
    '🚀 ~ file: LiveWidgetContent.tsx:41 ~ spaceObjectData:',
    spaceObjectData
  );

  const isMicOn = spaceObjectData?.connectionData?.local?.audio;

  const handleMicState = async () => {
    await spacesObjectRef?.current?.enableAudio?.({ state: !isMicOn });
  };

  const handleDDState = () => {
      setIsDDOpen(!isDDOpen)
  }

  const handleJoinSpace = async () => {
    if (!spaceData) {
      return;
    }

    setIsLoading(!isLoading);

    await initSpaceObject(spaceData?.spaceId as string);
    // useEffects below will handle the rest
  };

  const handleEndSpace = async () => {
    if (!spacesObjectRef?.current) return;
    await spacesObjectRef?.current?.stop?.();
    spacesObjectRef.current = null;
    setSpaceObjectData?.(PushAPI.space.initSpaceData);
    window.alert('Space ended');
  };

  const handleLeaveSpace = async () => {
    if (!spacesObjectRef?.current) return;
    if (isHost || isSpeaker) {
      await spacesObjectRef?.current?.leave?.();
      spacesObjectRef.current = null;
      setSpaceObjectData?.(PushAPI.space.initSpaceData);
      console.log('Space left');
    }
    if (isListener) {
      spacesObjectRef.current = null;
      setSpaceObjectData?.(PushAPI.space.initSpaceData);
      window.alert('Thank you for listening. Bye!');
    }
  };

  // for listener
  useEffect(() => {
    const JoinAsListner = async () => {
      console.log('isListner', isListener);
      if (
        isListener &&
        !isHost &&
        spaceObjectData.connectionData.local.address
      ) {
        console.log('joining as a listener');
        await spacesObjectRef?.current?.join?.();
        setSpaceWidgetId?.(spaceData?.spaceId as string);
        setIsLoading(!isLoading);
        console.log('space joined');
      }
    };
    JoinAsListner();
  }, [isListener]);

  // for speaker
  useEffect(() => {
    const createAudioStream = async () => {
      console.log('isSpeaker', isSpeaker);
      if (isSpeaker && !spaceObjectData?.connectionData?.local?.stream) {
        // create audio stream as we'll need it to start the mesh connection
        console.log('creating audio stream');
        await spacesObjectRef?.current?.createAudioStream?.();
      }
    };
    createAudioStream();
  }, [isSpeaker]);

  // joining as a speaker
  useEffect(() => {
    if (
      !spaceObjectData?.connectionData?.local?.stream ||
      !isSpeaker ||
      (spaceObjectData?.connectionData?.incoming?.length ?? 0) > 1
    )
      return;

    const joinSpaceAsSpeaker = async () => {
      console.log('joining as a speaker');
      await spacesObjectRef?.current?.join?.();
      setSpaceWidgetId?.(spaceData?.spaceId as string);
      console.log('space joined');
    };
    joinSpaceAsSpeaker();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spaceObjectData?.connectionData?.local?.stream]);

  useEffect(() => {
    if (!spaceObjectData?.spaceDescription) return;
    const playBackUrl = spaceObjectData?.spaceDescription;
    setPlayBackUrl(playBackUrl);
  }, [spaceObjectData?.spaceDescription]);

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
        {/* local peer details if speaker or host */}
        {(isSpeaker || isHost) && (
          <LiveSpaceProfileContainer
            isHost={isHost}
            isSpeaker={isSpeaker}
            wallet={spaceObjectData?.connectionData?.local?.address}
            image={createBlockie?.(
              spaceObjectData?.connectionData?.local?.address
            )
              ?.toDataURL()
              ?.toString()}
          />
        )}

        {/* remote peer details if speaker or host */}
        {(isSpeaker || isHost) &&
          spaceObjectData?.connectionData?.incoming
            ?.slice(1)
            .map((profile) => (
              <LiveSpaceProfileContainer
                isHost={isHost}
                isSpeaker={isSpeaker}
                wallet={profile?.address}
                image={createBlockie?.(profile?.address)
                  ?.toDataURL()
                  ?.toString()}
                stream={profile?.stream}
              />
            ))}

        {/* details of everyone in the space if a listner */}
        {isListener &&
          !isHost &&
          spaceObjectData?.members.map((profile) => (
            <div onClick={handleDDState} style={{ position: 'relative' }}>
              <LiveSpaceProfileContainer
                isHost={isHost}
                isSpeaker={isSpeaker}
                wallet={profile?.wallet}
                image={profile?.image}
              />

            {
              isDDOpen ?
              <DropDown theme={theme} ref={dropdownRef} isDDOpen={isDDOpen}>
                  <DDItem>
                      Invite to Speak
                  </DDItem>
              </DropDown>
              : null
            }
            </div>
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
              onClick={() => (isHost || isSpeaker ? handleMicState() : null)}
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
                onClick={isHost ? handleEndSpace : handleLeaveSpace}
              >
                {!isHost ? 'Leave' : 'End space'}
              </Button>
            </Item>
            {isListener && !isHost && playBackUrl.length > 0 && (
              <PeerPlayerDiv>
                <Player
                  title="spaceAudio"
                  playbackId={playBackUrl}
                  autoPlay
                />
              </PeerPlayerDiv>
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
            <Text color="white" fontSize={'16px'} fontWeight={'600'} display='flex' justifyContent='center'>
              {isLoading ? <CircularProgressSpinner /> : 'Join this Space'}
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

const DropDown = styled.div<{ theme?: any, isDDOpen: any }>`
    position: absolute;
    top: 0px;
    right: 0px;

    display: flex;
    flex-direction: column;
    gap: 12px;

    justify-content: center;
    align-items: start;

    animation: ${({ isDDOpen }) => (isDDOpen ? fadeIn : fadeOut)} 0.2s ease-in-out;
    padding: 16px;
    background: ${(props => props.theme.bgColorPrimary)};
    color: ${(props => props.theme.textColorPrimary)};
    border-radius: 16px;

    border: 1px solid ${(props => props.theme.borderColor)};
`;

const DDItem = styled.div`
    cursor: pointer;
`;

const fadeIn = keyframes`
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
`;

const fadeOut = keyframes`
    from {
        opacity: 1;
    }
    to {
        opacity: 0;
        visibility: hidden;
    }
`;

const PeerPlayerDiv = styled.div`
  visibility: hidden;
  position: absolute;
  border: 5px solid red;
`;
