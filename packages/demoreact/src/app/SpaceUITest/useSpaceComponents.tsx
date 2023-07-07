import {
  ISpaceFeedProps,
  ISpaceBannerProps,
  ISpaceWidgetProps,
  ISpaceCreateWidgetProps,
  SpacesUI,
} from '@pushprotocol/uiweb';
import React, { useContext } from 'react';
import { EnvContext, Web3Context } from '../context';

export interface IUseSpaceReturnValues {
  spaceUI: SpacesUI;
  SpaceWidgetComponent: React.FC<ISpaceWidgetProps>;
  SpaceFeedComponent: React.FC<ISpaceFeedProps>;
  SpaceBannerComponent: React.FC<ISpaceBannerProps>;
  CreateSpaceComponent: React.FC<ISpaceCreateWidgetProps>;
}

export const useSpaceComponents = (): IUseSpaceReturnValues => {
  const { account, library } = useContext<any>(Web3Context);
  const librarySigner = library.getSigner();
  const { env } = useContext<any>(EnvContext);

  const spaceUI = new SpacesUI({
    account: account,
    signer: librarySigner,
    pgpPrivateKey: 'random pvt key',
    env: env,
  });

  return {
    spaceUI,
    SpaceWidgetComponent: spaceUI.SpaceWidget,
    SpaceBannerComponent: spaceUI.SpaceBanner,
    SpaceFeedComponent: spaceUI.SpaceFeed,
    CreateSpaceComponent: spaceUI.SpaceCreationButtonWidget,
  };
};
