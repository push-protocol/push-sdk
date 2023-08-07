import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import * as PUSHAPI from '@pushprotocol/restapi';
import { Link } from 'react-router-dom';
import { Section } from '../components/StyledComponents';
import { MessageList } from '@pushprotocol/uiweb';
import { EnvContext } from '../context';

const MessageListTest = () => {
  const { env } = useContext<any>(EnvContext);
  const [ conversationHash , setConversationHash] = useState<string>();

  const fetchConversationHash = async() =>{
    const ConversationHash = await PUSHAPI.chat.conversationHash({
      account: 'eip155:0x0bc5DcB04B71E99CC73CAE772D8aec89E641f983',
      conversationId: 'eip155:0xCD0DAdAb45bAF9a06ce1279D1342EcC3F44845af',
      env: env
  });
  setConversationHash(ConversationHash.threadHash);
  }
console.log(conversationHash)
 useEffect(()=>{
  fetchConversationHash();
 })

  return (
    <div>
      <h2>Chat UI Test page</h2>

      {/* <Loader show={isLoading} /> */}

      <MessageListCard    >
        
      <MessageList conversationHash='bafyreidv2bh6xzynx2fbkx4cqd7v4zq67l73najg67g7juruqr2hrcmngm' limit={10}/>
   
      </MessageListCard>
    </div>
  );
};

export default MessageListTest;


const MessageListCard = styled(Section)`
height:40vh;
`;