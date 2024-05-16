import { ChatPreviewSearchList } from '@pushprotocol/uiweb';
import styled from 'styled-components';

const ChatPreviewSearchListTest = () => {
  return (
    <>
      <Conatiner>
        <ChatPreviewSearchList searchParamter="0xFA3F8E79fb9B03e7a04295594785b91588Aa4DC8" />
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
