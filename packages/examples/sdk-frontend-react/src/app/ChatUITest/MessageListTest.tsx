import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import * as PUSHAPI from '@pushprotocol/restapi';
import { Link } from 'react-router-dom';
import { Section } from '../components/StyledComponents';
import { MessageList } from '@pushprotocol/uiweb';
import { EnvContext, Web3Context } from '../context';
import { usePushChatSocket } from '@pushprotocol/uiweb';
import { TypeBar } from '@pushprotocol/uiweb';

const MessageListTest = () => {
  const { account } = useContext<any>(Web3Context)

  const { env } = useContext<any>(EnvContext);
  const [ conversationHash , setConversationHash] = useState<string>('');

  const fetchConversationHash = async() =>{
    const ConversationHash = await PUSHAPI.chat.conversationHash({
      account: `eip155:${account}`,
      conversationId: '24b029b8e07e60291bf9d8c0c48ff993fa1e0a99105459f7404c425c92e91bac',
      env: env
  });
  setConversationHash(ConversationHash.threadHash);
  }
console.log(conversationHash)
 useEffect(()=>{
  fetchConversationHash();
 })

 usePushChatSocket();
  return (
    <div>
      <h2>Chat UI Test page</h2>

      {/* <Loader show={isLoading} /> */}

      <MessageListCard    >
        
      <MessageList conversationHash={conversationHash} limit={10}/>
   
      </MessageListCard>
      <TypeBar conversationId={'24b029b8e07e60291bf9d8c0c48ff993fa1e0a99105459f7404c425c92e91bac'} File={false} />
    </div>
  );
};

export default MessageListTest;


const MessageListCard = styled(Section)`
height:40vh;
`;