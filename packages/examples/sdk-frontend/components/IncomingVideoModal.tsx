// Import necessary libraries
import React from 'react';
import styled from 'styled-components';

// Styled components for the CallControl component
const IncomingVideoModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  width: 300px;
  border-radius: 5px;
  background-color: black;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const CallerID = styled.div`
  font-size: 18px;
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
`;

const RedButton = styled(Button)`
  background-color: #f44336;
  color: #fff;
`;

// CallControl component
const IncomingVideoModal = ({ callerID, onAccept, onReject }) => {
  return (
    <IncomingVideoModalWrapper>
      <CallerID>{callerID}</CallerID>
      <GreenButton onClick={onAccept}>Accept</GreenButton>
      <RedButton onClick={onReject}>Reject</RedButton>
    </IncomingVideoModalWrapper>
  );
};

export default IncomingVideoModal;
