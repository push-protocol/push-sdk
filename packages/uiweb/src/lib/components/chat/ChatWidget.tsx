import React from 'react';
import { ChatPropsContext } from '../../context';
import 'font-awesome/css/font-awesome.min.css';
import { Constants } from '../../config';
import {ChatMainStateContextProvider} from '../../context';

import { Chat } from './Chat';
import { Env } from '@pushprotocol/restapi';
import { pCAIP10ToWallet,  } from '../../helpers';
import { PushTabs, PUSH_TABS } from '../../types';

export type ChatProps = {
  account: string;
  decryptedPgpPvtKey: string; //have to make it optional for new users
  activeTab?:PushTabs,
  activeChat?:string,
  env?: Env;
};

//make changes for users who dont have decryptedPgpPvtKey

export const ChatWidget: React.FC<ChatProps> = ({
  account,
  decryptedPgpPvtKey = null,
  activeTab = PUSH_TABS.CHATS,
  activeChat = null,
  env = Constants.ENV.PROD,
}) => {

  const chatPropsData = {
    account:pCAIP10ToWallet(account),
    decryptedPgpPvtKey,
    activeChosenTab:activeTab,
    activeChat:activeChat,
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



