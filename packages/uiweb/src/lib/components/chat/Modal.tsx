import React from 'react';
import { Web3Provider } from '@ethersproject/providers';
import styled from 'styled-components';
import { ModalHeader } from './ModalHeader';

export type ChatProps = {
  provider: Web3Provider;
  supportAddress: string;
  greetingMsg: string;
  modalTitle: string;
  primaryColor?: string;
  handleOnChatIconClick: () => void;
  env: string;
};

export const Modal: React.FC<ChatProps> = ({
  provider,
  supportAddress,
  greetingMsg,
  modalTitle,
  primaryColor,
  handleOnChatIconClick,
  env,
}) => {
  return (
    <Container>
      <ModalHeader
        modalTitle={modalTitle}
        handleOnChatIconClick={()=>handleOnChatIconClick()}
      />
    </Container>
  );
};

//styles
const Container = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background: #ffffff;
  border: 1px solid #e4e8ef;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.07);
  border-radius: 24px;
  height: 585px;
  width: 350px;
  padding: 0 20px 11px 20px;
`;

const Button = styled.button``;

const Image = styled.img``;
