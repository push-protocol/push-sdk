import { ReactNode, useContext, useEffect, useRef, useState } from 'react';

import moment from 'moment';
import { MdDownload } from 'react-icons/md';
import { TwitterTweetEmbed } from 'react-twitter-embed';
import styled from 'styled-components';

import { ChatDataContext } from '../../../context';
import { useChatData } from '../../../hooks';
import { Div, Image, Section, Span } from '../../reusables';
import { checkTwitterUrl } from '../helpers/twitter';
import { ThemeContext } from '../theme/ThemeProvider';

import { useConnectWallet, useSetChain } from '@web3-onboard/react';
import { ethers } from 'ethers';
import { BsLightning } from 'react-icons/bs';
import { FaBell, FaLink, FaRegThumbsUp } from 'react-icons/fa';
import { MdError, MdOpenInNew } from 'react-icons/md';
import { FILE_ICON, allowedNetworks, device } from '../../../config';
import { formatFileSize, getPfp, pCAIP10ToWallet, shortenText, sign, toSerialisedHexString } from '../../../helpers';
import { createBlockie } from '../../../helpers/blockies';
import { FileMessageContent, FrameDetails, IFrame, IFrameButton } from '../../../types';
import { extractWebLink, getFormattedMetadata, hasWebLink } from '../../../utilities';
import { IMessagePayload, TwitterFeedReturnType } from '../exportedTypes';
import { Button, TextInput } from '../reusables';

import { FileCard } from './cards/file/FileCard';
import { GIFCard } from './cards/gif/GIFCard';
import { ImageCard } from './cards/image/ImageCard';
import { MessageCard } from './cards/message/MessageCard';
import { TwitterCard } from './cards/twitter/TwitterCard';

const SenderMessageAddress = ({ chat }: { chat: IMessagePayload }) => {
  const { user } = useContext(ChatDataContext);
  const theme = useContext(ThemeContext);
  return chat.fromCAIP10 !== user?.account ? (
    <Span
      theme={theme}
      alignSelf="start"
      textAlign="start"
      fontSize={theme.fontSize?.chatReceivedBubbleAddressText}
      fontWeight={theme.fontWeight?.chatReceivedBubbleAddressText}
      color={theme.textColor?.chatReceivedBubbleAddressText}
    >
      {chat.fromDID?.split(':')[1].slice(0, 6)}...
      {chat.fromDID?.split(':')[1].slice(-6)}
    </Span>
  ) : null;
};

const SenderMessageProfilePicture = ({ chat }: { chat: IMessagePayload }) => {
  const { user } = useContext(ChatDataContext);
  const [chatPic, setChatPic] = useState({
    pfpsrc: null as string | null,
    blockie: null as string | null,
  });

  // For blockie if icon is missing
  const blockieContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (blockieContainerRef.current && chatPic.blockie && chatPic.pfpsrc === null) {
      const blockie = createBlockie(chatPic.blockie || '', { size: 8, scale: 5 });
      blockieContainerRef.current.innerHTML = ''; // Clear the container to avoid duplicating the canvas
      blockieContainerRef.current.appendChild(blockie);
    }
  }, [chatPic.blockie]);

  useEffect(() => {
    const getUserPfp = async () => {
      try {
        const pfp = await getPfp({
          user: user,
          recipient: chat.fromCAIP10?.split(':')[1],
        });

        if (pfp) {
          setChatPic({
            pfpsrc: pfp,
            blockie: null,
          });
        } else {
          setChatPic({
            pfpsrc: null,
            blockie: chat.fromCAIP10?.split(':')[1],
          });
        }
      } catch (error) {
        console.error('UIWeb::components::chat::ChatViewBubble::SenderMessageProfilePicture::getUserPfp error', error);

        // fallback to blockie
        setChatPic({
          pfpsrc: null,
          blockie: chat.fromCAIP10?.split(':')[1],
        });
      }
    };

    // resolve user pfp
    getUserPfp();
  }, [chat.fromCAIP10]);

  return (
    <Section
      justifyContent="start"
      alignItems="start"
    >
      {chat.fromCAIP10?.split(':')[1] !== user?.account && (
        <Section
          alignItems="flex-start"
          alignSelf="flex-start"
        >
          {chatPic.pfpsrc && (
            <Image
              src={chatPic.pfpsrc}
              alt="profile picture"
              width="40px"
              height="40px"
              borderRadius="50%"
            />
          )}

          {!chatPic.pfpsrc && chatPic.blockie && (
            <Div
              ref={blockieContainerRef}
              height={'40px'}
              width={'40px'}
              borderRadius="50%"
              overflow="hidden"
            ></Div>
          )}
        </Section>
      )}
    </Section>
  );
};

