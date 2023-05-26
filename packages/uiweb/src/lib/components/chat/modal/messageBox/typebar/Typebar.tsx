import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { Image, Section } from '../../../../reusables/sharedStyling';
import EmojiIcon from '../../../../../icons/chat/emoji.svg';
import SendIcon from '../../../../../icons/chat/send.svg';
import usePushSendMessage from '../../../../../hooks/chat/usePushSendMessage';
import { ChatMainStateContext } from '../../../../../context';
import useFetchRequests from '../../../../../hooks/chat/useFetchRequests';
import { Spinner } from '../../../../reusables/Spinner';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { device } from '../../../../../config';

type TypebarPropType = {
  scrollToBottom: () => void;
};
const requestLimit = 30;
const page = 1;
export const Typebar: React.FC<TypebarPropType> = ({ scrollToBottom }) => {
  const [typedMessage, setTypedMessage] = useState<string>('');
  const [showEmojis, setShowEmojis] = useState<boolean>(false);
  const { selectedChatId, chatsFeed, setSearchedChats, newChat, setNewChat } =
    useContext<any>(ChatMainStateContext);
  const { sendMessage, loading } = usePushSendMessage();
  const { fetchRequests } = useFetchRequests();
  const onChangeTypedMessage = (val: string) => {
    setTypedMessage(val);
  };

  const sendPushMessage = async (content: string, type: string) => {
    try {
      await sendMessage({
        message: content,
        receiver: selectedChatId,
        messageType: type as any,
      });
      scrollToBottom();
      setSearchedChats(null);
      if (newChat) setNewChat(false);
      if (!chatsFeed[selectedChatId]) fetchRequests({page,requestLimit});
    } catch (error) {
      console.log(error);
      //handle error
    }
  };

  const sendTextMsg = async () => {
    if (typedMessage) {
      await sendPushMessage(typedMessage as string, 'Text');
      setTypedMessage('');
    }
  };
  const addEmoji = (emojiData: EmojiClickData, event: MouseEvent): void => {
    setTypedMessage(typedMessage + emojiData.emoji);
    setShowEmojis(false);
  };
  return (
    <Container
      borderColor="#DDDDDF"
      borderStyle="solid"
      borderWidth="1px"
      borderRadius="8px"
      padding=" 17px"
      margin="12px 0 12px 0"
      background="#fff"
      alignItems="center"
      justifyContent="space-between"
    >
      <Section gap="20px">
        <Image
          src={EmojiIcon}
          alt="emoji picker icon"
          width="20px"
          cursor="pointer"
          height="20px"
          onClick={() => setShowEmojis(!showEmojis)}
        />
        {showEmojis && (
          <EmojiPicker
            onEmojiClick={addEmoji}
            width={300}
            height={350}
          />
        )}
        <MultiLineInput
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              sendTextMsg();
            }
          }}
          placeholder="Type your message..."
          onChange={(e) => onChangeTypedMessage(e.target.value)}
          value={typedMessage}
          rows={1}
        />
      </Section>
      {!loading && (
        <Image
          cursor="pointer"
          src={SendIcon}
          alt="send message"
          width="19px"
          height="16px"
          onClick={() => sendTextMsg()}
        />
      )}
      {loading && <Spinner size="22"  />}
    </Container>
  );
};

//styles
const Container = styled(Section)`
  & .EmojiPickerReact.epr-main {
   position:absolute;
   bottom:3.5rem;
   left:3.7rem;
  }
`;
const MultiLineInput = styled.textarea`
  ::placeholder {
    transform: translateY(-5px);
  }
  font-weight: 400;
  font-size: 16px;
  width: 350px;
  outline: none;
  overflow-y: auto;
  box-sizing: border-box;
  border: none;
  color: #000;
  resize: none;
  &&::-webkit-scrollbar {
    width: 4px;
  }
  ::-webkit-scrollbar-thumb {
    background: rgb(181 181 186);
    border-radius: 10px;
    height: 50px;
  }
  ::placeholder {
    color: #000;
    padding-top: 5px;
  }
  @media ${device.mobileL} {
    width:230px;
  }
`;
