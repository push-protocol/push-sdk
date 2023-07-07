import React from 'react';

import { ISpaceBannerProps, SpaceBanner } from './SpaceBanner';
import { SpaceWidget } from './SpaceWidget';
import { ISpaceFeedProps, SpaceFeed } from './SpaceFeed';
import { ISpaceInvitesProps, SpaceInvites } from './SpaceInvites';
import { SpaceCreationWidget } from './SpaceCreationWidget';

import { SignerType } from '../../types';
import { ENV } from '../../config';
import { useSpaceData } from '../../hooks';
import { ISpacesUIProps, ISpaceWidgetProps } from './exportedTypes';

export class SpacesUI {
  public account: string;
  public signer: SignerType;
  public pgpPrivateKey: string;
  public env: ENV;

  constructor(props: ISpacesUIProps) {
    this.account = props.account;
    this.signer = props.signer;
    this.pgpPrivateKey = props.pgpPrivateKey;
    this.env = props.env;
  }

  SpaceBanner: React.FC<ISpaceBannerProps> = (options: ISpaceBannerProps) => {
    const { spaceInfo, setSpaceInfo } = useSpaceData();

    // Use spaceBannerData and setSpaceBannerData in your component

    return <SpaceBanner {...options} />;
  };

  SpaceWidget: React.FC<ISpaceWidgetProps> = (options: ISpaceWidgetProps) => {
    return <SpaceWidget {...options} />
  }

  SpaceFeed: React.FC<ISpaceFeedProps> = (options: ISpaceFeedProps) => {
    return <SpaceFeed {...options} />;
  };

  SpaceInvites: React.FC<ISpaceInvitesProps> = (options: ISpaceInvitesProps) => {
    return <SpaceInvites {...options} />;
  };

  SpaceCreationButtonWidget = () => {
    return <SpaceCreationWidget />
  }

  connectToSockets = () => {
    // Connect to sockets and listen for events
    // Update spaceBannerData or trendingListData based on events
    const { setSpaceInfo, setTrendingListData } = useSpaceData();

    // Example of updating spaceBannerData
    //setSpaceBannerData();
  };

  init = () => {
    // Initialization logic

    // Call connectToSockets or any other initialization tasks
    this.connectToSockets();
  };
}
