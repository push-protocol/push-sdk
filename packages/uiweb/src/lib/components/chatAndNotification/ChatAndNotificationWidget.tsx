import React from 'react';
import { ChatAndNotificationPropsContext, NotificationMainStateContextProvider } from '../../context';
import 'font-awesome/css/font-awesome.min.css';
import { Constants } from '../../config';
import { ChatMainStateContextProvider } from '../../context';

import { ChatAndNotification } from './ChatAndNotification';
import type { Env, SignerType } from '@pushprotocol/restapi';
import { pCAIP10ToWallet, } from '../../helpers';
import type { PushTabs } from '../../types';
import { PUSH_TABS } from '../../types';
import type { WithRequiredProperty } from '../../utilities';
import MainContextProvider from '../../context/chatAndNotification/chatAndNotificationMainContext';

export type ChatAndNotificationProps = {
  account: string;
  decryptedPgpPvtKey: string; //have to make it optional for new users
  activeTab?: PushTabs,
  activeChat?: string,
  onClose?: () => void,
  signer?: WithRequiredProperty<SignerType, '_signTypedData'>
  env?: Env;
};

//make changes for users who dont have decryptedPgpPvtKey
export const ChatAndNotificationWidget: React.FC<ChatAndNotificationProps> = ({
  account,
  decryptedPgpPvtKey = null,
  activeTab = PUSH_TABS.CHATS,
  activeChat = null,
  onClose = null,
  signer = null,
  env = Constants.ENV.PROD,
}) => {

  const chatAndNotificationPropsData = {
    account: pCAIP10ToWallet(account),
    decryptedPgpPvtKey,
    activeChosenTab: activeTab,
    activeChat: activeChat,
    onClose,
    signer,
    env,
  };

  return (

    <ChatAndNotificationPropsContext.Provider value={chatAndNotificationPropsData}>
      <MainContextProvider>
        <ChatMainStateContextProvider>
          <NotificationMainStateContextProvider>
            <ChatAndNotification />
          </NotificationMainStateContextProvider>
        </ChatMainStateContextProvider>
      </MainContextProvider>
    </ChatAndNotificationPropsContext.Provider>
  );
};

//styles



