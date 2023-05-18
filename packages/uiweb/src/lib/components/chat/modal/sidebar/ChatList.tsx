import { IFeeds } from '@pushprotocol/restapi';
import { ChatFeedsType, PUSH_TABS } from '../../../../types';
import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import { ChatSnap } from './ChatSnap';
import { Section } from '../../../reusables/sharedStyling';
import { ChatMainStateContext } from '../../../../context';

type ChatListPropType = {
  chatsFeed: ChatFeedsType;
};


export const ChatList: React.FC<ChatListPropType> = ({ chatsFeed }) => {
  const { activeTab } =
  useContext<any>(ChatMainStateContext);
  const [page, setPage] = useState<number>(1);
 
  
  console.log(page)
  return (
    <ChatListCard
      flexDirection="column"
      height="100%"
      margin="15px 0 25px 0"
      justifyContent="start"
      overflow="hidden auto"
    >
      {!!Object.keys(chatsFeed || {}).length &&
        Object.keys(chatsFeed).map((id: string) => (
          <ChatSnap chat={chatsFeed[id]} id={id} />
        ))}
    </ChatListCard>
  );
};

//styles

const ChatListCard = styled(Section)`
  &::-webkit-scrollbar-thumb {
    background: rgb(181 181 186);
    border-radius: 10px;
  }

  &::-webkit-scrollbar {
    width: 5px;
  }
`;
