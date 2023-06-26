import type { ChangeEvent } from 'react';
import React, { useState, useContext, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Div, Section } from '../../../../reusables/sharedStyling';
import { EmojiIcon } from '../../../../../icons/Emoji';
import { SendIcon } from '../../../../../icons/Send';
import { GifIcon } from '../../../../../icons/Gif';
import { AttachmentIcon } from '../../../../../icons/Attachment';
import usePushSendMessage from '../../../../../hooks/chat/usePushSendMessage';
import { ChatAndNotificationMainContext, ChatMainStateContext } from '../../../../../context';
import useFetchRequests from '../../../../../hooks/chat/useFetchRequests';
import { Spinner } from '../../../../reusables/Spinner';
import type { EmojiClickData } from 'emoji-picker-react';
import EmojiPicker from 'emoji-picker-react';
import { device, PUBLIC_GOOGLE_TOKEN } from '../../../../../config';
import GifPicker from 'gif-picker-react';
import { useClickAway } from '../../../../../hooks';
import type { FileMessageContent } from '../../../../../types';
import type { ChatMainStateContextType } from '../../../../../context/chatAndNotification/chat/chatMainStateContext';
import type { ChatAndNotificationMainContextType } from '../../../../../context/chatAndNotification/chatAndNotificationMainContext';

type GIFType = {
  url: string;
  height: number;
  width: number;
};

