import React from 'react';
import { ChatPropsContext } from '../../context';

import { Constants } from '../../config';
import {ChatMainStateContextProvider} from '../../context';

import { Chat } from './Chat';
import { Env } from '@pushprotocol/restapi';

export type ChatProps = {
  account: string;
  decryptedPgpPvtKey?: string;
  env?: Env;
};

//make changes for users who dont have decryptedPgpPvtKey

export const ChatWidget: React.FC<ChatProps> = ({
  account,
  decryptedPgpPvtKey = null,
  env = Constants.ENV.PROD,
}) => {


  const chatPropsData = {
    account,
    decryptedPgpPvtKey,
    env,
  };


  return (
 
      <ChatPropsContext.Provider value={chatPropsData}>
        <ChatMainStateContextProvider>
        
        <Chat/>
        </ChatMainStateContextProvider>
      </ChatPropsContext.Provider>
  );
};

//styles



