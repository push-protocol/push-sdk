import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import { ChatMainStateContext } from '../../../context';
import { PUSH_SUB_TABS } from '../../../types';
import { Section } from '../../reusables/sharedStyling';
import { MessageBox } from './messageBox/MessageBox';
import { RequestsFeedList } from './sidebar/RequestsFeedList';
import { Search } from './sidebar/Search';
import { Sidebar } from './sidebar/Sidebar';

//show new message conponent left
export const Modal = () => {
  const { selectedChatId, activeSubTab } =
    useContext<any>(ChatMainStateContext);
  console.log(selectedChatId);
  return (
    <Section height="550px" width="100%" maxHeight='550px' overflow='hidden'>
      {!selectedChatId && !activeSubTab && <Sidebar />}
      {!selectedChatId && activeSubTab === PUSH_SUB_TABS.REQUESTS && (
        <RequestsFeedList />
      )}

      {selectedChatId && <MessageBox />}
    </Section>
  );
};

//styles
