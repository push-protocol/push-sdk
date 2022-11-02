import React from 'react';
import styled from 'styled-components';
import { ModalHeader } from './ModalHeader';

export const Modal: React.FC = () => {
  return (
    <Container>
      <ModalHeader />
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
