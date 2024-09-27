import { ReactNode, useContext, useEffect, useRef, useState } from 'react';

import moment from 'moment';
import { MdDownload } from 'react-icons/md';
import { TwitterTweetEmbed } from 'react-twitter-embed';
import styled from 'styled-components';

import { ChatDataContext } from '../../../context';
import { useChatData } from '../../../hooks';
import { ReplyIcon } from '../../../icons/PushIcons';
import { Div, Image, Section, Span } from '../../reusables';
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
  isMessageEncrypted,
  pCAIP10ToWallet,
  shortenText,
  sign,
  toSerialisedHexString,
} from '../../../helpers';
import { createBlockie } from '../../../helpers/blockies';
import { FileMessageContent, FrameDetails, IFrame, IFrameButton, IReactionsForChatMessages } from '../../../types';
import { extractWebLink, getFormattedMetadata, hasWebLink } from '../../../utilities';
import { IMessagePayload, TwitterFeedReturnType } from '../exportedTypes';
import { Button, TextInput } from '../reusables';

import { Button as RButton } from '../../reusables';

import { ChatViewBubbleCore } from '../ChatViewBubbleCore';

import { ReactionPicker } from './reactions/ReactionPicker';
import { Reactions } from './reactions/Reactions';

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
  chatPayload: payload,
  chatReactions,
  setReplyPayload,
  showChatMeta = false,
  chatId,
  actionId,
  singularActionId,
  setSingularActionId,
}: {
  decryptedMessagePayload: IMessagePayload;
  chatPayload?: IMessagePayload;
  chatReactions?: any;
  setReplyPayload?: (payload: IMessagePayload) => void;
  showChatMeta?: boolean;
  chatId?: string;
  actionId?: string | null | undefined;
  singularActionId?: string | null | undefined;
  setSingularActionId?: (singularActionId: string | null | undefined) => void;
}) => {
  // get theme
  const theme = useContext(ThemeContext);

  // TODO: Remove decryptedMessagePayload in v2 component
  const chatPayload = payload ?? decryptedMessagePayload;

  // setup reactions picker visibility
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [userSelectingReaction, setUserSelectingReaction] = useState(false);

  // get user
  const { user } = useChatData();

  // get chat position
  const chatPosition =
    pCAIP10ToWallet(chatPayload.fromDID).toLowerCase() !== pCAIP10ToWallet(user?.account ?? '')?.toLowerCase() ? 0 : 1;

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
          alignSelf="flex-start"
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
            <ChatViewBubbleCore
              chat={chatPayload}
              chatId={chatId}
            />
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
          flexDirection="column"
          alignItems={chatPosition ? 'flex-end' : 'flex-start'}
          justifyContent="flex-end"
          margin={chatReactions && !!chatReactions.length ? '0px 0px 41px 0px' : '0px 0px 15px 0px'}
          gap="2px"
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
            <>
              {/* Reply Icon */}
              <RButton
                borderRadius={theme.borderRadius?.reactionsPickerBorderRadius}
                background="transparent"
                hoverBackground={theme.backgroundColor?.chatReceivedBubbleBackground}
                padding={theme.padding?.reactionsPickerPadding}
                border={theme.border?.reactionsBorder}
                hoverBorder={theme.border?.reactionsHoverBorder}
                onClick={(e) => {
                  e.stopPropagation();
                  setReplyPayload?.(chatPayload);
                }}
              >
                <ReplyIcon
                  color={theme.iconColor?.emoji}
                  size={20}
                />
              </RButton>

              {/* Reaction Picker */}
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
            </>
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
