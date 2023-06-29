import type { IFeeds } from '@pushprotocol/restapi';
import {
  ChatMainStateContext,
  ChatAndNotificationPropsContext,
  ChatAndNotificationMainContext,
} from '../../../../../context';
import {
  checkIfUnread,
  dateToFromNowDaily,
  setData,
  shortenText,
} from '../../../../../helpers';
import React, { useContext } from 'react';
import styled, { css } from 'styled-components';
import { Section, Span, Image } from '../../../../reusables/sharedStyling';
import { UnreadChats } from '../../../MinimisedModalHeader';
import { pCAIP10ToWallet } from '../../../../../helpers';
import { ethers } from 'ethers';
import { useResolveWeb3Name } from '../../../../../hooks';
import { device } from '../../../../../config';
import type { ChatMainStateContextType } from '../../../../../context/chatAndNotification/chat/chatMainStateContext';

type ChatSnapPropType = {
  chat: IFeeds;
  id: string;
  modalOpen?: boolean;
};

//fix messageType type
const Message = ({
  messageContent,
  messageType,
}: {
  messageContent: string;
  messageType: string;
}) => {
  return messageType === 'Text' ? (
    <Span
      textAlign="left"
      fontWeight="400"
      fontSize="16px"
      color="#62626A"
      cursor="pointer"
    >
      {shortenText(messageContent, 28)}
    </Span>
  ) : messageType === 'Image' ? (
    <Span
      textAlign="left"
      fontWeight="400"
      fontSize="16px"
      color="#62626A"
      cursor="pointer"
    >
      <i className="fa fa-picture-o" aria-hidden="true"></i> Image
    </Span>
  ) : messageType === 'File' ? (
    <Span
      textAlign="left"
      fontWeight="400"
      fontSize="16px"
      color="#62626A"
      cursor="pointer"
    >
      <i className="fa fa-file" aria-hidden="true"></i> File
    </Span>
  ) : messageType === 'GIF' || messageType === 'MediaEmbed' ? (
    <Span
      textAlign="left"
      fontWeight="400"
      fontSize="16px"
      color="#62626A"
      cursor="pointer"
    >
      <i className="fa fa-picture-o" aria-hidden="true"></i> Media
    </Span>
  ) : null;
};

export const ChatSnap: React.FC<ChatSnapPropType> = ({
  chat,
  id,
  modalOpen,
}) => {
  const { setSelectedChatId, web3NameList } =
    useContext<ChatMainStateContextType>(ChatMainStateContext);
  const { env } = useContext<any>(ChatAndNotificationPropsContext);

  useResolveWeb3Name(chat?.did, env);
  //shift to helper
  const walletLowercase = pCAIP10ToWallet(chat?.did)?.toLowerCase();
  const checksumWallet = walletLowercase
    ? ethers.utils.getAddress(walletLowercase)
    : null;
  const web3Name = checksumWallet ? web3NameList[checksumWallet] : null;

  const handleOnClick = () => {
    setSelectedChatId(id);
    setData({ chatId: id, value: chat });
  };

  const open = modalOpen === undefined ? true : modalOpen;
  return (
    <Container
      justifyContent="space-between"
      padding={open ? '15px 15px' : ' 0px '}
      onClick={() => handleOnClick()}
      active={open}
    >
      <Section gap="18px" cursor="pointer">
        <Image
          src={chat.profilePicture!}
          alt="profile picture"
          width="36px"
          height="36px"
          borderRadius="100%"
          cursor="pointer"
        />
        <Section
          flexDirection="column"
          gap={open ? '8px' : ' 4px '}
          alignItems="start"
          cursor="pointer"
        >
          <NameSpan
            fontWeight="700"
            fontSize="16px"
            color="#000"
            cursor="pointer"
          >
            {chat?.name
              ? shortenText(chat?.name, 30, true)
              : web3Name ?? shortenText(chat?.did?.split(':')[1], 8, true)}
          </NameSpan>
          <Message
            messageContent={chat?.msg?.messageContent}
            messageType={chat?.msg?.messageType}
          />
        </Section>
      </Section>
      {open && (
        <Section
          flexDirection="column"
          alignItems="end"
          gap="12px"
          cursor="pointer"
          justifyContent="flex-start"
        >
          <Span
            fontWeight="400"
            fontSize="12px"
            color="#62626A"
            cursor="pointer"
          >
            {chat?.msg?.timestamp
              ? dateToFromNowDaily(chat?.msg?.timestamp as number)
              : ''}
          </Span>
          {checkIfUnread(id, chat) && (
            <UnreadChats
            //  numberOfUnreadMessages="3"
            />
          )}
        </Section>
      )}
    </Container>
  );
};

//styles
const Container = styled(Section)<{ active: boolean }>`
  border-bottom: ${(props) => props.active && '1px dashed #ededee'};
  cursor: ${(props) => props.active && 'pointer'};

  ${(props: any) =>
    props.active &&
    css`
      &:hover {
        background: #f4f5fa;
        border-radius: 10px;
      }
    `};
`;

const NameSpan = styled(Span)`
  @media ${device.mobileS} {
    font-size: 14px;
  }
`;
