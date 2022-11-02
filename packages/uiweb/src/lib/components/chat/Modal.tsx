import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { ModalHeader } from './ModalHeader';
import { AddressInfo } from './AddressInfo';
import * as PushAPI from '@pushprotocol/restapi';
import { ChatPropsContext } from '../../context';
import { Chats } from './Chats';
import { walletToPCAIP10 } from '../../helpers';
import { IMessageIPFS } from '@pushprotocol/restapi';

export const Modal: React.FC = () => {
  const { supportAddress, provider, env, connectedUser } =
    useContext<any>(ChatPropsContext);
  const [chats, setChats] = useState<any>({});
  useEffect(() => {
    const getChats = async () => {
      // const threadhash = await PushAPI.chat.conversationHash({account:,conversationId:supportAddress});
      const chats = await PushAPI.chat.history({
        threadhash:
          'bafyreigima2xvehxzqkbafaotwvggfhk5bpsce3k6ewqhkvbisfa4phaju',
        limit: 3,
        env,
      });
      setChats(chats);
    };
    getChats();
  }, []);
  console.log(chats);
  return (
    <Container>
      <ModalHeader />
      <AddressInfo />
      {/* {!connectedUser &&
        chats.length &&
        chats.map((chat: IMessageIPFS) => { */}
          <Chats
            msg={chats[0]}
            caip10={walletToPCAIP10('0x58689458347f54d1d36cB287C1Cb2017800ecBB4')}
            messageBeingSent={true}
          />
           <Chats
            msg={chats[1]}
            caip10={walletToPCAIP10('0x58689458347f54d1d36cB287C1Cb2017800ecBB4')}
            messageBeingSent={true}
          />
        {/* })} */}
      {connectedUser && <Span>Connect your wallet to conitnue</Span>}
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
  padding: 0 15px 11px 15px;
`;

const Button = styled.button``;

const Image = styled.img``;

const Span = styled.span`
  font-weight: 400;
  font-size: 15px;
  line-height: 140%;
  display: flex;
  text-align: center;
  justify-content: center;
  margin-top: 30%;
  color: #657795;
`;
