import styled from 'styled-components';

import { Section } from '../components/StyledComponents';

import { ChatViewComponent } from '@pushprotocol/uiweb';


const ChatViewComponentTest = () => {



  return (
    <div>
      <h2>Chat UI Test page</h2>

      {/* <Loader show={isLoading} /> */}
    <ChatViewComponentCard>
        
      <ChatViewComponent chatId='24b029b8e07e60291bf9d8c0c48ff993fa1e0a99105459f7404c425c92e91bac' limit={10}/>
      </ChatViewComponentCard>
    </div>
  );
};

export default ChatViewComponentTest;


const ChatViewComponentCard = styled(Section)`
height:60vh;
`;