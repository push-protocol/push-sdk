import React, { useEffect, useRef, useState } from 'react';
import { IMediaStream } from '@pushprotocol/restapi';
import { Image, Item, Text } from '../../../config';

import HandIcon from '../../../icons/hand.svg';
import MicOffIcon from '../../../icons/micoff.svg';
import { VideoPlayer } from './VideoPlayer';

import styled, { ThemeProvider, keyframes } from 'styled-components';
import { ThemeContext } from '../theme/ThemeProvider';
import { useSpaceData } from '../../../hooks';
import { pCAIP10ToWallet } from '../../../helpers';

export interface ILiveSpaceProfileContainerProps {
  wallet: string;
  isHost?: boolean;
  isSpeaker?: boolean;
  image: string;
  requested?: boolean;
  mic?: boolean;
  stream?: IMediaStream;
}

export const LiveSpaceProfileContainer = (
  options: ILiveSpaceProfileContainerProps
) => {
  const theme = React.useContext(ThemeContext);
  const {
    wallet,
    isHost,
    isSpeaker,
    image,
    requested = false,
    mic = true,
    stream,
  } = options || {};

  const [isDDOpen, setIsDDOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    spacesObjectRef,
  } = useSpaceData();

  const handleDDState = () => {
    setIsDDOpen(!isDDOpen);
  };

  const inviteListener = async () => {
    await spacesObjectRef?.current?.inviteToPromote?.({ role: 'SPEAKER', inviteeAddress: pCAIP10ToWallet(wallet) })
  }

  useEffect(() => {
    const handleOutsideClick = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDDOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Item
        display={'flex'}
        flexDirection={'column'}
        alignItems={'center'}
        width={'118px'}
      >
        <Image
          src={image}
          alt="Profile pic"
          height={'56px'}
          width={'56px'}
          borderRadius={'50%'}
          cursor='pointer'
          onClick={handleDDState}
        />
        <Text fontSize={'16px'} marginTop={'12px'} fontWeight={600} color={`${theme.textColorPrimary}`}>
          {wallet.replace('eip155:', '').slice(0, -36) + '...'}
          {stream && <VideoPlayer videoCallData={stream} />}
        </Text>
        {requested ? (
          <Item
            display={'flex'}
            marginTop={'5px'}
            fontWeight={600}
            gap={'4px'}
            alignItems={'center'}
          >
            <Text fontSize={'12px'} color={`${theme.btnColorPrimary}`}>
              Requested
            </Text>
            <Image
              src={HandIcon}
              alt="Hand Icon"
              height={'15px'}
              width={'15px'}
            />
          </Item>
        ) : (
          <Item
            display={'flex'}
            marginTop={'5px'}
            fontWeight={600}
            gap={'4px'}
            alignItems={'center'}
          >
            <Text fontSize={'14px'} color={`${theme.textColorSecondary}`}>
              {isHost ? 'Host' : isSpeaker ? 'Speaker' : 'Listener'}
            </Text>
            {!mic && (
              <Image
                src={MicOffIcon}
                alt="Mic Off Icon"
                height={'15px'}
                width={'15px'}
              />
            )}
          </Item>
        )}
      </Item>

      {isDDOpen ? (
        <DropDown theme={theme} ref={dropdownRef} isDDOpen={isDDOpen}>
          <DDItem onClick={inviteListener}>Invite to Speak</DDItem>
          {/* <DDItem>Mute</DDItem>
          <DDItem>Kick Listener</DDItem> */}
        </DropDown>
      ) : null}
    </ThemeProvider>
  );
};

const DropDown = styled.div<{ theme?: any; isDDOpen: any }>`
  position: absolute;
  top: 48px;
  right: 5px;

  display: flex;
  flex-direction: column;

  justify-content: center;
  align-items: start;

  padding: 12px 6px;

  animation: ${({ isDDOpen }) => (isDDOpen ? fadeIn : fadeOut)} 0.2s ease-in-out;
  background: ${(props) => props.theme.bgColorPrimary};
  color: ${(props) => props.theme.textColorPrimary};
  border-radius: 16px;

  border: 1px solid ${(props) => props.theme.borderColor};
`;

const DDItem = styled.div`
  cursor: pointer;

  font-size: 12px;
  padding: 6px;

  border-radius: 4px;
  transition: 200ms ease;

  &:hover {
    background-color: ${(props) => props.theme.borderColor};
    transition: 200ms ease;
  }
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
