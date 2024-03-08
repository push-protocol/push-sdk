import React, { useEffect, useState } from 'react';

import { ISpaceBannerProps, SpaceBanner } from './SpaceBanner';
import { SpaceWidget } from './SpaceWidget';
import { ISpaceFeedProps, SpaceFeed } from './SpaceFeed';
import { ISpaceInvitesProps, SpaceInvites } from './SpaceInvites';
import { ISpaceCreateWidgetProps, SpaceCreationWidget } from './SpaceCreationWidget';
import { ICustomSearchResult } from './SpaceCreationWidget/SCWInviteModal';

import { SignerType } from '../../types';
import { ENV } from '../../config';
import { useSpaceData } from '../../hooks';
import { ISpacesUIProps, ISpaceWidgetProps } from './exportedTypes';

export class SpacesUI {
  public account: string;
  public signer: SignerType | undefined;
  public pgpPrivateKey: string;
  public env: ENV;
  public customSearch: ICustomSearchResult | undefined;

  constructor(props: ISpacesUIProps) {
    this.account = props.account;
    this.signer = props.signer;
    this.pgpPrivateKey = props.pgpPrivateKey;
    this.env = props.env;
    this.customSearch = props.customSearch;
  }

  SpaceBanner: React.FC<ISpaceBannerProps> = (options: ISpaceBannerProps) => {
    const { spaceInfo, setSpaceInfo } = useSpaceData();

    // Use spaceBannerData and setSpaceBannerData in your component

    return <SpaceBanner {...options} />;
  };

  SpaceWidget: React.FC<ISpaceWidgetProps> = (options: ISpaceWidgetProps) => {
    const { spaceId } = options;
    const { spaceWidgetId } = useSpaceData();
    const [SpaceId, setSpaceId] = useState<string | undefined>(spaceId);

    useEffect(() => {
      setSpaceId(spaceId);
    }, [spaceId, setSpaceId]);

    useEffect(() => {
      if (spaceWidgetId) setSpaceId(spaceWidgetId);
    }, [spaceWidgetId]);

    return <SpaceWidget {...options} spaceId={SpaceId} />;
  }

  SpaceFeed: React.FC<ISpaceFeedProps> = (options: ISpaceFeedProps) => {
    return <SpaceFeed {...options} />;
  };

  SpaceInvites: React.FC<ISpaceInvitesProps> = (options: ISpaceInvitesProps) => {
    return <SpaceInvites {...options} />;
  };

  SpaceCreationButtonWidget = (options: ISpaceCreateWidgetProps) => {
    return <SpaceCreationWidget  {...options} />
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
