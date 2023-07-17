import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { LiveWidgetContent } from './LiveWidgetContent';
import { ScheduledWidgetContent } from './ScheduledWidgetContent';
import { SpaceDTO } from '@pushprotocol/restapi';
import { useSpaceData } from '../../../hooks';
import { ShareConfig } from '../exportedTypes';

const LIVE_WIDGET_CONTENT_FIXED_HEIGHT = '485px';
const SCHEDULED_WIDGET_CONTENT_FIXED_HEIGHT = '350px';

interface WidgetContentProps {
  account?: string; //Temp Prop to Test Host functionality
  spaceData?: SpaceDTO;
  share?: ShareConfig;
  isMinimized: boolean;

  // temp props only for testing demo purpose for now
  isHost?: boolean;
  isLive: boolean;
  isTimeToStartSpace?: boolean;
  isMember?: boolean;
}
export const WidgetContent: React.FC<WidgetContentProps> = ({
  account,
  spaceData,
  share,
  isHost,
  isTimeToStartSpace,
  isMember,
  isMinimized,
  isLive,
}: WidgetContentProps) => {
  // const { isLive } = useSpaceData();
  console.log('isLiveInWidgetContent', isLive);
  const [isSpaceLive, setIsSpaceLive] = useState<boolean>(false);
  console.log('isSpaceLive', isSpaceLive);

  console.log('Rendering WidgetContent');
  useEffect(() => {
    setIsSpaceLive(isLive);
  }, [isLive]);

  return (
    <Container
      isMinimized={isMinimized}
      height={
        isSpaceLive
          ? LIVE_WIDGET_CONTENT_FIXED_HEIGHT
          : SCHEDULED_WIDGET_CONTENT_FIXED_HEIGHT
      }
    >
      {isSpaceLive ? (
        <LiveWidgetContent spaceData={spaceData} isHost={isHost} />
      ) : (
        <ScheduledWidgetContent
          spaceData={spaceData}
          share={share}
          isHost={isHost}
          isMember={isMember}
          isTimeToStartSpace={isTimeToStartSpace}
          isSpaceLive={isSpaceLive}
          setIsSpaceLive={setIsSpaceLive}
        />
      )}
    </Container>
  );
};

//styles
const Container = styled.div<{ height: string; isMinimized: boolean }>`
  display: flex;
  flex-direction: column;
  border-bottom: ${(props) => props.theme.border};

  height: ${(props) => (props.isMinimized ? '0' : props.height)};
  transition: height 300ms ease-out;
  overflow: hidden;

  align-items: center;
  justify-content: space-between;
`;