type TypebarPropType = {
  scrollToBottom: () => void;
};
const requestLimit = 30;
const page = 1;
export const Typebar: React.FC<TypebarPropType> = ({ scrollToBottom }) => {
  const [typedMessage, setTypedMessage] = useState<string>('');
  const [showEmojis, setShowEmojis] = useState<boolean>(false);
  const [gifOpen, setGifOpen] = useState<boolean>(false);
  const modalRef = useRef(null);
  const fileUploadInputRef = React.useRef<HTMLInputElement>(null);
  const { selectedChatId, chatsFeed, setSearchedChats, requestsFeed } =
    useContext<ChatMainStateContextType>(ChatMainStateContext);
    const {
      newChat,
      setNewChat,
    } = useContext<ChatAndNotificationMainContextType>(ChatAndNotificationMainContext)
  const { sendMessage, loading } = usePushSendMessage();
  const [filesUploading, setFileUploading] = useState<boolean>(false);
  const { fetchRequests } = useFetchRequests();
  const onChangeTypedMessage = (val: string) => {
    setTypedMessage(val);
  };

  useClickAway(modalRef, () => {
    setGifOpen(false);
    setShowEmojis(false);
  });
  const sendPushMessage = async (content: string, type: string) => {
    try {
      await sendMessage({
        message: content,
        receiver: selectedChatId as string,
        messageType: type as any,
      });
      scrollToBottom();

      if (chatsFeed[selectedChatId as string] || requestsFeed[selectedChatId as string])
        setSearchedChats(null);
      if (newChat) setNewChat(false);
      if (!chatsFeed[selectedChatId as string]) fetchRequests({ page, requestLimit });
    } catch (error) {
      console.log(error);
      //handle error
    }
  };

  const sendGIF = async (emojiObject: GIFType) => {
    sendPushMessage(emojiObject.url as string, 'GIF');
    setGifOpen(false);
  };

  const sendTextMsg = async () => {
    if (typedMessage.trim() !== '') {

      await sendPushMessage(typedMessage as string, 'Text');
      setTypedMessage('');
    }
  };
  const addEmoji = (emojiData: EmojiClickData, event: MouseEvent): void => {
    setTypedMessage(typedMessage + emojiData.emoji);
    setShowEmojis(false);
  };

  const handleUploadFile = () => {
    if (fileUploadInputRef.current) {
      fileUploadInputRef.current.click();
    }
  };

  const uploadFile = async (
    e: ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    if (!(e.target instanceof HTMLInputElement)) {
      return;
    }
    if (!e.target.files) {
      return;
    }
    if (
      e.target &&
      (e.target as HTMLInputElement).files &&
      ((e.target as HTMLInputElement).files as FileList).length
    ) {
      const file: File = e.target.files[0];
      if (file) {
        try {
          const TWO_MB = 1024 * 1024 * 2;
          if (file.size > TWO_MB) {
            console.log('Files larger than 2mb is now allowed');
            return;
          }
          setFileUploading(true);
          const messageType = file.type.startsWith('image') ? 'Image' : 'File';
          const reader = new FileReader();
          let fileMessageContent: FileMessageContent;
          reader.readAsDataURL(file);
          reader.onloadend = async (e): Promise<void> => {
            fileMessageContent = {
              content: e.target!.result as string,
              name: file.name,
              type: file.type,
              size: file.size,
            };

            sendPushMessage(JSON.stringify(fileMessageContent), messageType);
          };
        } catch (err) {
          console.log(err);
        } finally {
          setFileUploading(false);
        }
      }
    }
  };

  //for fixing the typebar height
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (textAreaRef?.current?.style) {
      textAreaRef.current.style.height = 25 + 'px';
      const scrollHeight = textAreaRef.current?.scrollHeight;
      textAreaRef.current.style.height = scrollHeight + 'px';

      console.log("height", scrollHeight, textAreaRef.current.style.height)


    }
  }, [textAreaRef, typedMessage]);

  return (
    <Container>
      <Section
        borderColor="#DDDDDF"
        borderStyle="solid"
        borderWidth="1px"
        borderRadius="8px"
        gap="10px"
        padding="13px 17px"
        margin="12px 0 12px 0"
        background="#fff"
        alignItems="center"
        justifyContent="space-between"
      >
        <Section gap="8px" flex='1'>
          <Div
            width="20px"
            cursor="pointer"
            height="20px"
            onClick={() => setShowEmojis(!showEmojis)}
          >
            <EmojiIcon />
          </Div>

          {showEmojis && (
            <Section
              ref={modalRef}
              position="absolute"
              bottom="3.5rem"
              left="3.7rem"
            >
              <EmojiPicker onEmojiClick={addEmoji} width={300} height={350} />
            </Section>
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
            ref={textAreaRef}
            rows={1}
          />
        </Section>
        <Section gap="11.5px">
          <Section
            width="34px"
            height="30px"
            cursor="pointer"
            alignSelf='center'
            onClick={() => setGifOpen(!gifOpen)}
          >
            <GifIcon />
          </Section>

          {gifOpen && (
            <Section
              position="absolute"
              bottom="3.5rem"
              right="6.6rem"
              ref={modalRef}
            >
              <GifPicker
                onGifClick={sendGIF}
                width={350}
                height={350}
                tenorApiKey={String(PUBLIC_GOOGLE_TOKEN)}
              />
            </Section>
          )}
          <Section onClick={handleUploadFile}>
            {!(loading || filesUploading) && (
              <>
                <Section
                  width="17px"
                  height="17px"
                  cursor="pointer"
                  alignSelf='center'
                  onClick={() => setNewChat(true)}
                >
                  <AttachmentIcon />
                </Section>

                <FileInput
                  type="file"
                  ref={fileUploadInputRef}
                  onChange={(e) => uploadFile(e)}
                />
              </>
            )}
          </Section>
          {!(loading || filesUploading) && (
            <Section
              cursor="pointer"
              alignSelf='center'
              onClick={() => sendTextMsg()}
            >
              <SendIcon />
            </Section>
          )}

          {(loading || filesUploading) && <Spinner size="22" />}
        </Section>
      </Section>

    </Container>
  );
};

//styles
const Container = styled.div`
  width:100%;
  border-top:1px solid #DDDDDF;
`;
const MultiLineInput = styled.textarea`
  ::placeholder {
    transform: translateY(-2px);
  }
  font-family:inherit;
  font-weight: 400;
  font-size: 16px;
  width: 27vw;
  outline: none;
  overflow-y: auto;
  box-sizing: border-box;
  border: none;
  color: #000;
  resize: none;
  flex:1;
  padding-right:15px;
  align-self: end;
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
    width: 27vw;
  }
  min-height: 25px;
  max-height: 75px;
`;
const FileInput = styled.input`
  display: none;
`;
