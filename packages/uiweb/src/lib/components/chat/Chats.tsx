import React, { useState } from 'react';
import styled from 'styled-components';
import { IMessageIPFS } from '../types';

type ChatsPropType = {
  msg: IMessageIPFS;
  caip10: string;
  messageBeingSent: boolean;
};

type MessageWrapperType = {
    align?:string;
    height?:string;
}

type FileMessageContent ={
    content: string;
    name: string;
    type: string;
    size: number;
  }

export const Chats: React.FC<ChatsPropType> = ({
  msg,
  caip10,
  messageBeingSent,
}) => {
  const [showImageModal, setShowImageModal] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  const time: Date = new Date(msg?.timestamp!);
  const time1 = time.toLocaleTimeString('en-US');
  const date = time1.slice(0, -6) + time1.slice(-2);
  return (
    <Container>
      <>
        {msg.messageType === 'Text' ? (
          <>
            {msg.fromCAIP10 === caip10 ? (
              <MessageWrapper align="row-reverse">
                <SenderMessage>
                  <TextMessage>{msg.messageContent}</TextMessage>
                  <TimeStamp>{date}</TimeStamp>
                </SenderMessage>
              </MessageWrapper>
            ) : (
              <MessageWrapper align="row">
                <ReceivedMessage>
                  <TextMessage>{msg.messageContent}</TextMessage>
                  <TimeStamp>{date}</TimeStamp>
                </ReceivedMessage>
              </MessageWrapper>
            )}
          </>
        ) : msg.messageType === 'Image' ? (
          <>
            {msg.fromCAIP10 === caip10 ? (
              <MessageWrapper height="138px" align="row-reverse">
                <SenderMessage color="transparent">
                  <ImageMessage
                    src={
                      (JSON.parse(msg.messageContent) as FileMessageContent)
                        .content
                    }
                    onClick={() => {
                      setShowImageModal(true);
                      setImageUrl(
                        (JSON.parse(msg.messageContent) as FileMessageContent)
                          .content
                      );
                    }}
                  />
                </SenderMessage>
              </MessageWrapper>
            ) : (
              <MessageWrapper height="138px" align="row">
                <ReceivedMessage color="transparent">
                  <ImageMessage
                    src={
                      (JSON.parse(msg.messageContent) as FileMessageContent)
                        .content
                    }
                    onClick={() => {
                      setShowImageModal(true);
                      setImageUrl(
                        (JSON.parse(msg.messageContent) as FileMessageContent)
                          .content
                      );
                    }}
                  />
                </ReceivedMessage>
              </MessageWrapper>
            )}

            {/* {showImageModal && (
            //   <Modal
            //     showImageModal={showImageModal}
            //     onClose={() => setShowImageModal(false)}
            //     src={imageUrl}
            //     time={msg.timestamp}
            //   />
            )} */}
          </>
        ) : msg.messageType === 'File' ? (
          <>
            {msg.fromCAIP10 === caip10 ? (
              <MessageWrapper align="row-reverse">
                <SenderMessage color="transparent">
                  <FileMessage>
                    {/* <Files msg={msg} /> */}
                  </FileMessage>
                </SenderMessage>
              </MessageWrapper>
            ) : (
              <MessageWrapper align="row">
                <ReceivedMessage color="transparent">
                  <FileMessage>
                    {/* <Files msg={msg} /> */}
                  </FileMessage>
                </ReceivedMessage>
              </MessageWrapper>
            )}
          </>
        ) : null}
      </>
    </Container>
  );
};

//styles
const Container = styled.div`
  display: flex;
  flex-direction: column;
  background: #ffffff;
`;

const Button = styled.button``;

const Image = styled.img``;
const FileMessage = styled.div`
  &:hover {
    cursor: pointer;
  }
`;

const ImageMessage = styled.img`
  max-height: 170px;
  max-width: 300px;
  object-fit: contain;
  border-radius:  '0px';
  &:hover {
    cursor: pointer;
  }
`;

const TextMessage = styled.p`
  max-width: 300px;
  padding: 0px 44px 10px 0px;
  font-size: 14px;
  word-wrap: break-word;
  text-align: left;
  font-weigth: 400;
  margin: 0px;
`;

const TimeStamp = styled.span`
  min-width: 44px;
  font-size: 11px;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  padding: 5px 0px 0px 5px;
  position: absolute;
  right: 10px;
  bottom: 5px;
`;

const MessageWrapper = styled.div<MessageWrapperType>`
  width: 100%;
  min-height: ${(props: any): string => props.height || '48px'};
  padding: 0;
  margin-bottom: 5px;
  display: flex;
  flex-direction: ${(props: any): string => props.align || 'row'};
`;

const ReceivedMessage = styled.div`
  box-sizing: border-box;
  position: relative;
  left: 34px;
  max-width: 419px;
  padding: ${(props: any): string => props.padding || '11px 11px 5px 24px'};
  background: ${(props: any): string => props.color || '#ffffff'};
  text-align: left;
  border-radius: 2px 16px 16px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #000000;
`;

const SenderMessage = styled.div`
  box-sizing: border-box;
  position: relative;
  right: 34px;
  max-width: 419px;
  text-align: left;
  padding: ${(props: any): string => props.padding || '11px 11px 5px 24px'};
  background: ${(props: any): string => props.color || '#ca599b'};
  border-radius: 16px 2px 16px 16px;
  display: flex;
  justify-content: flex-strt;
  align-items: center;
  color: #ffffff;
`;
