import styled from 'styled-components';

import { Section } from '../components/StyledComponents';

import { ChatViewComponent } from '@pushprotocol/uiweb';


const ChatViewComponentTest = () => {



  return (
    <div>
      <h2>Chat UI Test page</h2>

      {/* <Loader show={isLoading} /> */}
    <ChatViewComponentCard>
        
      <ChatViewComponent chatId='0xa5427570CbA069bfD72aAb51494A2a35bF8b5003' limit={10}/>
      </ChatViewComponentCard>
    </div>
  );
};

export default ChatViewComponentTest;


const ChatViewComponentCard = styled(Section)`
height:60vh;
`;