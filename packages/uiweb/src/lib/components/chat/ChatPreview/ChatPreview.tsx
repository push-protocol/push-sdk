import React, { useContext, useEffect, useRef, useState } from 'react';

import styled from 'styled-components';

import { useChatData } from '../../../hooks';
import { Button, Div, Image, Section } from '../../reusables';

import { CONSTANTS } from '@pushprotocol/restapi';
import { ethers } from 'ethers';
import { CiImageOn } from 'react-icons/ci';
import { FaFile } from 'react-icons/fa';
import { CoreContractChainId, InfuraAPIKey } from '../../../config';
import { pushBotAddress } from '../../../config/constants';
import { pCAIP10ToWallet, resolveWeb3Name, shortenText } from '../../../helpers';
import { createBlockie } from '../../../helpers/blockies';
import { IChatPreviewProps } from '../exportedTypes';
import { formatAddress, formatDate } from '../helpers';
import { IChatTheme } from '../theme';
import { ThemeContext } from '../theme/ThemeProvider';

import { ReplyIcon } from '../../../icons/PushIcons';

/**
 * @interface IThemeProps
 * this interface is used for defining the props for styled components
 */
interface IThemeProps {
  theme?: IChatTheme;
  blur?: boolean;
}

export const ChatPreview: React.FC<IChatPreviewProps> = (options: IChatPreviewProps) => {
  // get hooks
  const { user } = useChatData();

  const theme = useContext(ThemeContext);
  const [formattedAddress, setFormattedAddress] = useState<string>('');
  const [web3Name, setWeb3Name] = useState<string | null>(null);

  // to resolve the web3 name
  useEffect(() => {
    (async () => {
      const address = await formatAddress(options.chatPreviewPayload, user?.env || CONSTANTS.ENV.PROD);
      setFormattedAddress(address);
      if (!options.chatPreviewPayload?.chatGroup) {
        try {
          const result = await resolveWeb3Name(address, user?.env);
          if (result) setWeb3Name(result);
        } catch (e) {
          // console.debug(e);
        }
      }
    })();
  }, []);

  const hasBadgeCount = !!options?.badge?.count;
  const isSelected = options?.selected;
  const isBot =
    options?.chatPreviewPayload?.chatParticipant === 'PushBot' ||
    options?.chatPreviewPayload?.chatParticipant === pushBotAddress;

  // For blockie if icon is missing
  const blockieContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      blockieContainerRef.current &&
      !options.chatPreviewPayload?.chatPic &&
      options.chatPreviewPayload?.chatParticipant
    ) {
      const wallet = pCAIP10ToWallet(options.chatPreviewPayload?.chatParticipant ?? '');
      const blockie = createBlockie(wallet || '', { size: 8, scale: 6 });
      blockieContainerRef.current.innerHTML = ''; // Clear the container to avoid duplicating the canvas
      blockieContainerRef.current.appendChild(blockie);
    }
  }, [options.chatPreviewPayload?.chatParticipant]);

  const getProfileName = (formattedAddress: string) => {
    return options.chatPreviewPayload?.chatGroup ? formattedAddress : web3Name ? web3Name : formattedAddress;
  };

  // collate all message components
  const msgComponents: React.ReactNode[] = [];
  let includeText = false;

  // If reply, check message meta to see
  // Always check this first
  if (options?.chatPreviewPayload?.chatMsg?.messageMeta === 'Reply') {
    msgComponents.push(
      <ReplyIcon
        color={theme.iconColor?.emoji}
        size={theme.fontSize?.chatPreviewMessageText}
      />
    );

    // Include text in rendering as well
    includeText = true;
  }

  // If image, gif, mediaembed
  if (
    options?.chatPreviewPayload?.chatMsg?.messageType === 'Image' ||
    options?.chatPreviewPayload?.chatMsg?.messageType === 'GIF' ||
    options?.chatPreviewPayload?.chatMsg?.messageType === 'MediaEmbed'
  ) {
    msgComponents.push(<CiImageOn />);
    msgComponents.push(<Message theme={theme}>Media</Message>);
  }

  // If file
  if (options?.chatPreviewPayload?.chatMsg?.messageType === 'File') {
    msgComponents.push(<FaFile />);
    msgComponents.push(<Message theme={theme}>File</Message>);
  }

  // Add content
  if (
    includeText ||
    options?.chatPreviewPayload?.chatMsg?.messageType === 'Text' ||
    options?.chatPreviewPayload?.chatMsg?.messageType === 'Reaction'
  ) {
    msgComponents.push(<Message theme={theme}>{options?.chatPreviewPayload?.chatMsg?.messageContent}</Message>);
  }

  return (
    <ChatPreviewContainer
      margin={theme.margin?.chatPreviewMargin}
      cursor="pointer"
    >
      <Button
        display="flex"
        width="100%"
        height="70px"
        minHeight="70px"
        cursor="pointer"
        borderRadius={theme.borderRadius?.chatPreview}
        padding={theme.padding?.chatPreviewPadding}
        border={theme.border?.chatPreview}
        flexDirection="row"
        background={
          options.selected
            ? theme.backgroundColor?.chatPreviewSelectedBackground
            : theme.backgroundColor?.chatPreviewBackground
        }
        hoverBackground={theme.backgroundColor?.chatPreviewHoverBackground}
        onClick={() => {
          // set chatid as selected
          if (options?.setSelected)
            options.setSelected(
              options?.chatPreviewPayload?.chatId || '',
              options?.chatPreviewPayload?.chatParticipant
            );
        }}
      >
        <Section
          justifyContent="start"
          flexDirection="row"
          alignItems="center"
          alignSelf="center"
          borderRadius="50%"
          overflow="hidden"
          width="48px"
          height="48px"
          cursor="pointer"
        >
          {options.chatPreviewPayload?.chatPic ? (
            <Image
              src={options.chatPreviewPayload?.chatPic || undefined}
              height="48px"
              width="48px"
            />
          ) : (
            <Div
              ref={blockieContainerRef}
              height={'48px'}
              width={'48px'}
              borderRadius="50%"
              overflow="hidden"
            ></Div>
          )}
        </Section>
        <Section
          justifyContent="center"
          gap="6px"
          cursor="pointer"
          flexDirection="column"
          alignItems="center"
          alignSelf="stretch"
          overflow="hidden"
          margin="0 5px 0 10px"
          flex="1"
        >
          <Section
            flex="initial"
            justifyContent="flex-start"
            flexDirection="row"
            alignItems="flex-start"
            alignSelf="stretch"
            overflow="hidden"
            cursor="pointer"
          >
            <Account theme={theme}>{getProfileName(formattedAddress)}</Account>
            <Dated theme={theme}>{formatDate(options.chatPreviewPayload)}</Dated>
          </Section>
          <Section
            justifyContent="flex-start"
            flexDirection="row"
            alignItems="flex-start"
            alignSelf="stretch"
            overflow="hidden"
            flex="initial"
            cursor="pointer"
            className={options.readmode ? 'skeleton' : ''}
            animation={theme.skeletonBG}
          >
            <Message theme={theme}>
              <Section
                justifyContent="flex-start"
                flexDirection="row"
                alignItems="center"
                alignSelf="stretch"
                overflow="hidden"
                flex="1"
                gap="4px"
              >
                {msgComponents}
              </Section>
            </Message>

            {hasBadgeCount && !(isBot || (isSelected && hasBadgeCount)) && (
              <Badge theme={theme}>{options.badge?.count}</Badge>
            )}
          </Section>
        </Section>
      </Button>
    </ChatPreviewContainer>
  );
};

