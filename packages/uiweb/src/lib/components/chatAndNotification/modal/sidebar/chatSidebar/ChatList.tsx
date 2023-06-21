import type { ChatFeedsType } from '../../../../../types';
import React, { useContext } from 'react';
import { ChatSnap } from './ChatSnap';
import { ChatMainStateContext } from '../../../../../context';
import { ChatAndNotificationMainContext } from '../../../../../context/chatAndNotification';

type ChatListPropType = {
  chatsFeed: ChatFeedsType;
};

export const ChatList: React.FC<ChatListPropType> = ({ chatsFeed }) => {
  const { activeTab } = useContext<any>(ChatAndNotificationMainContext)

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

