import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import * as PUSHAPI from '@pushprotocol/restapi';
import { Link } from 'react-router-dom';
import { Section } from '../components/StyledComponents';
import { MessageList } from '@pushprotocol/uiweb';
import { EnvContext, Web3Context } from '../context';
import { usePushChatSocket } from '@pushprotocol/uiweb';

const MessageListTest = () => {
  const { account } = useContext<any>(Web3Context)

  const { env } = useContext<any>(EnvContext);
  const [ conversationHash , setConversationHash] = useState<string>('');

  const fetchConversationHash = async() =>{
    const ConversationHash = await PUSHAPI.chat.conversationHash({
      account: `eip155:${account}`,
      conversationId: 'eip155:0xEDF59F183584107B20e2c95189A4423224bba8F2',
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
    </div>
  );
};

export default MessageListTest;


const MessageListCard = styled(Section)`
height:40vh;
`;