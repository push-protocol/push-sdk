import React, { useContext, useState } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { Chat } from '@pushprotocol/uiweb';
import { EnvContext, Web3Context } from './context';

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
  const { env } = useContext<any>(EnvContext);
  return (
    <Chat
    account={account}
      supportAddress="0xd9c1CCAcD4B8a745e191b62BA3fcaD87229CB26d"
      apiKey="tAWEnggQ9Z.UaDBNjrvlJZx3giBTIQDcT8bKQo1O1518uF1Tea7rPwfzXv2ouV5rX9ViwgJUrXm"
      env={env}
    />
  );
};
