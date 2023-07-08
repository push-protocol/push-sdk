import {
  ISpaceFeedProps,
  ISpaceBannerProps,
  ISpaceWidgetProps,
  ISpaceCreateWidgetProps,
  SpacesUI,
  ISpaceInvitesProps,
} from '@pushprotocol/uiweb';
import React, { useContext, useEffect, useState } from 'react';
import { EnvContext, Web3Context } from '../context';
import * as PushAPI from '@pushprotocol/restapi';

export interface IUseSpaceReturnValues {
  spaceUI: SpacesUI;
  SpaceInvitesComponent: React.FC<ISpaceInvitesProps>;
  SpaceWidgetComponent: React.FC<ISpaceWidgetProps>;
  SpaceFeedComponent: React.FC<ISpaceFeedProps>;
  SpaceBannerComponent: React.FC<ISpaceBannerProps>;
  CreateSpaceComponent: React.FC<ISpaceCreateWidgetProps>;
}

export const useSpaceComponents = (): IUseSpaceReturnValues => {
  const { account, library } = useContext<any>(Web3Context);
  const { env } = useContext<any>(EnvContext);
  const librarySigner = library.getSigner();

  const [pgpPrivateKey, setPgpPrivateKey] = useState('');

  const spaceUI = new SpacesUI({
    account: account,
    signer: librarySigner,
    pgpPrivateKey: pgpPrivateKey,
    env: env,
  });

  useEffect(() => {
    (async () => {
      if (!account || !env || !library) return;

      const user = await PushAPI.user.get({ account, env });
      let pgpPrivateKey;
      const librarySigner = await library.getSigner(account);
      if (user?.encryptedPrivateKey) {
        pgpPrivateKey = await PushAPI.chat.decryptPGPKey({
          encryptedPGPPrivateKey: user.encryptedPrivateKey,
          account,
          signer: librarySigner,
          env,
        });
      }

      setPgpPrivateKey(pgpPrivateKey);
    })();
  }, [account, env, library]);

  return {
    spaceUI,
    SpaceInvitesComponent: spaceUI.SpaceInvites,
    SpaceWidgetComponent: spaceUI.SpaceWidget,
    SpaceBannerComponent: spaceUI.SpaceBanner,
    SpaceFeedComponent: spaceUI.SpaceFeed,
    CreateSpaceComponent: spaceUI.SpaceCreationButtonWidget,
  };
};
