import { ChatPreviewSearchList } from '@pushprotocol/uiweb';
import styled from 'styled-components';

const ChatPreviewSearchListTest = () => {
  const walletAddress = 'fabio.eth';
  return (
    <>
      <Conatiner>
        <ChatPreviewSearchList searchParamter={walletAddress} />
      </Conatiner>
    </>
  );
};

export default ChatPreviewSearchListTest;

const Conatiner = styled.div`
background: '#ffeded',
border: '1px solid rgb(226,8,128)',
height: '28.5vh',
`;
