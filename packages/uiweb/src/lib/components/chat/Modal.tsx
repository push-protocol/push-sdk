import React, { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { ChatInput } from './ChatInput';
import { ModalHeader } from './ModalHeader';
import { AddressInfo } from './AddressInfo';
import PoweredByPushLogo from '../../icons/chat/sponsorPush.svg';
import { ChatMainStateContext, ChatPropsContext } from '../../context';
import { Chats } from './Chats';
import {
  createUserIfNecessary,
  getChats,
  walletToPCAIP10,
} from '../../helpers';
import { IMessageIPFS } from '@pushprotocol/restapi';

const chatsFetchedLimit = 10;

export const Modal: React.FC = () => {
  const listInnerRef = useRef<HTMLDivElement>(null);
  const [chatsBeingFetched, setChatsBeingFetched] = useState<boolean>(false);
  const [lastThreadHashFetched, setLastThreadHashFetched] = useState<string|null>(null);
  const [wasLastListPresent, setWasLastListPresent] = useState<boolean>(false);
  const { supportAddress, env, account } = useContext<any>(ChatPropsContext);
  const { chats, setChatsSorted, connectedUser, setConnectedUser } =
    useContext<any>(ChatMainStateContext);

  const onScroll = () => {
    if (listInnerRef.current) {
      const { scrollTop } = listInnerRef.current;
      if (scrollTop === 0) {
        // This will be triggered after hitting the first element.
        // pagination
        getChatCall();
      }
    }
  };

  const getChatCall = async () => {
    if (!connectedUser) return;
    if(wasLastListPresent && !lastThreadHashFetched) return;
    setChatsBeingFetched(true);
    const { chatsResponse, lastThreadHash, lastListPresent } = await getChats({
      account,
      pgpPrivateKey: connectedUser.privateKey,
      supportAddress,
      threadHash: lastThreadHashFetched!,
      limit: chatsFetchedLimit,
      env,
    });
    setChatsSorted([...chats, ...chatsResponse]);
    setLastThreadHashFetched(lastThreadHash);
    setWasLastListPresent(lastListPresent);
    setChatsBeingFetched(false);
  };

  const connectUser = async () => {
    const user = await createUserIfNecessary({ account, env });
    setConnectedUser(user);
  };

  useEffect(() => {
    getChatCall();
  }, [connectedUser]);

  return (
    <Container>
      <HeaderSection>
        <ModalHeader />
        <AddressInfo />
      </HeaderSection>
      {chatsBeingFetched && <div>Loading...</div>}
      <ChatSection ref={listInnerRef} onScroll={onScroll}>
        {connectedUser && chats.length
          ? chats.map((chat: IMessageIPFS, index: number) => (
            <Chats
              msg={chat}
              key={index}
              caip10={walletToPCAIP10(account)}
              messageBeingSent={true}
            />
          ))
          : <></>}
      </ChatSection>
      {!connectedUser && (
        <ConnectSection>
          <Button onClick={() => connectUser()}>Connect</Button>
          <Span>Connect your wallet to continue</Span>
        </ConnectSection>
      )}
      <InputSection>
        {connectedUser && <ChatInput />}
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

const HeaderSection = styled.div``;

const InputSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const Image = styled.img`
  display: flex;
  max-height: initial;
  vertical-align: middle;
  overflow: initial;
  cursor: pointer;
  height: ${(props: any): string => props.height || '24px'};
  width: ${(props: any): string => props.width || '20px'};
  align-self: center;
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
