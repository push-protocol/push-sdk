import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import { ChatMainStateContext } from '../../../context';
import { PUSH_SUB_TABS } from '../../../types';
import { Section } from '../../reusables/sharedStyling';
import { Spinner } from '../../reusables/Spinner';
import { MessageBox } from './messageBox/MessageBox';
import { RequestsFeedList } from './sidebar/chatSidebar/RequestsFeedList';
import { SpamNotificationFeedList } from './sidebar/notificationSidebar/SpamNotificationFeedList';
import { Sidebar } from './sidebar/Sidebar';
import { MainContext } from '../../../context/chatAndNotification/chatAndNotificationMainContext';

export const Modal = () => {

  const { activeSubTab } = useContext<any>(MainContext)
  const { selectedChatId, chatsFeed, requestsFeed, searchedChats } = useContext<any>(ChatMainStateContext);

  
  return (
    <Section height="550px" width="100%" maxHeight="550px" overflow="hidden">
      {!selectedChatId && !activeSubTab && <Sidebar />}
      {!selectedChatId && activeSubTab === PUSH_SUB_TABS.REQUESTS && (
        <RequestsFeedList />
      )}
      {activeSubTab === PUSH_SUB_TABS.SPAM && (
        <SpamNotificationFeedList />
      )}

      {selectedChatId &&
        ((Object.keys(chatsFeed || {}).length ||
          Object.keys(requestsFeed || {}).length || Object.keys(searchedChats || {}).length) ? (
          <MessageBox />
        ) : (
          <Spinner />
        ))}
    </Section>
  );
};

//styles
