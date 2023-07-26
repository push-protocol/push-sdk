import React, { useEffect, useState, useRef, useContext } from 'react';
import styled, { keyframes, ThemeProvider } from 'styled-components';
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
import { SpaceStatus } from './WidgetContent';
import { pCAIP10ToWallet } from '../../../helpers';

interface LiveWidgetContentProps {
  spaceData?: SpaceDTO;
  // temp props only for testing demo purpose for now
  isHost?: boolean;
  setSpaceStatusState: React.Dispatch<React.SetStateAction<any>>;
}

export const LiveWidgetContent: React.FC<LiveWidgetContentProps> = ({
  spaceData,
  isHost,
  setSpaceStatusState,
}) => {
  const [showMembersModal, setShowMembersModal] = useState<boolean>(false);
  const [playBackUrl, setPlayBackUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isRequestedForMic, setIsRequestedForMic] = useState(false);

  const [promotedListener, setPromotedListener] = useState('');

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
    raisedHandInfo,
  } = useSpaceData();
  console.log("🚀 ~ file: LiveWidgetContent.tsx:56 ~ spaceObjectData:", spaceObjectData)
  console.log("🚀 ~ file: LiveWidgetContent.tsx:56 ~ isSpeaker:", isSpeaker)
  console.log("🚀 ~ file: LiveWidgetContent.tsx:56 ~ isListener:", isListener)

  const isMicOn = spaceObjectData?.connectionData?.local?.audio;

  const handleMicState = async () => {
    await spacesObjectRef?.current?.enableAudio?.({ state: !isMicOn });
  };

  useEffect(() => {
    if (!spaceObjectData?.connectionData?.local?.stream || !isRequestedForMic)
      return;

    const requestedForMicFromEffect = async () => {
      await spacesObjectRef?.current?.requestToBePromoted?.({
        role: 'SPEAKER',
        promotorAddress: pCAIP10ToWallet(spaceObjectData?.spaceCreator),
      });
    };
    requestedForMicFromEffect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRequestedForMic]);

  const handleRequest = async () => {
    await spacesObjectRef?.current?.createAudioStream?.();
    setIsRequestedForMic(true);
  };

  useEffect(() => {
    if (!spaceObjectData?.connectionData?.local?.stream || promotedListener.length === 0)
      return;

    const options = {
      signalData: raisedHandInfo[promotedListener].signalData,
      promoteeAddress: pCAIP10ToWallet(
        raisedHandInfo[promotedListener].senderAddress
      ),
      spaceId: raisedHandInfo[promotedListener].chatId,
      role: 'SPEAKER',
    };

    const promoteListenerFromEffect = async () => {
      await spacesObjectRef?.current?.acceptPromotionRequest?.(options);
    };
    promoteListenerFromEffect();
  }, [promotedListener]);

  const handleAcceptPromotion = async (requesterAddress: any) => {
    await spacesObjectRef?.current?.createAudioStream?.();
    setPromotedListener(requesterAddress);
  };

  const handleRejectPromotion = async (requesterAddress: any) => {
    await spacesObjectRef?.current?.rejectPromotionRequest?.({
      promoteeAddress: pCAIP10ToWallet(requesterAddress),
    });
  };

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
    setSpaceStatusState?.(SpaceStatus.Ended);
    setIsLoading(false);
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
    }
    setIsLoading(false);
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
        // setSpaceWidgetId?.(spaceData?.spaceId as string);
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
      // setSpaceWidgetId?.(spaceData?.spaceId as string);
      setIsLoading(!isLoading);
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
    <ThemeProvider theme={theme}>
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

        {/* details of peer connected via webRTC if speaker or host */}
        {(isSpeaker || isHost) &&
          spaceObjectData?.connectionData?.incoming
            ?.slice(1)
            .map((profile) => (
              <LiveSpaceProfileContainer
                isHost={
                  profile?.address ===
                  pCAIP10ToWallet(spaceObjectData?.spaceCreator)
                }
                isSpeaker={
                  profile?.address !==
                  pCAIP10ToWallet(spaceObjectData?.spaceCreator)
                }
                wallet={profile?.address}
                image={createBlockie?.(profile?.address)
                  ?.toDataURL()
                  ?.toString()}
                stream={profile?.stream}
              />
            ))}

        {/* details of host in the space if listener */}
        {isListener && !isHost && (
          <div style={{ position: 'relative' }}>
            <LiveSpaceProfileContainer
              isHost={true}
              isSpeaker={false}
              wallet={spaceObjectData?.liveSpaceData.host?.address}
              image={createBlockie?.(
                spaceObjectData?.liveSpaceData?.host?.address
              )
                ?.toDataURL()
                ?.toString()}
            />
          </div>
        )}

        {/* details of speakers in the space if listener */}
        {isListener &&
          !isHost &&
          spaceObjectData?.liveSpaceData.speakers.map((profile) => (
            <div style={{ position: 'relative' }}>
              <LiveSpaceProfileContainer
                isHost={false}
                isSpeaker={true}
                wallet={profile?.address}
                image={createBlockie?.(profile?.address)
                  ?.toDataURL()
                  ?.toString()}
              />
            </div>
          ))}

        {/* details of listeners */}
        {spaceObjectData?.liveSpaceData.listeners.map((profile) => (
          <div style={{ position: 'relative' }}>
            <LiveSpaceProfileContainer
              isHost={false}
              isSpeaker={false}
              requested={profile.handRaised}
              wallet={profile?.address}
              image={createBlockie?.(profile?.address)?.toDataURL()?.toString()}
            />
          </div>
        ))}
      </Item>
      <Item padding={'28px 10px'} width={'90%'}>
        {isJoined ? (
          <Item
            borderRadius={'8px'}
            background={`${theme.bgColorSecondary}`}
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
                isHost || isSpeaker ? handleMicState() : handleRequest()
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
              <Text
                color={`${theme.btnOutline}`}
                fontSize={'14px'}
                fontWeight={600}
              >
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
              {/* <Image
                width={'24px'}
                height={'24px'}
                src={ShareIcon}
                cursor={'pointer'}
                alt="Share Icon"
              /> */}
              <Button
                color={`${theme.btnColorPrimary}`}
                fontSize={'14px'}
                fontWeight={600}
                width={'100px'}
                height={'100%'}
                cursor={'pointer'}
                border={`1px solid ${theme.btnOutline}`}
                borderRadius={'12px'}
                onClick={isHost ? handleEndSpace : handleLeaveSpace}
              >
                {!isHost ? 'Leave' : 'End space'}
              </Button>
            </Item>
            {isListener && !isHost && playBackUrl.length > 0 && (
              <PeerPlayerDiv>
                <Player title="spaceAudio" playbackId={playBackUrl} autoPlay />
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
            background={`${theme.titleBg}`}
            onClick={handleJoinSpace}
          >
            <Text
              color={`${theme.titleTextColor}`}
              fontSize={'16px'}
              fontWeight={'600'}
              display="flex"
              justifyContent="center"
            >
              {isLoading ? <CircularProgressSpinner /> : 'Join this Space'}
            </Text>
          </Button>
        )}
        {showMembersModal ? (
          <SpaceMembersSectionModal
            onClose={() => setShowMembersModal(false)}
            spaceData={spaceObjectData}
            acceptCallback={handleAcceptPromotion}
            rejectCallback={handleRejectPromotion}
          />
        ) : null}
      </Item>
    </ThemeProvider>
  );
};

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
