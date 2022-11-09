import React, { useContext, useState } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { Chat, ITheme } from '@pushprotocol/uiweb';
import { Web3Context } from './context';

export type ChatProps = {
  provider: Web3Provider;
  supportAddress: string;
  greetingMsg?: string;
  modalTitle?: string;
  primaryColor?: string;
  apiKey?: string;
  env?: string;
};

export const ChatSupportTest = () => {
  const { account } = useContext<any>(Web3Context);
  const theme:ITheme = {
    btnColorPrimary:'green',
    moduleColor:'pink'
  };
  return (
    <Chat
    account={account}
      supportAddress="0x272AC1593DcDfB9Def0BdD0Cdf75D78597129823"
      apiKey="tAWEnggQ9Z.UaDBNjrvlJZx3giBTIQDcT8bKQo1O1518uF1Tea7rPwfzXv2ouV5rX9ViwgJUrXm"
      greetingMsg='How can i help you?'
      theme={theme}
      env='dev'
    />
  );
};
