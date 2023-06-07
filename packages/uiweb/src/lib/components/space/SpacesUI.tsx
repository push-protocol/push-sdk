import React, { createContext, useContext } from 'react';

import { ISpaceBannerProps, SpaceBanner } from './SpaceBanner';
import { ISpaceWidgetProps, SpaceWidget } from './SpaceWidget';
import { ISpaceFeedProps, SpaceFeed } from './SpaceFeed';
import { ISpaceTrendingListProps, SpaceTrendingList } from './SpaceTrendingList';

import { SignerType } from '../../types';
import { ENV } from '../../config';
import { initialSpaceDataContextValues, ISpaceDataContextValues } from '../../dataProviders';

export interface ISpacesUIProps {
  account: string;
  signer: SignerType;
  pgpPrivateKey: string;
  env: ENV;
}

const initialSpaceDataContext = createContext<ISpaceDataContextValues>(initialSpaceDataContextValues);

export class SpacesUI {
  private account: string;
  private signer: SignerType;
  private pgpPrivateKey: string;
  private env: ENV;
  private spaceDataContext: React.Context<ISpaceDataContextValues>; // Add SpaceDataContext property

  constructor(props: ISpacesUIProps) {
    this.account = props.account;
    this.signer = props.signer;
    this.pgpPrivateKey = props.pgpPrivateKey;
    this.env = props.env;
    this.spaceDataContext = initialSpaceDataContext;
  }

  SpaceBanner: React.FC<ISpaceBannerProps> = () => {
    const { spaceBannerData, setSpaceBannerData } = useContext(this.spaceDataContext);

    // Use spaceBannerData and setSpaceBannerData in your component

    return <SpaceBanner />;
  }

  SpaceWidget: React.FC<ISpaceWidgetProps> = () => {
    return <SpaceWidget />;
  }

  SpaceFeed: React.FC<ISpaceFeedProps> = () => {
    return <SpaceFeed />;
  }

  SpaceTrendingList: React.FC<ISpaceTrendingListProps> = () => {
    const { trendingListData, setTrendingListData } = useContext(this.spaceDataContext);

    // Use trendingListData and setTrendingListData in your component

    return <SpaceTrendingList />;
  }

  connectToSockets = () => {
    // Connect to sockets and listen for events
    // Update spaceBannerData or trendingListData based on events
    const { setSpaceBannerData, setTrendingListData } = useContext(this.spaceDataContext);

    // Example of updating spaceBannerData
    //setSpaceBannerData();
  }

  init = (spaceDataContext: React.Context<ISpaceDataContextValues>) => {
    this.spaceDataContext = spaceDataContext;
    // Initialization logic
    // Call connectToSockets or any other initialization tasks
    this.connectToSockets();
  }
}
