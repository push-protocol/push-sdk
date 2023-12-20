import React, { useContext, useEffect, useRef, useState } from 'react';

import {
  IFeeds,
  IMessageIPFS,
  IMessageIPFSWithCID,
} from '@pushprotocol/restapi';
import moment from 'moment';
import styled from 'styled-components';

import { Item, chatLimit } from '../../../config';
import {
  appendUniqueMessages,
  checkIfIntent,
  checkIfSameChat,
  dateToFromNowDaily,
  getDefaultFeedObject,
  getNewChatUser,
  pCAIP10ToWallet,
  walletToPCAIP10,
} from '../../../helpers';
import { useChatData, usePushChatSocket } from '../../../hooks';
import useFetchHistoryMessages from '../../../hooks/chat/useFetchHistoryMessages';
import { Messagetype } from '../../../types';
import { Button, Image, Section, Span, Spinner } from '../../reusables';
import { IChatPreviewProps } from '../exportedTypes';
import { IChatTheme } from '../theme';
import { ThemeContext } from '../theme/ThemeProvider';

/**
 * @interface IThemeProps
 * this interface is used for defining the props for styled components
 */
interface IThemeProps {
  theme?: IChatTheme;
  blur: boolean;
}

export const ChatPreview: React.FC<IChatPreviewProps> = (
  options: IChatPreviewProps
) => {


  const checkInput = (name: string) => {
    if (name.startsWith("eip155:")) {
      const resultString = name.substring(7);
      console.log(resultString);
      return resultString
    } else {
      console.log(name);
      return name;
    }
  }
  console.log(options.chatPreviewPayload?.chatSender)
  return (
    <ChatViewListCard>
      <Button
        display="flex"
        width="100%"
        height="70px"
        minHeight="70px"
        flexDirection="row"
        
      >
        <Section
          justifyContent="start"
          flexDirection="row"
          alignItems="center" 
          alignSelf="center"
          borderRadius='50%'
          overflow='hidden'
          width='48px'
          height='48px'
        >
          <Image
            src={options.chatPreviewPayload?.chatPic}
            height="48px"
            width="48px"
          />
        </Section>
        <Section
          justifyContent="flex-start"
          flexDirection="col"
          alignItems="center" 
          alignSelf="stretch"
          overflow='hidden'
         
        >
          <InboxContentContainer>
          <InboxName>
           { options.chatPreviewPayload && 
            checkInput(options.chatPreviewPayload?.chatSender)}
            </InboxName>
            <LastMessage>
            {options.chatPreviewPayload && 
            (options.chatPreviewPayload.chatMsg.messageContent).slice(0, 25) + '...'
          }
          </LastMessage>
          {/* <DateText>{options.chatPreviewPayload && options.chatPreviewPayload.chatTimestamp}</DateText> */}
          </InboxContentContainer>
          
        </Section>
        
      </Button>
      </ChatViewListCard>
  );
};

//styles
const ChatViewListCard = styled(Section)<IThemeProps>`
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

const InboxContentContainer = styled.div`
  flex: 1;
`;

// Styled component for the name of the person in the inbox
const InboxName = styled.div`
  font-weight: bold;
  font-size: 16px;
`;

// const DateText = styled.div`
//   color: #888;
//   font-size: 12px;
//   position: absolute;
//   top:0;
//   right: 0;
// `;
// Styled component for the last message in the inbox
const LastMessage = styled.div`
  color: #888;
  font-size: 14px;
`;
