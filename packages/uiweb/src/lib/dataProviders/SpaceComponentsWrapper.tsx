/* eslint-disable react/jsx-no-useless-fragment */
import React from 'react';
import {
  usePushSpaceSocket,
  useSpaceData,
  useSpaceNotificationSocket,
} from '../hooks';

export interface ISpacesComponentsWrapperProps {
  children: React.ReactNode;
}

export const SpaceComponentWrapper = ({
  children,
}: ISpacesComponentsWrapperProps) => {
  const {
    account,
    env,
    acceptSpaceRequest,
    connectSpaceRequest,
    broadcastRaisedHand,
  } = useSpaceData();

  useSpaceNotificationSocket({
    account,
    env,
    acceptSpaceRequest,
    connectSpaceRequest,
    broadcastRaisedHand,
  });

  usePushSpaceSocket({ account, env });

  return <>{children}</>;
};
