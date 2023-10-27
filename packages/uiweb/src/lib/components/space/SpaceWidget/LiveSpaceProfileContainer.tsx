import React, { useEffect, useRef, useState } from 'react';
import { IMediaStream } from '@pushprotocol/restapi';
import { ThemeProvider } from 'styled-components';

import { VideoPlayer } from './VideoPlayer';

import { ThemeContext } from '../theme/ThemeProvider';

import { Image, Item, Text } from '../../../config';
import HandIcon from '../../../icons/hand.svg';
import MicOffIcon from '../../../icons/micoff.svg';
import MicOnIcon from '../../../icons/micon.svg';
import { formatCryptoAddress } from '../helpers/account';

export interface ILiveSpaceProfileContainerProps {
  wallet: string;
  isHost?: boolean;
  isSpeaker?: boolean;
  image: string;
  requested?: boolean;
  mic?: boolean | null;
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
    mic = null,
    stream,
  } = options || {};

  const [isDDOpen, setIsDDOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleDDState = () => {
    setIsDDOpen(!isDDOpen);
  };

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
          {formatCryptoAddress(wallet.replace('eip155:', ''))}
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
            {mic === false && (
              <Image
                src={MicOffIcon}
                alt="Mic Off Icon"
                height={'15px'}
                width={'15px'}
              />
            )}
            {mic && (
              <Image
                src={MicOnIcon}
                alt="Mic On Icon"
                height={'15px'}
                width={'15px'}
              />
            )}
          </Item>
        )}
      </Item>
    </ThemeProvider>
  );
};
