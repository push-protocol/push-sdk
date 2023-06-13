import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { WidgetContent } from './WidgetContent';
import { WidgetHeader } from './WidgetHeader';
import * as PushAPI from '@pushprotocol/restapi';
import { SpaceDTO } from '@pushprotocol/restapi';
import { ENV } from '../../../config';

export interface ISpaceWidgetProps {
  // Add props specific to the SpaceWidget component
  bottomOffset?: number;
  rightOffset?: number;
  spaceId?: string;
}

const DEFAULT_OFFSET = 16;

export const SpaceWidget: React.FC<ISpaceWidgetProps> = (options: ISpaceWidgetProps) => {
  const {
    bottomOffset = DEFAULT_OFFSET,
    rightOffset = DEFAULT_OFFSET, 
    spaceId
  } = options || {};
  const [widgetHidden, setWidgetHidden] = useState(!spaceId);
  const [spaceData, setSpaceData] = useState<SpaceDTO>();

  useEffect(() => {
    // Call the API when spaceId changes
    (async function () {
      if (spaceId) {
        try {
          // Perform your API call here and update the apiResult state
          const response = await PushAPI.space.get({
            spaceId: spaceId,
            env: ENV.DEV
          });
          console.log(response);
          setSpaceData(response);
        } catch (error) {
          console.log('Error fetching API:', error);
        }
      }
    })();
  }, [spaceId]);

  const toggleWidgetVisibility = () => {
    setWidgetHidden(!widgetHidden);
  };

  // Implement the SpaceWidget component
  return (
    <Container bottomOffset={bottomOffset} rightOffset={rightOffset} hidden={widgetHidden}>
      <WidgetHeader />
      <WidgetContent />
    </Container>
  );
}

interface WidgetContainerProps {
  bottomOffset: number;
  rightOffset: number;
  hidden: boolean;
}
const Container = styled.div<WidgetContainerProps>`
  font-family: 'Strawford'; // update to fontFamily theme 
  border-radius: 12px; // update acc to theme
  border: 1px solid #3F3F46; // update acc to theme
  display: flex;
  flex-direction: column;
  width: 400px;
  max-width: 400px;
  height: 500px;
  background: blue;
  justify-content: flex-start;
  position: fixed;
  bottom: ${props => props.bottomOffset}px;
  right: ${props => props.rightOffset}px;
  visibility: ${props => (props.hidden ? 'hidden' : 'visible')};
  opacity: ${props => (props.hidden ? 0 : 1)};
  transition: opacity 0.3s ease;
`;