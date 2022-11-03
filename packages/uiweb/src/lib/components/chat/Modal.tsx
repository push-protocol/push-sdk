import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { ChatInput } from './ChatInput';
import { ModalHeader } from './ModalHeader';
import { AddressInfo } from './AddressInfo';
import * as PushAPI from '@pushprotocol/restapi';
import PoweredByPushLogo from '../../icons/chat/sponsorPush.svg';
import { ChatMainStateContext, ChatPropsContext } from '../../context';
import PushIcon from '../../icons/chat/pushIcon.svg';
import { Chats } from './Chats';
import { getChats, walletToPCAIP10 } from '../../helpers';
import { IMessageIPFS } from '@pushprotocol/restapi';

export const Modal: React.FC = () => {
  const { supportAddress, env, account } = useContext<any>(ChatPropsContext);
  const { chats, setChatsSorted, connectedUser } =
    useContext<any>(ChatMainStateContext);
  useEffect(() => {
    if (connectedUser) {
      const getChatCall = async () => {
        console.log('in use effect');
        const chats = await getChats({
          account,
          pgpPrivateKey: connectedUser.privateKey,
          supportAddress,
          env,
        });
        setChatsSorted(chats);
      };
      getChatCall();
    }
  }, [connectedUser]);
  console.log(connectedUser);
  console.log(chats);
  return (
    <Container>
      <HeaderSection>
        <ModalHeader />
        <AddressInfo />
      </HeaderSection>
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
      {!connectedUser && <Span>Connect your wallet to conitnue</Span>}
      <InputSection>
        <ChatInput />
        <Image
            src={PoweredByPushLogo}
            alt="Powered by Push Protocol"
            height="18px"
            width="145px"
          />
      </InputSection>
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

const HeaderSection = styled.div`
`;

const InputSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Image = styled.img`
  display: flex;
  max-height: initial;
  vertical-align: middle;
  overflow: initial;
  cursor: pointer;
  height: ${(props: any): string => props.height || '24px'};
  width: ${(props: any): string => props.width || '20px'};
  justify-content: flex-end;
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
