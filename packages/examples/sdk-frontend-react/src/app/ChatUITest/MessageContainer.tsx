import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import * as PUSHAPI from '@pushprotocol/restapi';
import { Link } from 'react-router-dom';
import { Section } from '../components/StyledComponents';
import { EnvContext, Web3Context } from '../context';
import { MessageContainer } from '@pushprotocol/uiweb';


const MessageContainerTest = () => {



  return (
    <div>
      <h2>Chat UI Test page</h2>

      {/* <Loader show={isLoading} /> */}
    <MessageContainerCard>
        
      <MessageContainer chatId='0x5F17064F559f6fC2563F9830B2EafB8D1e070a11' limit={10}/>
      </MessageContainerCard>
    </div>
  );
};

export default MessageContainerTest;


const MessageContainerCard = styled(Section)`
height:40vh;
`;