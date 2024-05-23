import styled from 'styled-components';

import { ChatViewList } from '@pushprotocol/uiweb';
import { CHAT_ID } from '../constants';

const ChatViewListTest = () => {
  return (
    <div>
      <h2>Chat UI Test page</h2>

      <ChatViewListCard>
        <ChatViewList chatId={CHAT_ID} limit={10} />
      </ChatViewListCard>
    </div>
  );
};

export default ChatViewListTest;

const ChatViewListCard = styled.div`
  height: 40vh;
  background: black;
  overflow: auto;
  overflow-x: hidden;
`;
