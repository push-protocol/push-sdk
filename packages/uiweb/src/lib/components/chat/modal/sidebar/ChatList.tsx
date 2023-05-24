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
  const { activeTab } = useContext<any>(ChatMainStateContext);

  return (
    <>
      {!!Object.keys(chatsFeed || {}).length &&
        Object.keys(chatsFeed).map((id: string) => (
          <ChatSnap chat={chatsFeed[id]} id={id} />
        ))}
    </>
  );
};

//styles

