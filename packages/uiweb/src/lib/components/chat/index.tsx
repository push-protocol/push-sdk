import React, { useState } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import ChatIcon from '../../icons/chat/chatIcon.svg';
import { Modal } from './Modal';
import Constants from './constants';
import styled from 'styled-components';
import { handleOnChatIconClick } from '../../helpers';
import { ChatMainStateContext, ChatPropsContext } from '../../context';

export type ChatProps = {
  provider: Web3Provider;
  supportAddress: string;
  greetingMsg?: string;
  modalTitle?: string;
  primaryColor?: string;
  apiKey?:string;
  env?: string;
};

export type ButtonStyleProps = {
  bgColor: string;
};

export const Chat: React.FC<ChatProps> = ({
  provider,
  supportAddress,
  greetingMsg = Constants.DEFAULT_GREETING_MSG,
  modalTitle = Constants.DEFAULT_TITLE,
  primaryColor = Constants.COLOR.PRIMARY,
  apiKey = '',
  env = Constants.ENV.PROD,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const chatPropsData = {
    provider,
    supportAddress,
    greetingMsg,
    modalTitle,
    primaryColor,
    apiKey,
    env
  }

  const chatMainStateData = {
    isModalOpen,
    setIsModalOpen
  }

  return (
    <Container>
      <ChatPropsContext.Provider value={chatPropsData}>
        <ChatMainStateContext.Provider value={chatMainStateData}>
          {!isModalOpen && (
            <Button bgColor={primaryColor} onClick={() => handleOnChatIconClick({isModalOpen, setIsModalOpen})}>
              <Image src={ChatIcon} alt="chat" />
            </Button>
          )}
          {isModalOpen && (
            <Modal />
          )}
        </ChatMainStateContext.Provider>
      </ChatPropsContext.Provider>
    </Container>
  );
};

//styles
const Container = styled.div`
  font-family: 'Source Sans Pro', Arial, sans-serif;
  flex: 1;
  display: flex;
  position: fixed;
  bottom: 0;
  right: 0;
  width: fit-content;
  margin: 1.5rem;
  align-items: center;
  justify-content: center;
`;

const Button = styled.button<ButtonStyleProps>`
  background: ${(props) => props.bgColor};
  border: none;
  cursor: pointer;
  border-radius: 18px;
  padding: 16.5px 16.5px 13px 18.5px;
`;

const Image = styled.img``;
