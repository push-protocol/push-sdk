import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';
import { ChatInput } from './ChatInput';
import { ModalHeader } from './ModalHeader';
import { AddressInfo } from './AddressInfo';
import PoweredByPushLogo from '../../icons/chat/sponsorPush.svg';
import { ReactComponent as HandWave } from '../../icons/chat/handWave.svg';
import { ChatMainStateContext, ChatPropsContext } from '../../context';
import { Chats } from './Chats';
import {
  createUserIfNecessary,
  getChats,
  walletToPCAIP10,
} from '../../helpers';
import { IMessageIPFS } from '../../types';

export const Modal: React.FC = () => {
  const { supportAddress, env, account, greetingMsg, theme } =
    useContext<any>(ChatPropsContext);
  const { chats, setChatsSorted, connectedUser, setConnectedUser } =
    useContext<any>(ChatMainStateContext);

  const greetingMsgObject = {
    fromDID: walletToPCAIP10(supportAddress),
    toDID: walletToPCAIP10(account),
    fromCAIP10: walletToPCAIP10(supportAddress),
    toCAIP10: walletToPCAIP10(account),
    messageContent: greetingMsg,
    messageType: 'Text',
    signature: '',
    encType: '',
    encryptedSecret: '',
    sigType: '',
    link: null,
    timestamp: undefined,
    icon: HandWave,
  };
  const getChatCall = async () => {
    if (!connectedUser) return;
    const chatsResponse: IMessageIPFS[] = await getChats({
      account,
      pgpPrivateKey: connectedUser.privateKey,
      supportAddress,
      greetingMsg,
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
  }, [connectedUser]);

  return (
    <Container theme={theme}>
      <HeaderSection>
        <ModalHeader />
        <AddressInfo />
      </HeaderSection>
      <ChatSection>
        {!connectedUser && (
          <Chats
            msg={greetingMsgObject}
            caip10={walletToPCAIP10(account)}
            messageBeingSent={true}
          />
        )}
        {connectedUser && chats.length ? (
          chats.map((chat: IMessageIPFS) => (
            <Chats
              msg={chat}
              caip10={walletToPCAIP10(account)}
              messageBeingSent={true}
            />
          ))
        ) : (
          <></>
        )}
      </ChatSection>
      {!connectedUser && (
        <ConnectSection>
          <Button onClick={() => connectUser()} theme={theme}>
            Connect
          </Button>
          <Span>Connect your wallet to conitnue</Span>
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
  background: ${(props) => props.theme.moduleColor};
  border: ${(props) => props.theme.border};
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.07);
  border-radius: ${(props) => props.theme.borderRadius};
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
  margin-bottom: 30%;
`;

const Button = styled.button`
  background: ${(props) => props.theme.btnColorPrimary};
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
  color: ${(props) => props.theme.textColorSecondary};
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
