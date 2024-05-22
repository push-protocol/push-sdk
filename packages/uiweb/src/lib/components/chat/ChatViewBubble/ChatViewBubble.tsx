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
import {
  formatFileSize,
  getPfp,
  pCAIP10ToWallet,
  shortenText,
  sign,
  toSerialisedHexString,
  isMessageEncrypted,
} from '../../../helpers';
import { createBlockie } from '../../../helpers/blockies';
import { FileMessageContent, FrameDetails, IFrame, IFrameButton, IReactionsForChatMessages } from '../../../types';
import { extractWebLink, getFormattedMetadata, hasWebLink } from '../../../utilities';
import { IMessagePayload, TwitterFeedReturnType } from '../exportedTypes';
import { Button, TextInput } from '../reusables';

import { FileCard } from './cards/file/FileCard';
import { GIFCard } from './cards/gif/GIFCard';
import { ImageCard } from './cards/image/ImageCard';
import { MessageCard } from './cards/message/MessageCard';
import { TwitterCard } from './cards/twitter/TwitterCard';

import { Reactions } from './reactions/Reactions';
import { ReactionPicker } from './reactions/ReactionPicker';

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
  chatPayload,
  showChatMeta,
  children,
}: {
  chatPayload: IMessagePayload;
  showChatMeta: boolean;
  children: ReactNode;
}) => {
  const { user } = useChatData();
  const theme = useContext(ThemeContext);
  return (
    <MessageSection
      theme={theme}
      flexDirection="row"
      justifyContent="start"
      gap="6px"
      width="100%"
      maxWidth="100%"
    >
      {showChatMeta && pCAIP10ToWallet(chatPayload?.fromCAIP10) !== pCAIP10ToWallet(user?.account ?? '') && (
        <SenderMessageProfilePicture chat={chatPayload} />
      )}
      <Section
        justifyContent="start"
        flexDirection="column"
        maxWidth="100%"
        width="100%"
      >
        {showChatMeta && pCAIP10ToWallet(chatPayload?.fromCAIP10) !== pCAIP10ToWallet(user?.account ?? '') && (
          <SenderMessageAddress chat={chatPayload} />
        )}
        {children}
      </Section>
    </MessageSection>
  );
};

