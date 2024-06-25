import styled from 'styled-components';

import {
  ChatView,
  CreateGroupModal,
  MODAL_BACKGROUND_TYPE,
} from '@pushprotocol/uiweb';
import { Section } from '../components/StyledComponents';
import Img from '../../assets/epnsLogo.png';
import { CHAT_ID } from '../constants';

const ChatViewComponentTest = () => {
  const chatFilterList = [
    'bafyreidesy6f4iu34eqccmqh55g35wu36lvlz42c63ivtmgjjhezlzdqta',
    'bafyreig3gs4tpwxumiz5fxypyt4omlxhvrvuj66kfoyioeshawlau6lgem',
  ];

  return (
    <div>
      <h2>Chat View Test page</h2>

      <ChatViewComponentCard>
        {/* uncomment the below code to test create group modal */}
        <CreateGroupModal
          onClose={() => {
            console.log('in close');
          }}
          modalBackground={MODAL_BACKGROUND_TYPE.OVERLAY}
        />
        <ChatView
          onVerificationFail={() => console.log('Verification Failed')}
          chatId={CHAT_ID}
          chatProfileLeftHelperComponent={
            <img src={Img} onClick={() => console.debug('clicked')} />
          }
          chatProfileRightHelperComponent={<div>right component</div>}
          limit={10}
          isConnected={true}
          groupInfoModalBackground={MODAL_BACKGROUND_TYPE.OVERLAY}
        />
      </ChatViewComponentCard>
    </div>
  );
};

export default ChatViewComponentTest;

const ChatViewComponentCard = styled(Section)`
  height: 80vh;
  position: relative;
`;
