
import React, { useContext} from 'react';
import styled from 'styled-components';
import { ChatList } from './ChatList';
import { Search } from './Search';
import { PUSH_TABS } from '../../../../types';
import { ChatMainStateContext } from '../../../../context';
import useFetchChats from '../../../../hooks/chat/useFetchChats';
import { Spinner } from '../../../reusables/Spinner';
import { Section, Span } from '../../../reusables/sharedStyling';



export const Sidebar = () => {
    const {loading:chatsLoading} = useFetchChats();
    const { chatsFeed,activeTab,requestsFeed,searchedChats } = useContext<any>(ChatMainStateContext);

  return (
    <Container margin='28px 0 0 0' flexDirection='column' width='100%'  justifyContent='start'>
    <Search chatsFeed={activeTab === PUSH_TABS.CHATS?chatsFeed:requestsFeed}/>

    {!chatsLoading  && !searchedChats && <ChatList chatsFeed={activeTab === PUSH_TABS.CHATS?chatsFeed:requestsFeed}/>}
    {searchedChats && !!Object.keys(searchedChats).length && <ChatList chatsFeed={searchedChats}/>}
    { searchedChats&&!Object.keys(searchedChats).length && <Span>No user found</Span>}


{/* Spinner not working */}
   {chatsLoading && <Spinner/>}
    </Container>
  );
};

//styles
const Container = styled(Section)`
`;





