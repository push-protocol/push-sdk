import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { ChatInput } from './ChatInput';
import { ModalHeader } from './ModalHeader';
import { AddressInfo } from './AddressInfo';
import * as PushAPI from '@pushprotocol/restapi';
import { ChatMainStateContext, ChatPropsContext } from '../../context';
import PushIcon from '../../icons/chat/pushIcon.svg';
import { Chats } from './Chats';
import {
  createUserIfNecessary,
  getChats,
  walletToPCAIP10,
} from '../../helpers';
import { IMessageIPFS } from '@pushprotocol/restapi';

export const Modal: React.FC = () => {
  const { supportAddress, env, account } = useContext<any>(ChatPropsContext);
  const { chats, setChatsSorted, connectedUser, setConnectedUser } =
    useContext<any>(ChatMainStateContext);

  const getChatCall = async () => {
    if (!connectedUser) return;
    const chatsResponse = await getChats({
      account,
      pgpPrivateKey: connectedUser.privateKey,
      supportAddress,
      env,
    });
    console.log(chatsResponse);
    setChatsSorted(chatsResponse);
  };

  const connectUser = async () => {
    const user = await createUserIfNecessary({ account, env });
    setConnectedUser(user);
  };

  useEffect(() => {
    getChatCall();
  }, [connectedUser]);

  useEffect(() => {
    const interval = setInterval(() => {
      getChatCall();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Container>
      <Section>
        <ModalHeader />
        <AddressInfo />
      </Section>
      <ChatSection>
        {connectedUser &&
          chats.length &&
          chats.map((chat: IMessageIPFS) => (
            <Chats
              msg={chat}
              caip10={walletToPCAIP10(account)}
              messageBeingSent={true}
            />
          ))}
      </ChatSection>

      {!connectedUser && (
        <ConnectSection>
          <Button onClick={() => connectUser()}>Connect</Button>
          <Span>Connect your wallet to conitnue</Span>
        </ConnectSection>
      )}
      <Section>
        {connectedUser && <ChatInput />}
        <PoweredByDiv>
          <PoweredBySpan>POWERED BY</PoweredBySpan>
          <Image src={PushIcon} alt="push logo" />
          <PoweredBySpan>Push Chat</PoweredBySpan>
        </PoweredByDiv>
      </Section>
    </Container>
  );
};

//styles
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
  background: #ffffff;
  border: 1px solid #e4e8ef;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.07);
  border-radius: 24px;
  height: 585px;
  max-height: 585px;
  width: 350px;
  max-width: 350px;
  padding: 0 15px 9px 15px;
`;

const ChatSection = styled.div`
  height: 350px;
  overflow: auto;
`;
const ConnectSection = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 25%;
`;

const Button = styled.button`
  background: #d53a94;
  border-radius: 15px;
  align-self: center;
  padding: 11px 36px;
  border: none;
  font-weight: 500;
  font-size: 17px;
  line-height: 150%;
  display: flex;
  align-items: center;
  text-align: center;
  letter-spacing: -0.019em;
  color: #ffffff;
  margin-bottom: 10px;
  cursor: pointer;
`;
const Section = styled.div``;
const Image = styled.img`
  verstical-align: middle;
`;

const Span = styled.span`
  font-weight: 400;
  font-size: 15px;
  line-height: 140%;
  display: flex;
  text-align: center;
  justify-content: center;
  margin-bottom: 30%;
  color: #657795;
`;

const PoweredByDiv = styled.div`
  display: flex;
  justify-content: center;
`;

const PoweredBySpan = styled.span`
  font-weight: 500;
  font-size: 8px;
  line-height: 150%;
  letter-spacing: 0.2em;
  color: #494d5f;
`;
