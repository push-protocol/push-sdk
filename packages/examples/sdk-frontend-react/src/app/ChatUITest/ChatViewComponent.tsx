import styled from 'styled-components';

import { Section } from '../components/StyledComponents';
import { CreateGroupModal } from "@pushprotocol/uiweb";
import { ChatViewComponent } from '@pushprotocol/uiweb';

const ChatViewComponentTest = () => {
  const chatFilterList = [
    'bafyreidesy6f4iu34eqccmqh55g35wu36lvlz42c63ivtmgjjhezlzdqta',
    'bafyreig3gs4tpwxumiz5fxypyt4omlxhvrvuj66kfoyioeshawlau6lgem',
  ];

  return (
    <div>
      <h2>Chat UI Test page</h2>
      {/* <CreateGroupModal onClose={()=>{console.log('in close')}} /> */}
      <ChatViewComponentCard>
        <ChatViewComponent onGetTokenClick={() => console.log("BOIIII RETURNNNSSSSS")} chatId='5b3dba72949b77c48fe12cf87ffab91309ed9d1d78dec1db17c254020d2ffe2b' limit={10} isConnected={true} />
      </ChatViewComponentCard>
    </div>
  );
}

export default ChatViewComponentTest;

const ChatViewComponentCard = styled(Section)`
  height: 60vh;
`;
//c2d544ad9d1efd5c5a593b143bf8232875c926cf28015564e70ad078b95f807e
//4ac5ab85c9c3d57adbdf2dba79357e56b2f9ef0256befe750d9f93af78d2ca68
