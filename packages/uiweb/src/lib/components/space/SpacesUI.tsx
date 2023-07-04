import React from 'react';

import { ISpaceBannerProps, SpaceBanner } from './SpaceBanner';
import { SpaceWidget } from './SpaceWidget';
import { ISpaceFeedProps, SpaceFeed } from './SpaceFeed';
import { ISpaceTrendingListProps, SpaceTrendingList } from './SpaceTrendingList';
import { SpaceCreationWidget } from './SpaceCreationWidget';

import { SignerType } from '../../types';
import { ENV } from '../../config';
import { useSpaceData } from '../../hooks';
import { ISpacesUIProps, ISpaceWidgetProps } from './exportedTypes';

export class SpacesUI {
  private account: string;
  private signer: SignerType;
  private pgpPrivateKey: string;
  private env: ENV;

  constructor(props: ISpacesUIProps) {
    this.account = props.account;
    this.signer = props.signer;
    this.pgpPrivateKey = props.pgpPrivateKey;
    this.env = props.env;
  }

  SpaceBanner: React.FC<ISpaceBannerProps> = (options : ISpaceBannerProps) => {
    const { spaceInfo, setSpaceInfo } = useSpaceData();

    // Use spaceBannerData and setSpaceBannerData in your component

    return <SpaceBanner {...options} />;
  }

  SpaceWidget: React.FC<ISpaceWidgetProps> = (options: ISpaceWidgetProps) => {
    return <SpaceWidget {...options} />
  }

  SpaceFeed: React.FC<ISpaceFeedProps> = () => {
    return <SpaceFeed />;
  }

  SpaceTrendingList: React.FC<ISpaceTrendingListProps> = () => {
    const { trendingListData, setTrendingListData } = useSpaceData();

    // Use trendingListData and setTrendingListData in your component

    return <SpaceTrendingList />;
  }

  SpaceCreationButtonWidget = () => {
    return <SpaceCreationWidget />
  }

  connectToSockets = () => {
    // Connect to sockets and listen for events
    // Update spaceBannerData or trendingListData based on events
    const { setSpaceInfo, setTrendingListData } = useSpaceData();

    // Example of updating spaceBannerData
    //setSpaceBannerData();
  }

  init = () => {
    // Initialization logic
    const { setAccount, setSigner, setPgpPrivateKey, setEnv } = useSpaceData();
    setAccount(this.account);
    setSigner(this.signer);
    setPgpPrivateKey(this.pgpPrivateKey);
    setEnv(this.env);

    // Call connectToSockets or any other initialization tasks
    this.connectToSockets();
  }
}
