import {
  ISpaceFeedProps,
  ISpaceBannerProps,
  ISpaceWidgetProps,
  ISpaceCreateWidgetProps,
  SpacesUI,
  ISpaceInvitesProps,
} from '@pushprotocol/uiweb';
import React, { useContext } from 'react';
import { AccountContext, EnvContext, Web3Context } from '../context';

export interface IUseSpaceReturnValues {
  SpaceInvitesComponent: React.FC<ISpaceInvitesProps>;
  SpaceWidgetComponent: React.FC<ISpaceWidgetProps>;
  SpaceFeedComponent: React.FC<ISpaceFeedProps>;
  SpaceBannerComponent: React.FC<ISpaceBannerProps>;
  CreateSpaceComponent: React.FC<ISpaceCreateWidgetProps>;
}

export const useSpaceComponents = (): IUseSpaceReturnValues => {
  const { account, library } = useContext<any>(Web3Context);
  const { env } = useContext<any>(EnvContext);
  const { pgpPrivateKey } = useContext<any>(AccountContext);
  const librarySigner = library?.getSigner();

  const spaceUI = new SpacesUI({
    account: account as string,
    signer: librarySigner,
    pgpPrivateKey: pgpPrivateKey,
    env: env,
  });

  return {
    SpaceInvitesComponent: spaceUI.SpaceInvites,
    SpaceWidgetComponent: spaceUI.SpaceWidget,
    SpaceBannerComponent: spaceUI.SpaceBanner,
    SpaceFeedComponent: spaceUI.SpaceFeed,
    CreateSpaceComponent: spaceUI.SpaceCreationButtonWidget,
  };
};
