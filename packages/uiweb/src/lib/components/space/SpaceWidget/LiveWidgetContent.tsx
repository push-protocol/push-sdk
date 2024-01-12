import React, { useEffect, useState, useContext, useMemo } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { Player } from '@livepeer/react';
import * as PushAPI from '@pushprotocol/restapi';
import { SpaceDTO } from '@pushprotocol/restapi';

// livekit imports
import { LiveKitRoom, ConnectionState, RoomAudioRenderer, TrackToggle, ConnectionStateToast } from '@livekit/components-react';
import { Room, Track } from 'livekit-client';

import { LiveSpaceProfileContainer } from './LiveSpaceProfileContainer';
import { SpaceMembersSectionModal } from './SpaceMembersSectionModal';

import { createBlockie } from '../helpers/blockies';
import { ThemeContext } from '../theme/ThemeProvider';
import { Spinner } from '../reusables/Spinner';

import CircularProgressSpinner from '../../loader/loader';

import { Button, Image, Item, LIVEKIT_SERVER_URL, Text } from '../../../config';
import MicOnIcon from '../../../icons/micon.svg';
import MicEngagedIcon from '../../../icons/MicEngage.svg';
import MuteIcon from '../../../icons/Muted.svg';
import HandIcon from '../../../icons/hand.svg';
import MembersIcon from '../../../icons/Members.svg';
import { useSpaceData } from '../../../hooks';
import { SpaceStatus } from './WidgetContent';
import { pCAIP10ToWallet } from '../../../helpers';
import { getLivekitRoomToken, performAction } from '../../../services';
import Microphone from './Microphone';

interface LiveWidgetContentProps {
  spaceData?: SpaceDTO;
  // temp props only for testing demo purpose for now
  isHost?: boolean;
  setSpaceStatusState: React.Dispatch<React.SetStateAction<any>>;
  account: string | undefined;
}

