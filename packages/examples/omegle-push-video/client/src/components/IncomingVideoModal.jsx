// Import necessary libraries
import React from "react";
import styled from "styled-components";

const IncomingVideoModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  width: 400px;
  border-radius: 5px;
  background-color: black;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
`;

const CallerID = styled.div`
  font-size: 14px;
  margin-bottom: 20px;
  color: #fff;
`;

const Button = styled.button`
  padding: 10px 20px;
  margin: 5px;
  font-size: 16px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  outline: none;
`;

const GreenButton = styled(Button)`
  background-color: #4caf50;
  color: #fff;
  cursor: pointer;
`;

const RedButton = styled(Button)`
  background-color: #f44336;
  color: #fff;
  cursor: pointer;
`;
const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-around;
`;

const IncomingVideoModal = ({callerID, onAccept, onReject}) => {
  return (
    <IncomingVideoModalWrapper>
      <CallerID>{callerID} is calling... </CallerID>
      <ButtonContainer>
        <GreenButton onClick={onAccept}>Accept</GreenButton>
        <RedButton onClick={onReject}>Reject</RedButton>
      </ButtonContainer>
    </IncomingVideoModalWrapper>
  );
};

export default IncomingVideoModal;
