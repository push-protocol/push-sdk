import React from 'react';
import { usePushSpaceSocket, useSpaceData, useSpaceNotificationSocket } from '../hooks';

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
    connectSpaceRequest
  } = useSpaceData();
  
  useSpaceNotificationSocket({
    account,
    env,
    acceptSpaceRequest,
    connectSpaceRequest,
  });

  usePushSpaceSocket({ account, env });

  return (
    <div>
      {children}
    </div>
  );
};
