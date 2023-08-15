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
        
      <MessageContainer chatId='0x01900b769D639b99a8F5645Ba90B776725b16602' limit={10}/>
      </MessageContainerCard>
    </div>
  );
};

export default MessageContainerTest;


const MessageContainerCard = styled(Section)`
height:60vh;
`;