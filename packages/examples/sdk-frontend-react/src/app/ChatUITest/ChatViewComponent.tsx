import styled from 'styled-components';

import { Section } from '../components/StyledComponents';

import { ChatViewComponent } from '@pushprotocol/uiweb';

const ChatViewComponentTest = () => {
  const chatFilterList = [
    'bafyreidesy6f4iu34eqccmqh55g35wu36lvlz42c63ivtmgjjhezlzdqta',
    'bafyreig3gs4tpwxumiz5fxypyt4omlxhvrvuj66kfoyioeshawlau6lgem',
  ];

  return (
    <div>
      <h2>Chat UI Test page</h2>

      {/* <Loader show={isLoading} /> */}
    <ChatViewComponentCard>
        
      <ChatViewComponent onClick={() => console.log("BOIIII RETURNNNSSSSS")} chatId='c4828a375fd261577927a9d73fe3fa30204c6667a3adbc345e010eccf5ec740e' limit={10}/>
      </ChatViewComponentCard>
    </div>
  );
};

export default ChatViewComponentTest;

const ChatViewComponentCard = styled(Section)`
  height: 60vh;
`;
