import type { ChatFeedsType } from '../../../../../types';
import React, { useContext } from 'react';
import { ChatSnap } from './ChatSnap';
import { ChatAndNotificationMainContext } from '../../../../../context';
import type { ChatAndNotificationMainContextType } from '../../../../../context/chatAndNotification/chatAndNotificationMainContext';

type ChatListPropType = {
  chatsFeed: ChatFeedsType;
};

export const ChatList: React.FC<ChatListPropType> = ({ chatsFeed }) => {
  const { activeTab } = useContext<ChatAndNotificationMainContextType>(ChatAndNotificationMainContext)

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

