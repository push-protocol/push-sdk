import type {
  ParsedResponseType,
  IFeeds,
  IMessageIPFS,
  IUser,
} from '@pushprotocol/restapi';
import React, { createContext, useContext, useState } from 'react';
import { getData } from '../../../helpers/chat/localStorage';
import type {
  ChatFeedsType,
  NotificationFeedsType,
  PushSubTabs,
  PushTabs,
  Web3NameListType,
} from '../../../types';
import { PUSH_SUB_TABS, PUSH_TABS } from '../../../types';

export type NotificationMainStateContextType = {
  inboxNotifsFeed: NotificationFeedsType;
  setInboxNotifsFeed: (inboxNotifsFeed: NotificationFeedsType) => void;
  setInboxNotifFeed: (
    id: string,
    newInboxNotifFeed: ParsedResponseType
  ) => void;
  spamNotifsFeed: NotificationFeedsType;
  setSpamNotifsFeed: (spamNotifsFeed: NotificationFeedsType) => void;
  setSpamNotifFeed: (id: string, newSpamNotifFeed: ParsedResponseType) => void;
  searchedNotifications: NotificationFeedsType | null;
  setSearchedNotifications: (chats: NotificationFeedsType | null) => void;
};

export const NotificationMainStateContext =
  createContext<NotificationMainStateContextType>(
    {} as NotificationMainStateContextType
  );

const NotificationMainStateContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [inboxNotifsFeed, setInboxNotifsFeed] = useState<NotificationFeedsType>(
    {} as NotificationFeedsType
  );
  const [spamNotifsFeed, setSpamNotifsFeed] = useState<NotificationFeedsType>(
    {} as NotificationFeedsType
  );
  const [searchedNotifications, setSearchedNotifications] =
    useState<NotificationFeedsType | null>(null);

  const setInboxNotifFeed = (
    id: string,
    newInboxNotifFeed: ParsedResponseType
  ) => {
    setInboxNotifsFeed((prevInboxNotifFeed: NotificationFeedsType) => ({
      [id]: newInboxNotifFeed,
      ...prevInboxNotifFeed,
    }));
  };
  const setSpamNotifFeed = (
    id: string,
    newSpamNotifFeed: ParsedResponseType
  ) => {
    setSpamNotifsFeed((prevSpamNotifFeed: NotificationFeedsType) => ({
      [id]: newSpamNotifFeed,
      ...prevSpamNotifFeed,
    }));
  };

  return (
    <NotificationMainStateContext.Provider
      value={{
        inboxNotifsFeed,
        setInboxNotifFeed,
        setInboxNotifsFeed,
        spamNotifsFeed,
        setSpamNotifFeed,
        setSpamNotifsFeed,
        searchedNotifications,
        setSearchedNotifications,
      }}
    >
      {children}
    </NotificationMainStateContext.Provider>
  );
};

export default NotificationMainStateContextProvider;
