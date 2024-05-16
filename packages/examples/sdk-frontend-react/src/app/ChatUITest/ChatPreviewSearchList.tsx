import { ChatPreviewSearchList } from '@pushprotocol/uiweb';

const ChatPreviewSearchListTest = () => {
  return (
    <>
      <div
        style={{
          background: '#ffeded',
          border: '1px solid rgb(226,8,128)',
          height: '28.5vh',
        }}
      >
        <ChatPreviewSearchList searchParamter="0xFA3F8E79fb9B03e7a04295594785b91588Aa4DC8" />
      </div>
    </>
  );
};

export default ChatPreviewSearchListTest;
