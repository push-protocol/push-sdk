import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import * as PUSHAPI from '@pushprotocol/restapi';
import { Link } from 'react-router-dom';
import { Section } from '../components/StyledComponents';
import { ChatViewList } from '@pushprotocol/uiweb';
import { EnvContext, Web3Context } from '../context';
import { usePushChatSocket } from '@pushprotocol/uiweb';
import { MessageInput } from '@pushprotocol/uiweb';

const ChatViewListTest = () => {
  const { account, pgpPrivateKey } = useContext<any>(Web3Context)

  const { env } = useContext<any>(EnvContext);


  usePushChatSocket();
  return (
    <div>
      <h2>Chat UI Test page</h2>

      {/* <Loader show={isLoading} /> */}

      <ChatViewListCard    >
        <ChatViewList chatId='0xe19c4b204a76db09697ea54c9182eba2195542aD' limit={10} />

      </ChatViewListCard>
      <MessageInput chatId='0xe19c4b204a76db09697ea54c9182eba2195542aD' isConnected={true} />
    </div>
  );
};

export default ChatViewListTest;


const ChatViewListCard = styled(Section)`
height:40vh;
background:black;
`;