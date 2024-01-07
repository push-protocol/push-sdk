import React, { useContext, useEffect, useRef, useState } from 'react';

import moment from 'moment';
import styled from 'styled-components';

import { Button, Image, Section, Span, Spinner } from '../../reusables';
import { useResolveWeb3Name } from '../../hooks';

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

  // Format address
  const formatAddress = () => {
    let formattedAddress = options.chatPreviewPayload?.chatSender;

    if (!options.chatPreviewPayload?.chatGroup) {
      // check and remove eip155:
      if (formattedAddress.includes('eip155:')) {
        formattedAddress = formattedAddress.replace('eip155:', '');
      }
    }
    
    return formattedAddress;
  }

  // Format date
  const formatDate = () => {
    let formattedDate;
    const today = moment();
    const timestamp = moment(options.chatPreviewPayload.chatTimestamp);

    if (timestamp.isSame(today, 'day')) {
      // If the timestamp is from today, show the time
      formattedDate = timestamp.format('HH:mm');
    } else if (timestamp.isSame(today.subtract(1, 'day'), 'day')) {
      // If the timestamp is from yesterday, show 'Yesterday'
      formattedDate = 'Yesterday';
    } else {
      // If the timestamp is from before yesterday, show the date
      // Use 'L' to format the date based on the locale
      formattedDate = timestamp.format('L');
    }

    return formattedDate;
  };

  return (
    <ChatViewListCard>
      <Button
        display="flex"
        width="100%"
        height="70px"
        minHeight="70px"
        margin="5px 5px"
        padding="5px 5px"
        borderRadius="24px"
        flexDirection="row"
        background={options.selected ? '#f5f5f5' : '#fff'}
        onClick={() => {
          // set chatid as selected
          options.setSelected(options.chatPreviewPayload?.chatId);
        }}
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
          flexDirection="column"
          alignItems="center" 
          alignSelf="stretch"
          overflow='hidden'
          margin='0 5px'
          flex='1'
        >
          <Section
            justifyContent="flex-start"
            flexDirection="row"
            alignItems="flex-start" 
            alignSelf="stretch"
            overflow='hidden'
            flex='1'
          >
            <Account>
              {formatAddress()}
            </Account>
            <Dated>{formatDate()}</Dated>
          </Section>
          <Section
            justifyContent="flex-start"
            flexDirection="row"
            alignItems="flex-start" 
            alignSelf="stretch"
            overflow='hidden'
            flex='1'
          >
            <Message>
              {options.chatPreviewPayload.chatMsg.messageContent}
            </Message>
            {!!options.badge.count && 
              <Badge>
                {options.badge.count}
              </Badge>
            }
          </Section>
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
const Account = styled.div`
  font-weight: bold;
  font-size: 16px;
  flex: 1;
  align-self: stretch;
  text-align: start;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  margin-right: 10px;
`;

const Dated = styled.div`
  color: #888;
  font-size: 12px;
`;

// Styled component for the last message in the inbox
const Message = styled.div`
  color: #888;
  font-size: 14px;
  flex: 1;
  align-self: stretch;
  text-align: start;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  margin-right: 10px;
`;

const Badge = styled.div`
  background: rgb(226,8,128);
  color: #fff;
  padding: 0px 8px;
  min-height: 24px;
  border-radius: 24px;
  align-self: center;
  font-size: 12px;
  font-weight: bold;
`
