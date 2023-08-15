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
  const { account, pgpPrivateKey } = useContext<any>(Web3Context)

  const { env } = useContext<any>(EnvContext);
  const [conversationHash, setConversationHash] = useState<string>('');

  const fetchConversationHash = async () => {
    const ConversationHash = await PUSHAPI.chat.conversationHash({
      account: `eip155:${account}`,
      conversationId: '831b1d93f36fa2fce6c3d8c7c41c53335c82ad13cbe05478579af235f10716dc',
      env: env
    });
    setConversationHash(ConversationHash.threadHash);
  }
  console.log(conversationHash)
  useEffect(() => {
    if (pgpPrivateKey) {
      fetchConversationHash();
    }
  })

  usePushChatSocket();
  return (
    <div>
      <h2>Chat UI Test page</h2>

      {/* <Loader show={isLoading} /> */}

      <MessageListCard    >
        <MessageList conversationHash={conversationHash} limit={10} />

      </MessageListCard>
      <TypeBar chatId='0xe19c4b204a76db09697ea54c9182eba2195542aD' isConnected={true} />
    </div>
  );
};

export default MessageListTest;


const MessageListCard = styled(Section)`
height:40vh;
background:black;
`;