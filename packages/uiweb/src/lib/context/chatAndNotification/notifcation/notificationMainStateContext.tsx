import React, { createContext, useContext, useState } from 'react';
import type {
  NotificationFeedsType,
  ParsedNotificationType,
} from '../../../types';

export type NotificationMainStateContextType = {
  inboxNotifsFeed: NotificationFeedsType;
  allInboxNotifFeed: NotificationFeedsType;
  setAllInboxNotifsFeed: (allInboxNotifsFeed: NotificationFeedsType) => void;
  setInboxNotifsFeed: (inboxNotifsFeed: NotificationFeedsType) => void;
  setInboxNotifFeed: (
    id: string,
    newInboxNotifFeed: ParsedNotificationType
  ) => void;
  spamNotifsFeed: NotificationFeedsType;
  setSpamNotifsFeed: (spamNotifsFeed: NotificationFeedsType) => void;
  setSpamNotifFeed: (
    id: string,
    newSpamNotifFeed: ParsedNotificationType
  ) => void;
  searchedNotifications: NotificationFeedsType | null;
  setSearchedNotifications: (chats: NotificationFeedsType | null) => void;
  subscriptionStatus: Map<string, boolean>;
  setSubscriptionStatus: (subscriptionStatus: Map<string, boolean>) => void;
  setChannelSubscriptionStatus: (id: string, status: boolean) => void;
  finishedFetchingInbox:boolean;
  finishedFetchingSpam:boolean;
  setFinishedFetchingInbox: (flag: boolean) => void;
  setFinishedFetchingSpam: (flag: boolean) => void;
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
  const [allInboxNotifFeed, setAllInboxNotifsFeed] =
    useState<NotificationFeedsType>({} as NotificationFeedsType);
  const [spamNotifsFeed, setSpamNotifsFeed] = useState<NotificationFeedsType>(
    {} as NotificationFeedsType
  );
  const [subscriptionStatus, setSubscriptionStatus] = useState<Map<string, boolean>>(new Map());
  const [searchedNotifications, setSearchedNotifications] =
    useState<NotificationFeedsType | null>(null);
    const [finishedFetchingInbox,setFinishedFetchingInbox] = useState<boolean>(false);
    const [finishedFetchingSpam,setFinishedFetchingSpam] = useState<boolean>(false);

  const setInboxNotifFeed = (
    id: string,
    newInboxNotifFeed: ParsedNotificationType
  ) => {
    setInboxNotifsFeed((prevInboxNotifFeed: NotificationFeedsType) => ({
      [id]: newInboxNotifFeed,
      ...prevInboxNotifFeed,
    }));
  };
  const setSpamNotifFeed = (
    id: string,
    newSpamNotifFeed: ParsedNotificationType
  ) => {
    setSpamNotifsFeed((prevSpamNotifFeed: NotificationFeedsType) => ({
      [id]: newSpamNotifFeed,
      ...prevSpamNotifFeed,
    }));
  };

  const setChannelSubscriptionStatus = (id: string, status: boolean) => {
    const tempSubscriptionStatus = new Map(subscriptionStatus);
    tempSubscriptionStatus.set(id, status);
    setSubscriptionStatus(tempSubscriptionStatus);
  };

  return (
    <NotificationMainStateContext.Provider
      value={{
        inboxNotifsFeed,
        setInboxNotifFeed,
        setInboxNotifsFeed,
        spamNotifsFeed,
        allInboxNotifFeed,
        setAllInboxNotifsFeed,
        setSpamNotifFeed,
        setSpamNotifsFeed,
        searchedNotifications,
        setSearchedNotifications,
        subscriptionStatus,
        setChannelSubscriptionStatus,
        setSubscriptionStatus,
        finishedFetchingInbox,
        finishedFetchingSpam,
        setFinishedFetchingInbox,
        setFinishedFetchingSpam
      }}
    >
      {children}
    </NotificationMainStateContext.Provider>
  );
};

export default NotificationMainStateContextProvider;
