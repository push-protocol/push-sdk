import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import { ChatMainStateContext } from '../../../context';
import { Section } from '../../reusables/sharedStyling';
import { MessageBox } from './messageBox/MessageBox';
import { Search } from './sidebar/Search';
import { Sidebar } from './sidebar/Sidebar';

//show new message conponent left
export const Modal = () => {
  const { selectedChatId } = useContext<any>(ChatMainStateContext);
  console.log(selectedChatId);
  return (
    <Section
     height="550px"
     width="100%">
      {!selectedChatId && <Sidebar />}
      {selectedChatId && <MessageBox />}
    </Section>
  );
};

//styles