export const LiveWidgetContent: React.FC<LiveWidgetContentProps> = ({
  spaceData,
  isHost,
  setSpaceStatusState,
  account
}) => {
  const [showMembersModal, setShowMembersModal] = useState<boolean>(false);
  const [playBackUrl, setPlayBackUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isRequestedForMic, setIsRequestedForMic] = useState(false);

  const [promotedListener, setPromotedListener] = useState('');
  const [livekitToken, setLivekitToken] = useState(null);

  const theme = useContext(ThemeContext);

  const {
    spacesObjectRef,
    spaceObjectData,
    setSpaceObjectData,
    isSpeaker,
    isListener,
    isJoined,
    initSpaceObject,
    raisedHandInfo,
  } = useSpaceData();
  console.debug("🚀 ~ file: LiveWidgetContent.tsx:66 ~ spaceObjectData:", spaceObjectData)
  console.debug("🚀 ~ file: LiveWidgetContent.tsx:66 ~ raisedHandInfo:", raisedHandInfo)

  const isMicOn = spaceObjectData?.connectionData?.local?.audio;

  const numberOfRequests = spaceObjectData.liveSpaceData.listeners.filter((listener: any) => listener.handRaised).length;

  const handleMicState = async () => {
    await spacesObjectRef?.current?.enableAudio?.({ state: !isMicOn });
  };

  useEffect(() => {
    (async function () {
      const removeEIP155 = (input: string) => input.substring(7);
      const nonEIPAddress = removeEIP155(account as string);

      if ((isHost || isSpeaker) && spaceData?.spaceId) {
        const livekitToken = await getLivekitRoomToken({ userType: "sender", roomId: spaceData?.spaceId, userId: nonEIPAddress });
        setLivekitToken(livekitToken.data);
      } else if (isListener && spaceData?.spaceId) {
        const livekitToken = await getLivekitRoomToken({ userType: "receiver", roomId: spaceData?.spaceId, userId: nonEIPAddress });
        setLivekitToken(livekitToken.data);
      }
    })();
  }, [isListener, isHost, spaceData]);

  useEffect(() => {
    // if (!spaceObjectData?.connectionData?.local?.stream || !isRequestedForMic)
    if (!isRequestedForMic)
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
    // if (!spaceObjectData?.connectionData?.local?.stream || promotedListener.length === 0)
    //   return;
    if (promotedListener.length === 0 || Object.keys(raisedHandInfo).length === 0)
      return;

    const options = {
      // signalData: raisedHandInfo[promotedListener].signalData,
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
    // await spacesObjectRef?.current?.createAudioStream?.();
    await performAction({ roomId: spaceData?.spaceId, userId: requesterAddress, canPublish: true });
    setPromotedListener(requesterAddress);
    await performAction({ roomId: spaceData?.spaceId, userId: requesterAddress, canPublish: true });
  };

  const handleRejectPromotion = async (requesterAddress: any) => {
    await spacesObjectRef?.current?.rejectPromotionRequest?.({
      promoteeAddress: pCAIP10ToWallet(requesterAddress),
    });
    await performAction({ roomId: spaceData?.spaceId, userId: requesterAddress, canPublish: false });
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
      console.debug('Space left');
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
      console.debug('isListner', isListener);
      if (
        isListener &&
        !isHost
        // && spaceObjectData.connectionData.local.address
      ) {
        console.debug('joining as a listener');
        await spacesObjectRef?.current?.join?.();
        // setSpaceWidgetId?.(spaceData?.spaceId as string);
        setIsLoading(!isLoading);
        console.debug('space joined');
      }
    };
    JoinAsListner();
  }, [isListener]);

  // for speaker
  useEffect(() => {
    const createAudioStream = async () => {
      console.debug('isSpeaker', isSpeaker);
      if (isSpeaker && !spaceObjectData?.connectionData?.local?.stream) {
        // create audio stream as we'll need it to start the mesh connection
        console.debug('creating audio stream');
        await spacesObjectRef?.current?.createAudioStream?.();
      }
    };
    createAudioStream();
  }, [isSpeaker]);

  // joining as a speaker
  useEffect(() => {
    if (
      // !spaceObjectData?.connectionData?.local?.stream ||
      !isSpeaker ||
      (spaceObjectData?.connectionData?.incoming?.length ?? 0) > 1
    )
      return;

    const joinSpaceAsSpeaker = async () => {
      console.debug('joining as a speaker');
      await spacesObjectRef?.current?.join?.();
      // setSpaceWidgetId?.(spaceData?.spaceId as string);
      setIsLoading(!isLoading);
      console.debug('space joined');
    };
    joinSpaceAsSpeaker();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spaceObjectData?.connectionData?.local?.stream]);

  useEffect(() => {
    if (!spaceObjectData?.meta) return;
    setPlayBackUrl(spaceObjectData?.meta);
  }, [spaceObjectData?.meta]);

  const livekitRoom = useMemo(() => new Room(), []);

  return (
    <ThemeProvider theme={theme}>
      <Item
        flex={'1'}
        display={'grid'}
        gridTemplateColumns={'repeat(auto-fill, 120px)'}
        padding={'16px 10px'}
        margin={'0 auto'}
        flexWrap={'wrap'}
        justifyContent={'center'}
        gap={'24px 12px'}
        overflowY={'auto'}
        overflowX={'hidden'}
        alignContent={'flex-start'}
        width={'100%'}
      >

        {
          isJoined
            ?
            <>
              {/* local peer details if speaker or host */}
              {(isSpeaker || isHost) && (
                <div style={{ position: 'relative' }}>
                  <LiveSpaceProfileContainer
                    isHost={isHost}
                    isSpeaker={isSpeaker}
                    wallet={spaceObjectData?.connectionData?.local?.address}
                    mic={spaceObjectData?.connectionData?.local?.audio}
                    image={createBlockie?.(
                      spaceObjectData?.connectionData?.local?.address
                    )
                      ?.toDataURL()
                      ?.toString()}
                  />
                </div>
              )}

              {/* details of peer connected via webRTC if speaker or host */}
              {(isSpeaker || isHost) &&
                spaceObjectData?.connectionData?.incoming
                  ?.slice(1)
                  .map((profile) => (
                    <div style={{ position: 'relative' }}>
                      <LiveSpaceProfileContainer
                        isHost={
                          profile?.address ===
                          pCAIP10ToWallet(spaceObjectData?.spaceCreator)
                        }
                        isSpeaker={
                          profile?.address !==
                          pCAIP10ToWallet(spaceObjectData?.spaceCreator)
                        }
                        mic={profile?.audio}
                        wallet={profile?.address}
                        image={createBlockie?.(profile?.address)
                          ?.toDataURL()
                          ?.toString()}
                        stream={profile?.stream}
                      />
                    </div>
                  ))}

              {/* details of peer connected via webRTC if speaker or host */}
              {(isHost) &&
                spaceObjectData?.liveSpaceData.speakers.map((profile) => (
                  <div style={{ position: 'relative' }}>
                    <LiveSpaceProfileContainer
                      isHost={false}
                      isSpeaker={true}
                      wallet={profile?.address}
                      mic={profile?.audio}
                      image={createBlockie?.(profile?.address)
                        ?.toDataURL()
                        ?.toString()}
                    />
                  </div>
                ))}

              {/* details of host in the space if listener */}
              {isListener && !isHost && (
                <div style={{ position: 'relative' }}>
                  <LiveSpaceProfileContainer
                    isHost={true}
                    isSpeaker={false}
                    wallet={spaceObjectData?.liveSpaceData.host?.address}
                    mic={spaceObjectData?.liveSpaceData.host?.audio}
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
                      mic={profile?.audio}
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
            </>
            :
            spaceData?.members
              .map((profile) => (
                <div style={{ position: 'relative' }}>
                  <LiveSpaceProfileContainer
                    wallet={profile?.wallet}
                    isHost={profile?.wallet === spaceData.spaceCreator}
                    isSpeaker={profile?.isSpeaker}
                    image={profile?.image || createBlockie?.(profile?.wallet)
                      ?.toDataURL()
                      ?.toString()}
                  />
                </div>
              ))
        }
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
            {livekitToken ? (
              <LiveKitRoom
                serverUrl={LIVEKIT_SERVER_URL}
                token={livekitToken}
                room={livekitRoom}
              >
                <RoomAudioRenderer />
                {/* <TrackToggleComp source={Track.Source.Microphone} /> */}
                {isHost || isSpeaker
                  ?
                  <TrackToggleComp showIcon={false} source={Track.Source.Microphone} >
                    <Microphone source={Track.Source.Microphone} />
                  </TrackToggleComp>
                  :
                  <Item
                    cursor={'pointer'}
                    display={'flex'}
                    alignItems={'center'}
                    gap={'8px'}
                    padding={'10px'}
                    onClick={() => handleRequest()}
                  >
                    <Image
                      width={'14px'}
                      height={'20px'}
                      src={
                        isRequestedForMic
                          ? HandIcon
                          : MicOnIcon
                      }
                      alt="Mic Icon"
                    />
                    <Text
                      color={`${theme.btnOutline}`}
                      fontSize={'14px'}
                      fontWeight={600}
                    >
                      {
                        isRequestedForMic
                          ? 'Requested'
                          : 'Request'
                      }
                    </Text>
                  </Item>
                }
              </LiveKitRoom>
            )
              :
              <Item
                cursor={'pointer'}
                display={'flex'}
                alignItems={'center'}
                gap={'8px'}
                padding={'10px'}
              >
                <Spinner size="20" />
                <Text
                  color={`${theme.btnOutline}`}
                  fontSize={'14px'}
                  fontWeight={600}
                >
                  Connecting
                </Text>
              </Item>
            }
            {/* <Item
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
                      : isRequestedForMic
                        ? HandIcon
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
                    : isRequestedForMic
                      ? 'Requested'
                      : 'Request'
                  }
                </Text>
              </Item> */}
            <Item display={'flex'} alignItems={'center'} gap={'16px'}>
              <MembersContainer>
                {
                  isHost && numberOfRequests ?
                    <RequestsCount>
                      {numberOfRequests}
                    </RequestsCount>
                    : null
                }
                <Image
                  width={'21px'}
                  height={'24px'}
                  src={MembersIcon}
                  cursor={'pointer'}
                  onClick={() => setShowMembersModal(true)}
                  alt="Members Icon"
                />
              </MembersContainer>
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
            {/* {isListener && !isHost && playBackUrl.length > 0 && (
              <PeerPlayerDiv>
                <Player title="spaceAudio" playbackId={playBackUrl} autoPlay />
              </PeerPlayerDiv>
            )} */}
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
            isHost={isHost}
          />
        ) : null}
      </Item>
    </ThemeProvider>
  );
};

const PeerPlayerDiv = styled.div`
  visibility: hidden;
  position: absolute;
  border: 5px solid red;
`;

const MembersContainer = styled.div`
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const RequestsCount = styled.div`
  position: absolute;
  top: -8px;
  right: -6px;

  background-color: ${(props) => props.theme.btnColorPrimary};
  padding: 2px 4px;
  border-radius: 4px;
  font-size: 12px;
`;

const LiveKitComp = styled.div`
  background-color: white;
  padding: 12px;
  margin: 12px;
`;

const TrackToggleComp = styled(TrackToggle)`
  background-color: transparent;
  border: none;
`;