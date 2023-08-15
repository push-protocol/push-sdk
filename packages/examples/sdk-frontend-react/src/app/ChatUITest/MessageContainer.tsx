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
        
      <MessageContainer chatId='b8e068e02fe12d7136bc2f24408835573f30c6fbf0b65ea26ab4c7055a2c85f1' limit={10}/>
      </MessageContainerCard>
    </div>
  );
};

export default MessageContainerTest;


const MessageContainerCard = styled(Section)`
height:60vh;
`;