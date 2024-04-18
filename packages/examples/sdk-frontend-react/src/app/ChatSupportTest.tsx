import React, { useContext } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { SupportChat, ITheme, SupportChatV2 } from '@pushprotocol/uiweb';
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
    <SupportChatV2
    key= {'460336a9fa83112c95894af5471cd2b1091290a11298d87ec824ed74b7c14974'}
          supportAddress="0xc64444D6a076D6a8252390709A1270bfBBa32e2d"
          welcomeComponent={<div style={{display: "flex",flexDirection:'column',border:'1px solid black',overflow:'auto',height:'100%',width:'100%'}}>
            <p>Welcome</p>
            <p>new chat</p>
            <p>Welcome</p>
            <p>new chat</p>
            <p>Welcome</p>
            <p>new chat</p>
            <p>Welcome</p>

         
          </div>}

    />
    // <SupportChat
  
    //   signer={librarySigner}
    //   supportAddress="4ac5ab85c9c3d57adbdf2dba79357e56b2f9ef0256befe750d9f93af78d2ca68"
    //   env={env}
    //   greetingMsg="How can i help you?"
    //   theme={lightTheme}
    // />
  );
};
