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
          'bafyreidlx67ejegix5ix2ycnu2eegiei3luzcvpxxn3uu532j6rv6mqyfq',
        limit: 10,
        env,
      });
      setChats(chats);
    };
    getChats();
  }, []);

  return (
    <Container>
      <ModalHeader />
      <AddressInfo />
      {chats.map((chat:IMessageIPFS) => {
        <Chats
          msg={chat}
          caip10={walletToPCAIP10(provider.getAccount())}
          messageBeingSent={true}
        />;
      })}
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
