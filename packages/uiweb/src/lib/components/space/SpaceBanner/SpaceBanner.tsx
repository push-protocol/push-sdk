import React from 'react';
import styled from 'styled-components';

import { ISpacesTheme } from '../theme';
import { ThemeContext } from '../theme/ThemeProvider';
import { getDateAndTime } from '../helpers/date';
import { getSpaceStatus } from '../helpers/space';
import { ParticipantContainer } from '../reusables/ParticipantContainer';

import live from './../../../icons/live.svg';
import scheduled from './../../../icons/scheduled.svg';
import { useSpaceData, useGetSpaceData } from './../../../hooks';

export interface ISpaceBannerProps {
  spaceId: string;
  orientation?: 'maximized' | 'minimized' | 'pill';
}

/**
 * @interface IThemeProps
 * this interface is used for defining the props for styled components
 */
interface IThemeProps {
  theme?: ISpacesTheme;
  orientation?: string;
  status?: string;
}

export const SpaceBanner: React.FC<ISpaceBannerProps> = ({
  spaceId,
  orientation,
}) => {

  const theme = React.useContext(ThemeContext);
  const {spaceBannerData} = useSpaceData();
  useGetSpaceData(spaceId);
  const spaceData = spaceBannerData?.[spaceId] // Fetches the space data from cache or from the API

  return (
      <Container orientation={orientation} status={getSpaceStatus(spaceData?.scheduleAt as Date)} theme={theme}>
        <ProfileContainer orientation={orientation}>
          <PfpContainer>
            <Pfp src={spaceData?.members[0].image} alt="pfp" />
          </PfpContainer>
          <HostContainer>
            <HostName>
              <Name>{spaceData?.members[0].wallet.slice(7)}</Name>
              <Host>Host</Host>
            </HostName>
            <HostHandle>
              {/* Fetch the handle from Lenster */}@
              {spaceData?.members[0].wallet.slice(7)}
            </HostHandle>
          </HostContainer>
        </ProfileContainer>
        {orientation === 'maximized' ? null : (
          <Icon
            src={
              getSpaceStatus(spaceData?.scheduleAt as Date) === 'Live'
                ? live
                : getSpaceStatus(spaceData?.scheduleAt as Date) === 'Scheduled'
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
            <Icon
              src={
                getSpaceStatus(spaceData?.scheduleAt as Date) === 'Live'
                  ? live
                  : getSpaceStatus(spaceData?.scheduleAt as Date) === 'Scheduled'
                  ? scheduled
                  : '' // Ended
              }
              alt="status"
            />
            <TimeText>
              {getSpaceStatus(spaceData?.scheduleAt as Date) === 'Live'
                ? 'Live'
                : getSpaceStatus(spaceData?.scheduleAt as Date) === 'Scheduled'
                ? `${getDateAndTime(spaceData?.scheduleAt as Date)}`
                : 'Ended'}
            </TimeText>
          </Time>
          <ParticipantContainer participants={(spaceData?.pendingMembers as [])} orientation={orientation}/>
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
    props.orientation === 'maximized' ? '16px' : props.orientation === 'minimized'? '0 20px': '0 11px'};
  gap: ${(props) => (props.orientation === 'maximized' ? '16px' : '8px')};
  width: ${(props) =>
    props.orientation === 'maximized' ? 'inherit' : props.orientation === 'minimized' ? 'inherit' : 'fit-content'};
  height: ${(props) => (props.orientation === 'maximized' ? 'auto' : props.orientation ==='minimized' ? '40px' : '63px')};
  background: ${(props) =>
    props.status === 'Live'
      ? props.theme.bannerBackground1
      : props.theme.bannerBackground2};
  border-radius: ${(props) =>
    props.orientation === 'maximized' ? '17px' : props.orientation === 'minimized' ? '12px' : '24px'};
  color: ${(props) => (props.status === 'Live' ? '#f5f5f5' : '#1E1E1E')};
  min-width: 0;
  text-overflow: ellipsis;
  overflow: hidden;

  @media(max-width: 425px) {
    min-width: ${(props) => (props.orientation === 'maximized' ? '100%' : '0')};
  }
}`;

const ProfileContainer = styled.div<{ orientation?: string }>`
  display: ${(props) => (props.orientation === 'maximized' ? 'flex' : 'none')};
  flex-direction: row;
  justify-content: space-between;
  width: min-content;

  @media (max-width: 510px) {
    justify-content: flex-start;
  }
}`;

const PfpContainer = styled.div`
  margin: 5px 0;
}`;

const Pfp = styled.img`
  height: 48px;
  width: 48px;
  border-radius: 50%;
}`;

const HostContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  font-family: 'Strawford';
  padding-left: 8px;

  @media (max-width: 510px) {
    width: 70%;
    overflow: hidden;
  }

  @media (max-width: 392px) {
    width: 60%;
    overflow: hidden;
  }
}`;

const HostName = styled.div`
  display: flex;
  flex-direction: row;
  font-weight: 500;
  font-size: 15px;
  width: 100%;
}`;

const Name = styled.span`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}`;

const Host = styled.div<{ status?: string }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 2px 8px;
  margin-left: 8px;
  line-height: 18px;
  width: max-content;
  height: 19px;
  background: ${(props) =>
    props.status === 'live'
      ? 'rgba(255, 255, 255, 0.2);'
      : 'rgba(139, 92, 246, 0.2)'};
  color: ${(props) => (props.status === 'live' ? 'inherit' : '#8B5CF6')};
  border-radius: 6px;
  font-weight: 500;
  font-size: 10px;
}`;

const HostHandle = styled.div<{ status?: string }>`
  color: ${(props) => (props.status === 'live' ? 'inherit' : '#71717A')};
  padding: 0;
  width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
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
    props.orientation === 'maximized' ? '20px' : props.orientation === 'minimized' ? '16px' : '12px'};
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
  width: ${(props) => (props.orientation === 'maximized' ? '100%' : 'fit-content')};
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