//styles
const ChatPreviewContainer = styled(Section)<IThemeProps>`
  &::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.scrollbarColor};
    border-radius: 10px;
  }

  &::-webkit-scrollbar {
    width: 5px;
  }
  ${({ blur }) =>
    blur &&
    `
  filter: blur(12px);
  `}
  overscroll-behavior: contain;
  scroll-behavior: smooth;
`;

// Styled component for the name of the person in the inbox
const Account = styled.div<IThemeProps>`
  font-weight: ${(props) => props.theme.fontWeight?.chatPreviewParticipantText};
  font-size: ${(props) => props.theme.fontSize?.chatPreviewParticipantText};
  color: ${(props) => props.theme.textColor?.chatPreviewParticipantText};
  flex: 1;
  align-self: stretch;
  text-align: start;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  margin-right: 10px;
`;

const Dated = styled.div<IThemeProps>`
  font-weight: ${(props) => props.theme.fontWeight?.chatPreviewDateText};
  font-size: ${(props) => props.theme.fontSize?.chatPreviewDateText};
  color: ${(props) => props.theme.textColor?.chatPreviewDateText};
`;

// Styled component for the last message in the inbox
const Message = styled.div<IThemeProps>`
  font-weight: ${(props) => props.theme.fontWeight?.chatPreviewMessageText};
  font-size: ${(props) => props.theme.fontSize?.chatPreviewMessageText};
  color: ${(props) => props.theme.textColor?.chatPreviewMessageText};
  flex: 1;
  align-self: stretch;
  text-align: start;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  margin-right: 10px;
`;

const Badge = styled.div<IThemeProps>`
  background: ${(props) => props.theme.backgroundColor?.chatPreviewBadgeBackground};
  font-weight: ${(props) => props.theme.fontWeight?.chatPreviewBadgeText};
  font-size: ${(props) => props.theme.fontSize?.chatPreviewBadgeText};
  color: ${(props) => props.theme.textColor?.chatPreviewBadgeText};
  padding: 0px 8px;
  text-overflow: ellipsis;
  border-radius: 24px;
  align-self: center;
`;
