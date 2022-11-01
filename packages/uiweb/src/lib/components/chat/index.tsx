import React, { useState } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import ChatIcon from '../../icons/chat/chatIcon.svg';
import { Modal } from './Modal';
import Constants from './constants';
import styled from 'styled-components';

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

  const handleOnChatIconClick = () => {
    console.log(isModalOpen);
    setIsModalOpen(!isModalOpen);
  };
  return (
    <Container>
      {!isModalOpen && (
        <Button bgColor={primaryColor} onClick={() => handleOnChatIconClick()}>
          <Image src={ChatIcon} alt="chat" />
        </Button>
      )}
      {isModalOpen && (
        <Modal
          supportAddress={supportAddress}
          provider={provider}
          greetingMsg={greetingMsg}
          modalTitle={modalTitle}
          handleOnChatIconClick={() => handleOnChatIconClick()}
          env={env}
        />
      )}
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
