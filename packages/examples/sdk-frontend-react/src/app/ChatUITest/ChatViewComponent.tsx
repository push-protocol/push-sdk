import styled from 'styled-components';

import { Section } from '../components/StyledComponents';
import { CreateGroupModal, MODAL_BACKGROUND_TYPE, MODAL_POSITION_TYPE } from "@pushprotocol/uiweb";
import { ChatView } from '@pushprotocol/uiweb';

const ChatViewComponentTest = () => {
  const chatFilterList = [
    'bafyreidesy6f4iu34eqccmqh55g35wu36lvlz42c63ivtmgjjhezlzdqta',
    'bafyreig3gs4tpwxumiz5fxypyt4omlxhvrvuj66kfoyioeshawlau6lgem',
  ];

  return (
    <div>
      <h2>Chat UI Test page</h2>
      <ChatViewComponentCard>
      <CreateGroupModal onClose={()=>{console.log('in close')}}  modalBackground={MODAL_BACKGROUND_TYPE.OVERLAY} modalPositionType={MODAL_POSITION_TYPE.RELATIVE}/>

        <ChatView 
        onVerificationFail={() => console.log("BOIIII RETURNNNSSSSS")} 
        chatId='4ac5ab85c9c3d57adbdf2dba79357e56b2f9ef0256befe750d9f93af78d2ca68' 
        limit={10}
         isConnected={true} 
         groupInfoModalBackground={MODAL_BACKGROUND_TYPE.OVERLAY}
         groupInfoModalPositionType={MODAL_POSITION_TYPE.RELATIVE}
         verificationFailModalPosition={MODAL_POSITION_TYPE.RELATIVE}
         />
      </ChatViewComponentCard>
    </div>
  );
}

export default ChatViewComponentTest;

const ChatViewComponentCard = styled(Section)`
  height: 80vh;
  position:relative;
`;
//c2d544ad9d1efd5c5a593b143bf8232875c926cf28015564e70ad078b95f807e
//4ac5ab85c9c3d57adbdf2dba79357e56b2f9ef0256befe750d9f93af78d2ca68
