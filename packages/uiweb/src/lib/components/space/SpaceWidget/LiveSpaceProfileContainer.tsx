import React from 'react';
import { IMediaStream } from '@pushprotocol/restapi';
import { Image, Item, Text } from '../../../config';

import HandIcon from '../../../icons/hand.svg';
import MicOffIcon from '../../../icons/micoff.svg';
import { VideoPlayer } from './VideoPlayer';

import { ThemeProvider } from 'styled-components';
import { ThemeContext } from '../theme/ThemeProvider';

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
        />
        <Text fontSize={'17px'} marginTop={'4px'} fontWeight={600}>
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
    </ThemeProvider>
  );
};