export const ChatViewBubble = ({
  decryptedMessagePayload,
  chatPayload,
  chatReactions,
  showChatMeta,
  chatId,
  actionId,
  singularActionId,
  setSingularActionId,
}: {
  decryptedMessagePayload: IMessagePayload;
  chatPayload?: IMessagePayload;
  chatReactions?: any;
  showChatMeta?: boolean;
  chatId?: string;
  actionId?: string | null | undefined;
  singularActionId?: string | null | undefined;
  setSingularActionId?: (singularActionId: string | null | undefined) => void;
}) => {
  // get theme
  const theme = useContext(ThemeContext);

  // TODO: Remove decryptedMessagePayload in v2 component
  if (!chatPayload) {
    chatPayload = decryptedMessagePayload;
  }

  if (!showChatMeta) {
    showChatMeta = false;
  }

  // setup reactions picker visibility
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [userSelectingReaction, setUserSelectingReaction] = useState(false);

  // get user
  const { user } = useChatData();

  // get chat position
  const chatPosition =
    pCAIP10ToWallet(chatPayload.fromDID).toLowerCase() !== pCAIP10ToWallet(user?.account ?? '')?.toLowerCase() ? 0 : 1;

  // derive message
  const message =
    typeof chatPayload.messageObj === 'object'
      ? (chatPayload.messageObj?.content as string) ?? ''
      : (chatPayload.messageObj as string);

  // check and render tweets
  const { tweetId, messageType }: TwitterFeedReturnType = checkTwitterUrl({
    message: message,
  });

  if (messageType === 'TwitterFeedLink') {
    chatPayload.messageType = 'TwitterFeedLink';
  }

  // test if the payload is encrypted, if so convert it to text
  if (isMessageEncrypted(message)) {
    chatPayload.messageType = 'Text';
  }

  // attach a ref to chat sidebar
  const chatSidebarRef = useRef<HTMLDivElement>(null);

  return (
    <MessageWrapper
      chatPayload={chatPayload}
      showChatMeta={showChatMeta}
    >
      {/* Chat Card + Reaction Container */}
      <ChatWrapperSection
        flexDirection={chatPosition ? 'row-reverse' : 'row'}
        alignSelf={chatPosition ? 'start' : 'end'}
        justifyContent="start"
        gap="10px"
        maxWidth="100%"
        width="100%"
        onMouseEnter={() => setShowReactionPicker(true)}
        onMouseLeave={() => setShowReactionPicker(false)}
      >
        <ChatBubbleSection
          margin="6px 0px 0px 0px"
          flexDirection="column"
        >
          {/* hide overflow for chat cards and border them */}
          <Section
            alignSelf={chatPosition ? 'flex-end' : 'flex-start'}
            borderRadius={
              chatPosition
                ? `${theme.borderRadius?.chatBubbleBorderRadius} 0px ${theme.borderRadius?.chatBubbleBorderRadius} ${theme.borderRadius?.chatBubbleBorderRadius}`
                : `0px ${theme.borderRadius?.chatBubbleBorderRadius} ${theme.borderRadius?.chatBubbleBorderRadius} ${theme.borderRadius?.chatBubbleBorderRadius}`
            }
            overflow="hidden"
          >
            {/* Message Card */}
            {chatPayload.messageType === 'Text' && (
              <MessageCard
                chat={chatPayload}
                position={chatPosition}
                account={user?.account ?? ''}
              />
            )}

            {/* Image Card */}
            {chatPayload.messageType === 'Image' && <ImageCard chat={chatPayload} />}

            {/* File Card */}
            {chatPayload.messageType === 'File' && <FileCard chat={chatPayload} />}

            {/* Gif Card */}
            {chatPayload.messageType === 'GIF' && <GIFCard chat={chatPayload} />}

            {/* Twitter Card */}
            {chatPayload.messageType === 'TwitterFeedLink' && (
              <TwitterCard
                tweetId={tweetId}
                chat={chatPayload}
              />
            )}

            {/* Default Message Card */}
            {chatPayload.messageType !== 'Text' &&
              chatPayload.messageType !== 'Image' &&
              chatPayload.messageType !== 'File' &&
              chatPayload.messageType !== 'GIF' &&
              chatPayload.messageType !== 'TwitterFeedLink' && (
                <MessageCard
                  chat={chatPayload}
                  position={chatPosition}
                  account={user?.account ?? ''}
                />
              )}
          </Section>

          {/* render if reactions are present */}
          {chatReactions && !!chatReactions.length && (
            <Section
              gap="4px"
              margin="-5px 0px 0px 0px"
              left="10px"
              justifyContent="flex-start"
            >
              <Reactions chatReactions={chatReactions} />
            </Section>
          )}
        </ChatBubbleSection>

        <ChatBubbleSidebarSection
          ref={chatSidebarRef}
          alignItems="flex-end"
          justifyContent={chatPosition ? 'flex-end' : 'flex-start'}
          margin={chatReactions && !!chatReactions.length ? '0px 0px 41px 0px' : '0px 0px 15px 0px'}
          width="auto"
          flex="1 0 auto"
          style={{
            visibility:
              showReactionPicker || (userSelectingReaction && actionId === singularActionId) ? 'visible' : 'hidden',
          }}
        >
          {/* Only render if user and user readmode is false}
          {/* For reaction - additional condition - only render if chatId is passed and setSelectedChatMsgId is passed */}
          {user && !user.readmode() && chatId && (
            <ReactionPicker
              chatId={chatId}
              chat={chatPayload}
              userSelectingReaction={userSelectingReaction && actionId === singularActionId}
              setUserSelectingReaction={setUserSelectingReaction}
              actionId={actionId}
              singularActionId={singularActionId}
              setSingularActionId={setSingularActionId}
              chatSidebarRef={chatSidebarRef}
            />
          )}
        </ChatBubbleSidebarSection>
      </ChatWrapperSection>
    </MessageWrapper>
  );
};

const MessageSection = styled(Section)``;

const ChatWrapperSection = styled(Section)``;

const ChatBubbleSection = styled(Section)`
  max-width: 70%;

  @media ${device.tablet} {
    max-width: 90%;
  }

  @media ${device.mobileL} {
    max-width: 90%;
  }
`;

const ChatBubbleSidebarSection = styled(Section)`
  width: auto;
  position: relative;
`;
