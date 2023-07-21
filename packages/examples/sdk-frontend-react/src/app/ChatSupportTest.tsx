import React, { useContext } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { Chat, ITheme } from '@pushprotocol/uiweb';
import { lightTheme } from '@pushprotocol/uiweb';
import { EnvContext, Web3Context } from './context';

export type ChatProps = {
  provider: Web3Provider;
  supportAddress: string;
  greetingMsg?: string;
  modalTitle?: string;
  primaryColor?: string;
  apiKey?: string;
  env?: 'dev' | 'staging' | 'prod';
};

export const ChatSupportTest = () => {
  const { account, library } = useContext<any>(Web3Context);
  const librarySigner = library.getSigner();
  const { env } = useContext<any>(EnvContext);
  const theme: ITheme = {
    bgColorPrimary: 'gray',
    bgColorSecondary: 'purple',
    textColorPrimary: 'white',
    textColorSecondary: 'green',
    btnColorPrimary: 'red',
    btnColorSecondary: 'purple',
    border: '1px solid black',
    borderRadius: '40px',
    moduleColor: 'pink',
  };

  return (
    <Chat
      account={account}
      signer={librarySigner}
      supportAddress="0xD2A371cAFBE09333F6668229E4BD33196583c325"
      apiKey="tAWEnggQ9Z.UaDBNjrvlJZx3giBTIQDcT8bKQo1O1518uF1Tea7rPwfzXv2ouV5rX9ViwgJUrXm"
      env={env}
      greetingMsg="How can i help you?"
      theme={lightTheme}
    />
  );
};
