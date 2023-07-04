import React from 'react';
import styled from 'styled-components';

import { ISpacesTheme } from '../theme';
import { ThemeContext } from '../theme/ThemeProvider';
import { getDateAndTime } from '../helpers/date';
import { getSpaceStatus } from '../helpers/space';
import { ParticipantContainer } from '../reusables/ParticipantContainer';
import { HostPfpContainer } from '../reusables';

import live from './../../../icons/live.svg';
import scheduled from './../../../icons/scheduled.svg';
import { useGetSpaceInfo } from './../../../hooks';

export interface ISpaceBannerProps {
  spaceId: string;
  orientation?: 'maximized' | 'minimized' | 'pill';
  onBannerClick?: (arg: string) => void;
}

/**
 * @interface IThemeProps
 * this interface is used for defining the props for styled components
 */
interface IThemeProps {
  theme?: ISpacesTheme;
  orientation?: string;
  status?: string;
  clickable?: boolean;
}

export const SpaceBanner: React.FC<ISpaceBannerProps> = ({
  spaceId,
  orientation,
  onBannerClick,
}) => {
  const theme = React.useContext(ThemeContext);
  const spaceData = useGetSpaceInfo(spaceId);

  const handleClick = () => {
    if (onBannerClick) {
      onBannerClick(spaceData?.spaceId || '');
    }
  };

  return (
    <Container
      orientation={orientation}
      status={getSpaceStatus(spaceData?.status)}
      theme={theme}
    >
      {orientation === 'maximized' && (
        <HostPfpContainer
          name={spaceData?.members[0].wallet.slice(7)}
          statusTheme={getSpaceStatus(spaceData?.status)}
          imageHeight={'48px'}
          imageUrl={spaceData?.members[0].image}
          handle={spaceData?.members[0].wallet.slice(7)}
        />
      )}
      {orientation === 'maximized' ? null : (
        <Icon
          src={
            getSpaceStatus(spaceData?.status) === 'Live'
              ? live
              : getSpaceStatus(spaceData?.status) === 'Scheduled'
              ? scheduled
              : '' // Ended
          }
          alt="status"
        />
      )}
      <Title orientation={orientation}>
        {orientation === 'pill'
          ? `${spaceData?.spaceName.slice(0, 20)}...`
          : spaceData?.spaceName}
      </Title>
      <Status orientation={orientation}>
        <Time orientation={orientation}>
          <TimeText>
            {getSpaceStatus(spaceData?.status) === 'Live'
              ? 'Live'
              : getSpaceStatus(spaceData?.status) === 'Scheduled'
              ? `${getDateAndTime(spaceData?.scheduleAt as Date)}`
              : 'Ended'}
          </TimeText>
        </Time>
        <ParticipantContainer
          participants={spaceData?.pendingMembers as []}
          orientation={orientation}
        />
      </Status>
    </Container>
  );
};

// Styling
const Container = styled.div<IThemeProps>`
  display: flex;
  flex-direction: ${(props) =>
    props.orientation === 'maximized' ? 'column' : 'row'};
  justify-content: ${(props) =>
    props.orientation === 'maximized' ? 'space-between' : 'space-between'};
  align-items: ${(props) =>
    props.orientation === 'maximized' ? 'flex-start' : 'center'};
  padding: ${(props) =>
    props.orientation === 'maximized'
      ? '16px'
      : props.orientation === 'minimized'
      ? '0 20px'
      : '0 11px'};
  gap: ${(props) => (props.orientation === 'maximized' ? '16px' : '8px')};
  width: ${(props) =>
    props.orientation === 'maximized'
      ? 'inherit'
      : props.orientation === 'minimized'
      ? 'inherit'
      : 'fit-content'};
  height: ${(props) =>
    props.orientation === 'maximized'
      ? 'auto'
      : props.orientation === 'minimized'
      ? '40px'
      : '63px'};
  background: ${(props) =>
    props.status === 'Live'
      ? props.theme.titleBg
      : props.theme.bgColorSecondary};
  border-radius: ${(props) =>
    props.orientation === 'maximized'
      ? '17px'
      : props.orientation === 'minimized'
      ? '12px'
      : '24px'};
  color: ${(props) => (props.status === 'Live' ? '#f5f5f5' : '#1E1E1E')};
  min-width: 0;
  text-overflow: ellipsis;
  overflow: hidden;
  cursor: ${(props) => props.clickable && 'pointer'};
}`;

const Title = styled.div<{ orientation?: string }>`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  font-family: Strawford;
  font-weight: ${(props) =>
    props.orientation === 'maximized' ? '700' : '500'};
  font-size: ${(props) =>
    props.orientation === 'maximized'
      ? '20px'
      : props.orientation === 'minimized'
      ? '16px'
      : '12px'};
  line-height: 130%;
  width: 90%;
  line-clamp: ${(props) => (props.orientation === 'maximized' ? '3' : '2')};

  @media (max-width: 425px) {
    width: 95%;
  }
}`;

const Status = styled.div<IThemeProps>`
  display: flex;
  flex-direction: row;
  width: ${(props) =>
    props.orientation === 'maximized' ? '100%' : 'fit-content'};
  justify-content: space-between;
  align-items: center;
}`;

const Time = styled.div<{ orientation?: string }>`
  display: ${(props) => (props.orientation === 'maximized' ? 'flex' : 'none')};
  flex-direction: row;
  justify-content: center;
  align-items: center;
}`;

const Icon = styled.img`
  height: 24px;
  width: 24px;
  padding: 0 11px 0 0;
  align-self: center;
}`;

const TimeText = styled.div<{ status?: string }>`
  font-weight: 500;
  font-size: 14px;
  line-height: 150%;
  color: ${(props) => (props.status === 'live' ? 'inherit' : '#71717A')};
}`;
