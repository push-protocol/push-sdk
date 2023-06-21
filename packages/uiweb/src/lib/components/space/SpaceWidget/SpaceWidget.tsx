import React, { useState } from 'react';
import styled from 'styled-components';

import { WidgetContent } from './WidgetContent';
import { WidgetHeader } from './WidgetHeader';
import { SpaceDTO } from '@pushprotocol/restapi';

import { ENV } from '../../../config';
import { ISpaceWidgetProps } from '../exportedTypes';

export interface ISpaceWidgetComponentProps extends ISpaceWidgetProps{
  env: ENV;
}

const DEFAULT_OFFSET = 16;
const DEFAULT_MAXWIDTH = 415;

export const SpaceWidget: React.FC<ISpaceWidgetComponentProps> = (options: ISpaceWidgetComponentProps) => {
  const {
    bottomOffset = DEFAULT_OFFSET,
    rightOffset = DEFAULT_OFFSET,
    width,
    zIndex = 1000,
    env, 
    spaceId,
    shareUrl,
    onClose = () => { /* */ }, // Assign an empty function as default

    isHost, isLive, isJoined, isMember, isTimeToStartSpace
  } = options || {};
  const [widgetHidden, setWidgetHidden] = useState(!spaceId);
  const [spaceData, setSpaceData] = useState<SpaceDTO>(); // use hook in banner's pr to get spaceData from context
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  const toggleWidgetVisibility = () => {
    setWidgetHidden(!widgetHidden);
  };

  // Implement the SpaceWidget component
  return (
    <Container bottomOffset={bottomOffset} rightOffset={rightOffset} hidden={widgetHidden} width={width} zIndex={zIndex}>
      <WidgetHeader 
        onClose={onClose} 
        isMinimized={isMinimized} 
        setIsMinimized={setIsMinimized} 
        toggleWidgetVisibility={toggleWidgetVisibility} 
        isHost={isHost}
        isLive={isLive}
      />
      {!isMinimized &&
        <WidgetContent 
          shareUrl={shareUrl}
          isHost={isHost}
          isLive={isLive}
          isJoined={isJoined}
          isMember={isMember}
          isTimeToStartSpace={isTimeToStartSpace}
        />
      }
    </Container>
  );
}

interface WidgetContainerProps {
  bottomOffset: number;
  rightOffset: number;
  width?: number;
  zIndex?: number;
  hidden: boolean;
}
const Container = styled.div<WidgetContainerProps>`
  font-family: 'Strawford'; // update to fontFamily theme 
  border-radius: 12px; // update acc to theme
  border: 1px solid #DCDCDF; // update acc to theme
  display: flex;
  flex-direction: column;
  width: ${props => props.width ? `${props.width}px` : 'auto'};
  max-width: ${props => props.width ? `${props.width}px` : `${DEFAULT_MAXWIDTH}px`};
  min-width: 320px;
  background: white;
  justify-content: flex-start;
  position: fixed;
  bottom: ${props => props.bottomOffset}px;
  right: ${props => props.rightOffset}px;
  visibility: ${props => (props.hidden ? 'hidden' : 'visible')};
  opacity: ${props => (props.hidden ? 0 : 1)};
  transition: opacity 0.3s ease;
  z-index: ${props => (props.zIndex ?? '1000')};
  overflow:hidden;
`;
