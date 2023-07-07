import React, { MouseEventHandler, useState } from 'react';
import styled from 'styled-components';

import { WidgetContent } from './WidgetContent';
import { WidgetHeader } from './WidgetHeader';

import { ISpaceWidgetProps } from '../exportedTypes';
import { useGetSpaceInfo, useSpaceData } from '../../../hooks';
import { isLiveSpace, isHostOfSpace, isMemberOfSpace } from './helpers/utils';
import { SpaceDTO } from '@pushprotocol/restapi';

const DEFAULT_OFFSET = 16;
const DEFAULT_MAXWIDTH = 415;

export const SpaceWidget: React.FC<ISpaceWidgetProps> = (
  options: ISpaceWidgetProps
) => {
  const {
    bottomOffset = DEFAULT_OFFSET,
    rightOffset = DEFAULT_OFFSET,
    account = '0x6e9FECae20313664f97d4429886860221cb29c7A',
    width,
    zIndex = 1000,
    spaceId,
    shareUrl,
    onClose = (() => {
      /** */
    }) as MouseEventHandler<HTMLDivElement>,
    isJoined,
    isTimeToStartSpace,
  } = options || {};
  const [widgetHidden, setWidgetHidden] = useState(!spaceId);

  // const [spaceData, setSpaceData] = useState<SpaceDTO>();
  const spaceData = useGetSpaceInfo(spaceId); // use hook in banner's pr to get spaceData from context
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  const isLive = isLiveSpace(spaceData as SpaceDTO);
  const isHost = isHostOfSpace(account, spaceData as SpaceDTO);
  const isMember = isMemberOfSpace(account, spaceData as SpaceDTO);

  const { env } = useSpaceData();

  const toggleWidgetVisibility = () => {
    setWidgetHidden(!widgetHidden);
  };

  // Implement the SpaceWidget component
  return (
    <Container
      bottomOffset={bottomOffset}
      rightOffset={rightOffset}
      hidden={widgetHidden}
      width={width}
      zIndex={zIndex}
    >
      <WidgetHeader
        onClose={onClose}
        isMinimized={isMinimized}
        setIsMinimized={setIsMinimized}
        toggleWidgetVisibility={toggleWidgetVisibility}
        isHost={isHost}
        isLive={isLive}
        spaceData={spaceData}
      />
      <WidgetContent
        account={account}
        spaceData={spaceData}
        shareUrl={shareUrl}
        isHost={isHost}
        isLive={isLive}
        isJoined={isJoined}
        isMember={isMember}
        isTimeToStartSpace={isTimeToStartSpace}
        isMinimized={isMinimized}
      />
    </Container>
  );
};

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
  border: 1px solid #dcdcdf; // update acc to theme
  display: flex;
  flex-direction: column;
  width: ${(props) => (props.width ? `${props.width}px` : 'auto')};
  max-width: ${(props) =>
    props.width ? `${props.width}px` : `${DEFAULT_MAXWIDTH}px`};
  min-width: 320px;
  background: white;
  justify-content: flex-start;
  position: fixed;
  bottom: ${(props) => props.bottomOffset}px;
  right: ${(props) => props.rightOffset}px;
  visibility: ${(props) => (props.hidden ? 'hidden' : 'visible')};
  opacity: ${(props) => (props.hidden ? 0 : 1)};
  transition: opacity 0.3s ease;
  z-index: ${(props) => props.zIndex ?? '1000'};
  overflow: hidden;
`;
