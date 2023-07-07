import React from 'react';

import { ISpaceBannerProps, SpaceBanner } from './SpaceBanner';
import { SpaceWidget } from './SpaceWidget';
import { ISpaceFeedProps, SpaceFeed } from './SpaceFeed';
import { SpaceCreationWidget } from './SpaceCreationWidget';

import { SignerType } from '../../types';
import { ENV } from '../../config';
import { ISpacesUIProps, ISpaceWidgetProps } from './exportedTypes';

export type ProfileCustomizationFunction = (account: string) => Promise<{
  name?: string;
  image?: string;
  handle?: string;
}>;

export class SpacesUI {
  public account: string;
  public signer: SignerType;
  public pgpPrivateKey: string;
  public env: ENV;
  public customizeProfile: ProfileCustomizationFunction;

  constructor(props: ISpacesUIProps) {
    this.account = props.account;
    this.signer = props.signer;
    this.pgpPrivateKey = props.pgpPrivateKey;
    this.env = props.env;
    this.customizeProfile = props.customizeProfile || ((account) => Promise.resolve({}));
  }

  SpaceBanner: React.FC<ISpaceBannerProps> = (options: ISpaceBannerProps) => {
    return <SpaceBanner {...options} />;
  };

  SpaceWidget: React.FC<ISpaceWidgetProps> = (options: ISpaceWidgetProps) => {
    return <SpaceWidget {...options} />
  }

  SpaceFeed: React.FC<ISpaceFeedProps> = (options: ISpaceFeedProps) => {
    return <SpaceFeed {...options} />;
  };


  SpaceCreationButtonWidget = () => {
    return <SpaceCreationWidget />
  }

  connectToSockets = () => {
    // Connect to sockets and listen for events
    // Update spaceBannerData or trendingListData based on events

    // Example of updating spaceBannerData
    //setSpaceBannerData();
  };

  init = () => {
    // Initialization logic

    // Call connectToSockets or any other initialization tasks
    this.connectToSockets();
  };
}
