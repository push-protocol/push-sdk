import React from 'react';
import styled from 'styled-components';
import { LiveWidgetContent } from './LiveWidgetContent';
import { ScheduledWidgetContent } from './ScheduledWidgetContent';

const FIXED_HEIGHT = '485px';

interface WidgetContentProps {
  shareUrl?: string;

  // temp props only for testing demo purpose for now
  isHost?: boolean;
  isLive?: boolean;
  isJoined?: boolean;
  isTimeToStartSpace? :boolean;
  isMember?: boolean;
}
export const WidgetContent: React.FC<WidgetContentProps> = ({ shareUrl, isHost, isLive, isJoined, isTimeToStartSpace, isMember }: WidgetContentProps) => {
  return (
    <Container>
      {isLive
        ?
          <LiveWidgetContent 
            isHost={isHost}
            isJoined={isJoined}
          />
        :
          <ScheduledWidgetContent 
            shareUrl={shareUrl}
            isHost={isHost}
            isMember={isMember}
            isTimeToStartSpace={isTimeToStartSpace}
          />
      }
    </Container>
  );
};

//styles
const Container = styled.div`
  display: flex;
  flex-direction: column;
  border-bottom: ${(props) => props.theme.border};
  height: ${FIXED_HEIGHT};
  align-items: center;
  justify-content: space-between;
`;
