import React, { useState } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { Chat } from '@pushprotocol/uiweb';
import { useWeb3React } from '@web3-react/core';

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
  const { library } = useWeb3React();
  return (
    <Chat
      supportAddress="0x5F17064F559f6fC2563F9830B2EafB8D1e070a11"
      provider={library.provider}
      apiKey="tAWEnggQ9Z.UaDBNjrvlJZx3giBTIQDcT8bKQo1O1518uF1Tea7rPwfzXv2ouV5rX9ViwgJUrXm"
      env='dev'
    />
  );
};
