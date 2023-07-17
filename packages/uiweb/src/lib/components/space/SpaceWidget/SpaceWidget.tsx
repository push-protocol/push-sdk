import React, { MouseEventHandler, useEffect, useState } from 'react';
import styled from 'styled-components';
import { SpaceDTO } from '@pushprotocol/restapi';
import * as PushAPI from '@pushprotocol/restapi';

import { WidgetContent } from './WidgetContent';
import { WidgetHeader } from './WidgetHeader';

import { ISpaceWidgetProps } from '../exportedTypes';
import { isLiveSpace, isHostOfSpace, isMemberOfSpace } from './helpers/utils';

import { useSpaceData } from '../../../hooks';

const DEFAULT_OFFSET = 16;
const DEFAULT_MAXWIDTH = 415;

export const SpaceWidget: React.FC<ISpaceWidgetProps> = (
  options: ISpaceWidgetProps
) => {
  const {
    bottomOffset = DEFAULT_OFFSET,
    rightOffset = DEFAULT_OFFSET,
    width,
    zIndex = 1000,
    spaceId,
    share,
    onClose = (() => {
      /** */
    }) as MouseEventHandler<HTMLDivElement>,
    isTimeToStartSpace,
  } = options || {};
  const [widgetHidden, setWidgetHidden] = useState(!spaceId);
  const { account, spaceObjectData, initSpaceObject, env } = useSpaceData();

  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const { getSpaceInfo, setSpaceInfo } = useSpaceData();
  const [spaceData, setSpaceData] = useState<SpaceDTO | undefined>();

  const isLive = spaceData && spaceData?.status;
  // console.log('isLiveInWidget', isLive)

  useEffect(() => {
    if (!spaceId) {
      return;
    }
    setWidgetHidden(!spaceId);
    const fetchData = async () => {
      try {
        if (getSpaceInfo?.(spaceId)) {
          setSpaceData(getSpaceInfo(spaceId));
          return;
        }
        const response = await PushAPI.space.get({ spaceId, env });
        setSpaceInfo?.(spaceId, response);
        setSpaceData(response);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [spaceId]);

  // To Be Implemented Later via Meta messages.
  // useEffect(() => {
  //   (async () => {
  //     if (!spaceData) {
  //       return;
  //     }
  //     if (isLiveSpace(spaceData as SpaceDTO)) {
  //       await initSpaceObject(spaceData?.spaceId as string);
  //     }
  //   })();
  // }, [spaceData]);

  const isHost = isHostOfSpace(account, spaceData as SpaceDTO);
  const isMember = isMemberOfSpace(account, spaceData as SpaceDTO);

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
        share={share}
        isHost={isHost}
        isLive={isLive}
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
