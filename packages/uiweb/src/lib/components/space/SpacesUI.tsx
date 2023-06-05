import React from 'react';

import SpaceBanner, { SpaceBannerProps } from './SpaceBanner';
import SpaceFeed, { SpaceFeedProps } from './SpaceFeed';
import SpaceWidget, { SpaceWidgetProps } from './SpaceWidget';
import SpaceTrendingList, { SpaceTrendingListProps } from './SpaceTrendingList';

import { useSpaceData } from '../../context';
import { SignerType } from '../../types';
import { ENV } from '../../config';

interface ISpacesUIProps {
  account: string;
  signer: SignerType;
  pgpPrivateKey: string;
  env: ENV;
}

class SpacesUI {
  private account: string;
  private signer: SignerType;
  private pgpPrivateKey: string;
  private env: ENV;

  constructor(props: SpacesUIProps) {
    this.account = props.account;
    this.signer = props.signer;
    this.pgpPrivateKey = props.pgpPrivateKey;
    this.env = props.env;
  }

  SpaceBanner: React.FC<SpaceBannerProps> = () => {
    const { spaceBannerData, setSpaceBannerData } = useSpaceData();

    // Use spaceBannerData and setSpaceBannerData in your component

    return <SpaceBanner />;
  }

  SpaceWidget: React.FC<SpaceWidgetProps> = () => {
    return <SpaceWidget />;
  }

  SpaceFeed: React.FC<SpaceFeedProps> = () => {
    return <SpaceFeed />;
  }

  SpaceTrendingList: React.FC<SpaceTrendingListProps> = () => {
    const { trendingListData, setTrendingListData } = useSpaceData();

    // Use trendingListData and setTrendingListData in your component

    return <SpaceTrendingList />;
  }

  connectToSockets = () => {
    // Connect to sockets and listen for events
    // Update spaceBannerData or trendingListData based on events
    const { setSpaceBannerData, setTrendingListData } = useSpaceData();

    // Example of updating spaceBannerData
    //setSpaceBannerData();
  }

  init = () => {
    // Initialization logic
    // Call connectToSockets or any other initialization tasks
    this.connectToSockets();
  }
}

export default SpacesUI;
