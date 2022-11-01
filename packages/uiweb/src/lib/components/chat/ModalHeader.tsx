import React from 'react';
import MinimizeIcon from '../../icons/chat/minimize.svg';
import styled from 'styled-components';

export type ChatProps = {
  modalTitle: string;
  handleOnChatIconClick: () => void;
};

export const ModalHeader: React.FC<ChatProps> = ({
  modalTitle,
  handleOnChatIconClick,
}) => {
  return (
    <Container>
      <Span>{modalTitle}</Span>
      <Image
        src={MinimizeIcon}
        alt="minimize chat"
        onClick={()=>handleOnChatIconClick()}
      />
    </Container>
  );
};

//styles
const Container = styled.div`
  display: flex;
  border-bottom: 1px solid #e4e8ef;
  align-items: center;
  justify-content: space-between;
  padding: 17px;
`;

const Button = styled.button``;

const Image = styled.img`
  display: flex;
  max-height: initial;
  vertical-align: middle;
  overflow: initial;
  cursor: pointer;
  justify-content: flex-end;
`;

const Span = styled.span`
  font-weight: 500;
  font-size: 20px;
  line-height: 28px;
  display: flex;
  align-items: center;
  text-align: center;
  color: #1e1e1e;
  margin-left: 27%;
  flex: none;
  order: 0;
  flex-grow: 0;
`;
