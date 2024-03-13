import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import * as PUSHAPI from '@pushprotocol/restapi';
import { Link } from 'react-router-dom';
import { Section } from '../components/StyledComponents';
import {  ChatViewList } from '@pushprotocol/uiweb';
import { EnvContext, Web3Context } from '../context';
import { usePushChatSocket } from '@pushprotocol/uiweb';
import { MessageInput } from '@pushprotocol/uiweb';


const ChatViewListTest = () => {
  // const { account, pgpPrivateKey } = useContext<any>(Web3Context)

  // const { env } = useContext<any>(EnvContext);


  // usePushChatSocket();
  
 
  return (
    <div>
      <h2>Chat UI Test page</h2>

      {/* <Loader show={isLoading} /> */}
  
      <ChatViewListCard>
        <ChatViewList chatId='dbfa8154643374d2e49aef4d696069cb2a9c3bc1f89b333d7e8feda7313ae998' limit={10} />

      </ChatViewListCard>
      {/* <MessageInput chatId='196f58cbe07c7eb5716d939e0a3be1f15b22b2334d5179c601566600016860ac' isConnected={true} /> */}
    </div>
  );
};

export default ChatViewListTest;


const ChatViewListCard = styled.div`
height:40vh;
background:black;
overflow: auto;
overflow-x: hidden;
`;