import React, { useContext } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { SupportChat, ITheme } from '@pushprotocol/uiweb';
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
    //works as Chat as well as Support Chat
    <SupportChat
  
      signer={librarySigner}
      supportAddress="0x99A08ac6254dcf7ccc37CeC662aeba8eFA666666"
      env={env}
      greetingMsg="How can i help you?"
      theme={lightTheme}
    />
  );
};
