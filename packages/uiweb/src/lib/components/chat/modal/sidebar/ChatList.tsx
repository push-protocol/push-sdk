import { IFeeds } from '@pushprotocol/restapi';
import { ChatFeedsType } from '../../../../types';
import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import { ChatSnap } from './ChatSnap';
import { Section } from '../../../reusables/sharedStyling';

type ChatListPropType = {
    chatsFeed: ChatFeedsType;
  };

//Resolve ud name and  pfp
export const ChatList: React.FC<ChatListPropType> = ({chatsFeed}) => {
  return (
    <Section flexDirection="column" maxHeight='460px' margin='25px 0 15px 0' overflow='hidden auto'>
      {!!Object.keys(chatsFeed || {}).length &&
        Object.keys(chatsFeed).map((id: string) => (
          <ChatSnap chat={chatsFeed[id]} id={id} />
        ))}
    </Section>
  );
};

//styles

const Image = styled.img``;

//scrollbar design left

