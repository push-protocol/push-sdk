import {
  ISpaceFeedProps,
  ISpaceBannerProps,
  ISpaceWidgetProps,
  ISpaceCreateWidgetProps,
  SpacesUI,
  ISpaceInvitesProps,
} from '@pushprotocol/uiweb';
import { useAccount, useNetwork, useSigner } from 'wagmi';
import React, { useContext, useEffect, useState } from 'react';
import { ENV } from '@pushprotocol/restapi/src/lib/constants';
import * as PushAPI from '@pushprotocol/restapi';
import { is } from 'date-fns/locale';

export interface IUseSpaceReturnValues {
  spaceUI: SpacesUI;
  SpaceInvitesComponent: React.FC<ISpaceInvitesProps>;
  SpaceWidgetComponent: React.FC<ISpaceWidgetProps>;
  SpaceFeedComponent: React.FC<ISpaceFeedProps>;
  SpaceBannerComponent: React.FC<ISpaceBannerProps>;
  CreateSpaceComponent: React.FC<ISpaceCreateWidgetProps>;
}

export const useSpaceComponents = (): IUseSpaceReturnValues => {
  const env = ENV.DEV;

  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { data: signer } = useSigner();

  const [pgpPrivateKey, setPgpPrivateKey] = useState('');

  console.log('address: ', address, isConnected);

  const spaceUI = new SpacesUI({
    account: address as string,
    signer: signer as PushAPI.SignerType,
    pgpPrivateKey: pgpPrivateKey,
    env: env,
  });

  useEffect(() => {
    (async () => {
      if (!signer || !address || !chain?.id) return;

      const user = await PushAPI.user.get({
        account: address,
        env,
      });
      let pgpPrivateKey = null;
      if (user?.encryptedPrivateKey) {
        pgpPrivateKey = await PushAPI.chat.decryptPGPKey({
          encryptedPGPPrivateKey: user.encryptedPrivateKey,
          account: address,
          signer,
          env,
        });
      }

      setPgpPrivateKey(pgpPrivateKey);
    })();
  }, [address, env, signer, chain]);

  return {
    spaceUI,
    SpaceInvitesComponent: spaceUI.SpaceInvites,
    SpaceWidgetComponent: spaceUI.SpaceWidget,
    SpaceBannerComponent: spaceUI.SpaceBanner,
    SpaceFeedComponent: spaceUI.SpaceFeed,
    CreateSpaceComponent: spaceUI.SpaceCreationButtonWidget,
  };
};
