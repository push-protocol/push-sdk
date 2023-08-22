import styled from 'styled-components';

import { Section } from '../components/StyledComponents';

import { ChatViewComponent } from '@pushprotocol/uiweb';


const ChatViewComponentTest = () => {



  return (
    <div>
      <h2>Chat UI Test page</h2>

      {/* <Loader show={isLoading} /> */}
    <ChatViewComponentCard>
        
      <ChatViewComponent onClick={() => console.log("BOIIII RETURNNNSSSSS")} chatId='196f58cbe07c7eb5716d939e0a3be1f15b22b2334d5179c601566600016860ac' limit={10}/>
      </ChatViewComponentCard>
    </div>
  );
};

export default ChatViewComponentTest;


const ChatViewComponentCard = styled(Section)`
height:60vh;
`;