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
      <ChatViewComponentCard>
        <ChatViewComponent onClick={() => console.log("BOIIII RETURNNNSSSSS")} chatId='0960dcbd95ad905a3eec0b66d24efbfd950d6afd8b8d8113c53c2a0444c45304' limit={10} isConnected={true} />
      </ChatViewComponentCard>
    </div>
  );
}

export default ChatViewComponentTest;

const ChatViewComponentCard = styled(Section)`
  height: 60vh;
`;
//c2d544ad9d1efd5c5a593b143bf8232875c926cf28015564e70ad078b95f807e