const MessageWrapper = ({
  chat,
  children,
  isGroup,
}: {
  chat: IMessagePayload;
  children: ReactNode;
  isGroup: boolean;
}) => {
  const { user } = useChatData();
  const theme = useContext(ThemeContext);
  return (
    <MessageSection
      theme={theme}
      flexDirection="row"
      justifyContent="start"
      gap="6px"
      width="auto"
    >
      {isGroup && chat?.fromCAIP10 !== user?.account && <SenderMessageProfilePicture chat={chat} />}
      <Section
        justifyContent="start"
        flexDirection="column"
        maxWidth="100%"
        overflow="hidden"
      >
        {isGroup && chat?.fromCAIP10 !== user?.account && <SenderMessageAddress chat={chat} />}
        <Section
          justifyContent="start"
          flexDirection="column"
          maxWidth="100%"
          overflow="hidden"
          margin="5px 0"
        >
          {children}
        </Section>
      </Section>
    </MessageSection>
  );
};

export const ChatViewBubble = ({
  decryptedMessagePayload,
  isGroup,
}: {
  decryptedMessagePayload: IMessagePayload;
  isGroup: boolean;
}) => {
  const { user } = useChatData();
  const position =
    pCAIP10ToWallet(decryptedMessagePayload.fromDID).toLowerCase() !== pCAIP10ToWallet(user?.account!)?.toLowerCase()
      ? 0
      : 1;
  const { tweetId, messageType }: TwitterFeedReturnType = checkTwitterUrl({
    message: decryptedMessagePayload?.messageContent,
  });
  if (messageType === 'TwitterFeedLink') {
    decryptedMessagePayload.messageType = 'TwitterFeedLink';
  }

  return (
    <MessageWrapper
      chat={decryptedMessagePayload}
      isGroup={isGroup}
    >
      {/* Message Card */}
      {decryptedMessagePayload.messageType === 'Text' && (
        <MessageCard
          isGroup={isGroup}
          chat={decryptedMessagePayload}
          position={position}
          account={user?.account ?? ''}
        />
      )}

      {/* Image Card */}
      {decryptedMessagePayload.messageType === 'Image' && (
        <ImageCard
          isGroup={isGroup}
          chat={decryptedMessagePayload}
          position={position}
        />
      )}

      {/* File Card */}
      {decryptedMessagePayload.messageType === 'File' && (
        <FileCard
          isGroup={isGroup}
          chat={decryptedMessagePayload}
          position={position}
        />
      )}

      {/* Gif Card */}
      {decryptedMessagePayload.messageType === 'GIF' && (
        <GIFCard
          isGroup={isGroup}
          chat={decryptedMessagePayload}
          position={position}
        />
      )}

      {/* Twitter Card */}
      {decryptedMessagePayload.messageType === 'TwitterFeedLink' && (
        <TwitterCard
          tweetId={tweetId}
          isGroup={isGroup}
          chat={decryptedMessagePayload}
          position={position}
        />
      )}

      {/* Default Message Card */}
      {decryptedMessagePayload.messageType !== 'Text' &&
        decryptedMessagePayload.messageType !== 'Image' &&
        decryptedMessagePayload.messageType !== 'File' &&
        decryptedMessagePayload.messageType !== 'GIF' &&
        decryptedMessagePayload.messageType !== 'TwitterFeedLink' && (
          <MessageCard
            isGroup={isGroup}
            chat={decryptedMessagePayload}
            position={position}
            account={user?.account ?? ''}
          />
        )}
    </MessageWrapper>
  );
};

const MessageSection = styled(Section)`
  max-width: 70%;

  @media ${device.tablet} {
    max-width: 90%;
  }
`;
