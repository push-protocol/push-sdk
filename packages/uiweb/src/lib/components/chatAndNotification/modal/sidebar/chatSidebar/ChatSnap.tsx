import type { IFeeds } from '@pushprotocol/restapi';
import { ChatMainStateContext, ChatAndNotificationPropsContext } from '../../../../../context';
import { checkIfUnread, dateToFromNowDaily, setData, shortenText } from '../../../../../helpers';
import React, { useContext } from 'react';
import styled, { css } from 'styled-components';
import { Section, Span, Image } from '../../../../reusables/sharedStyling';
import { UnreadChats } from '../../../MinimisedModalHeader';
import { device } from '../../../../../config';
import type { ChatMainStateContextType } from '../../../../../context/chatAndNotification/chat/chatMainStateContext';
import { useDeviceWidthCheck, useDomianName } from '../../../../../hooks';

type ChatSnapPropType = {
  chat: IFeeds;
  id: string;
  modalOpen?: boolean;
};

//fix messageType type
const Message = ({ messageContent, messageType }: { messageContent: string; messageType: string }) => {
  const isMobile = useDeviceWidthCheck(425);
  const digitsToDisplay = isMobile ? 27 : 48;
  return messageType === 'Text' ? (
    <Span
      textAlign="left"
      fontWeight="400"
      fontSize="16px"
      color="#62626A"
      cursor="pointer"
    >
      {shortenText(messageContent, digitsToDisplay)}
    </Span>
  ) : messageType === 'Image' ? (
    <Span
      textAlign="left"
      fontWeight="400"
      fontSize="16px"
      color="#62626A"
      cursor="pointer"
    >
      <i
        className="fa fa-picture-o"
        aria-hidden="true"
      ></i>{' '}
      Image
    </Span>
  ) : messageType === 'File' ? (
    <Span
      textAlign="left"
      fontWeight="400"
      fontSize="16px"
      color="#62626A"
      cursor="pointer"
    >
      <i
        className="fa fa-file"
        aria-hidden="true"
      ></i>{' '}
      File
    </Span>
  ) : messageType === 'GIF' || messageType === 'MediaEmbed' ? (
    <Span
      textAlign="left"
      fontWeight="400"
      fontSize="16px"
      color="#62626A"
      cursor="pointer"
    >
      <i
        className="fa fa-picture-o"
        aria-hidden="true"
      ></i>{' '}
      Media
    </Span>
  ) : null;
};

export const ChatSnap: React.FC<ChatSnapPropType> = ({ chat, id, modalOpen }) => {
  const { setSelectedChatId } = useContext<ChatMainStateContextType>(ChatMainStateContext);
  const { env } = useContext<any>(ChatAndNotificationPropsContext);
  const web3Name = useDomianName(chat?.did, env);
  const isMobile = useDeviceWidthCheck(425);
  const digitsToDisplay = chat?.name ? (isMobile ? 15 : 30) : isMobile ? 6 : 8;

  const handleOnClick = () => {
    setSelectedChatId(id);
    setData({ chatId: id, value: chat });
  };
  const open = modalOpen === undefined ? true : modalOpen;

  return (
    <Container
      justifyContent="flex-start"
      padding={open ? '15px 15px' : ' 0px '}
      onClick={() => handleOnClick()}
      active={open}
      gap="18px"
      cursor="pointer"
    >
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
        flex="2"
      >
        <Section
          gap={open ? '8px' : ' 2px '}
          justifyContent="space-between"
          cursor="pointer"
        >
          <NameSpan
            fontWeight="700"
            color="#000"
            cursor="pointer"
          >
            {chat?.name
              ? shortenText(chat?.name, digitsToDisplay, false)
              : web3Name ?? shortenText(chat?.did?.split(':')[1], digitsToDisplay, true)}
          </NameSpan>
          {open && (
            <Span
              fontWeight="400"
              fontSize="12px"
              color="#62626A"
              cursor="pointer"
            >
              {chat?.msg?.timestamp ? dateToFromNowDaily(chat?.msg?.timestamp as number) : ''}
            </Span>
          )}
        </Section>

        <Section
          gap="12px"
          cursor="pointer"
          justifyContent="space-between"
        >
          <Message
            messageContent={chat?.msg?.messageContent}
            messageType={chat?.msg?.messageType}
          />

          {open && checkIfUnread(id, chat) && (
            <UnreadChats
            //  numberOfUnreadMessages="3"
            />
          )}
        </Section>
      </Section>
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
  font-size: 16px;
  @media ${device.mobileL} {
    font-size: 14px;
  }
`;
