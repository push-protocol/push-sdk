import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import { ChatMainStateContext } from '../../../context';
import { PUSH_SUB_TABS } from '../../../types';
import { Section } from '../../reusables/sharedStyling';
import { Spinner } from '../../reusables/Spinner';
import { MessageBox } from './messageBox/MessageBox';
import { RequestsFeedList } from './sidebar/RequestsFeedList';
import { Sidebar } from './sidebar/Sidebar';

export const Modal = () => {
  const { selectedChatId, activeSubTab, chatsFeed, requestsFeed } =
    useContext<any>(ChatMainStateContext);


  return (
    <Section height="550px" width="100%" maxHeight="550px" overflow="hidden">
      {!selectedChatId && !activeSubTab && <Sidebar />}
      {!selectedChatId && activeSubTab === PUSH_SUB_TABS.REQUESTS && (
        <RequestsFeedList />
      )}


      {selectedChatId &&
      ((Object.keys(chatsFeed || {}).length ||
        Object.keys(requestsFeed || {}).length )? 
        <MessageBox />
       : (
        <Spinner />
      ))}
    </Section>
  );
};

//styles
