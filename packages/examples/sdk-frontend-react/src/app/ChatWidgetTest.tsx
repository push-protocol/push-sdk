import React, { useContext, useEffect, useState } from 'react';
import { ChatAndNotificationWidget, PUSH_TABS } from '@pushprotocol/uiweb';
import { EnvContext, Web3Context } from './context';
import * as PushAPI from '@pushprotocol/restapi';
import { IUser } from '@pushprotocol/restapi';

export const ChatWidgetTest = () => {
  const { account, library } = useContext<any>(Web3Context);
  const librarySigner = library.getSigner();
  const [pvtKey, setPvtKey] = useState<string>('');
  const { env } = useContext<any>(EnvContext);

  useEffect(() => {
    (async () => {
      const user = await PushAPI.user.get({ account: account, env });
      const pvtkey = null;
      if (user?.encryptedPrivateKey) {
        const response = await PushAPI.chat.decryptPGPKey({
          encryptedPGPPrivateKey: (user as IUser).encryptedPrivateKey,
          account: account,
          signer: librarySigner,
          env,
          toUpgrade: true,
        });
        setPvtKey(response);
      }
    })();
  }, [account, env]);
  const onClose = () => {
    console.log('in here widget');
  };


  return (

    <>
      <ChatAndNotificationWidget
        account={account}
        env={env}
        decryptedPgpPvtKey={pvtKey}
        signer={librarySigner}
        // activeTab={PUSH_TABS.APP_NOTIFICATIONS}
        activeChat="0x3Cf13f6d91F50dca6eAD7356b78482c54CDd95ff"
      />
    </>

  );
};
