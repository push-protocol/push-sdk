import React from 'react';
import styled from 'styled-components';

import live from './assets/live.svg';
import scheduled from './assets/CalendarBlank.svg';

// import { useSpaceData } from '../../../hooks';
import { getDateAndTime } from './utils';

export interface ISpaceBannerProps {
  // Add props specific to the SpaceBanner component
  title: string;
  peopleInSpace: string[];
  participants: number;
  time: Date;
  status: 'live' | 'scheduled' | 'ended';
  host?: object;
  theme?: object;
  orientation?: 'maximized' | 'minimized';
}

export const SpaceBanner: React.FC<ISpaceBannerProps> = ({
  title,
  peopleInSpace,
  participants,
  time,
  status,
  host,
  theme,
  orientation,
}) => {
  // const { spaceBannerData, setSpaceBannerData } = useSpaceData();

  // Use spaceBannerData and setSpaceBannerData in your component

  return (
    <div>
      <Container status={status} orientation={orientation}>
        <ProfileContainer orientation={orientation}>
          <PfpContainer>
            <Pfp src={host?.image} alt="pfp" />
          </PfpContainer>
          <HostContainer>
            <HostName>
              {host?.wallet}
              <Host status={status}>Host</Host>
            </HostName>
            <HostHandle status={status}>
              {/*Fetch the handle from Lenster */}
            </HostHandle>
          </HostContainer>
        </ProfileContainer>
        {orientation === 'maximized' ? null : <Icon src="" />}
        <Title orientation={orientation}>
          {orientation === 'minimized' ? `${title?.slice(0, 30)}...` : title}
        </Title>
        <Status>
          <Time orientation={orientation}>
            <Icon
              src={
                status === 'live'
                  ? live
                  : status === 'scheduled'
                  ? scheduled
                  : ''
              }
            />
            <TimeText status={status}>
              {status === 'live'
                ? 'Live'
                : status === 'scheduled'
                ? `${getDateAndTime(time)}`
                : 'Ended'}
            </TimeText>
          </Time>
          <Participants>
            <ParticipantsIconContainer orientation={orientation}>
              {orientation === 'maximized'
                ? peopleInSpace?.map(
                    (person, index) =>
                      index < 3 && (
                        <ParticipantsIcon
                          src={person?.image}
                          alt="avatar"
                          className={`index${index}`}
                        />
                      )
                  )
                : peopleInSpace?.map(
                    (person, index) =>
                      index < 2 && (
                        <ParticipantsIcon
                          src={person?.image}
                          alt="avatar"
                          className={`index${index}`}
                        />
                      )
                  )}
            </ParticipantsIconContainer>
            <ParticipantsText>
              {orientation === 'maximized'
                ? `+${(participants as number) - 3}`
                : `+${(participants as number) - 2}`}
            </ParticipantsText>
          </Participants>
        </Status>
      </Container>
    </div>
  );
};

// Styling
const Container = styled.div<{ status?: string; orientation?: string }>`
  display: flex;
  flex-direction: ${(props) =>
    props.orientation === 'maximized' ? 'column' : 'row'};
  justify-content: ${(props) =>
    props.orientation === 'maximized' ? 'space-between' : 'flex-start'};
  align-items: ${(props) =>
    props.orientation === 'maximized' ? 'flex-start' : 'center'};
  padding: ${(props) =>
    props.orientation === 'maximized' ? '16px' : '0 11px'};
  gap: ${(props) => (props.orientation === 'maximized' ? '12px' : '8px')};
  width: ${(props) =>
    props.orientation === 'maximized' ? '709px' : '252.67px'};
  height: ${(props) => (props.orientation === 'maximized' ? '200px' : '63px')};
  background: ${(props) =>
    props.status === 'live'
      ? `linear-gradient(
    87.17deg,
    #ea4ee4 0%,
    #d23cdf 0.01%,
    #8b5cf6 100%
  )`
      : '#EDE9FE'};
  border-radius: ${(props) =>
    props.orientation === 'maximized' ? '17px' : '24px'};
  color: ${(props) => (props.status === 'live' ? '#f5f5f5' : '#1E1E1E')};
}`;

const ProfileContainer = styled.div<{ orientation?: string }>`
  display: ${(props) => (props.orientation === 'maximized' ? 'flex' : 'none')};
  flex-direction: row;
  justify-content: space-between;
  width: fit-content;
}`;

const PfpContainer = styled.div`
  margin: 5px;
}`;

const Pfp = styled.img`
  height: 48px;
  width: 48px;
}`;

const HostContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: 'Strawford';
}`;

const HostName = styled.div`
  display: flex;
  flex-direction: row;
  font-weight: 500;
  font-size: 15px;
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
}`;

const Title = styled.div<{ orientation?: string }>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-family: ${(props) =>
    props.orientation === 'maximized' ? 'Strawford' : 'Strawford'};
  font-weight: ${(props) =>
    props.orientation === 'maximized' ? '700' : '500'};
  font-size: ${(props) =>
    props.orientation === 'maximized' ? '20px' : '12px'};
  line-height: 130%;
  width: auto;
  line-clamp: ${(props) => (props.orientation === 'maximized' ? '3' : '2')};
}`;

const Status = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
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

const Participants = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}`;

const ParticipantsIconContainer = styled.div<{ orientation?: string }>`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  width: ${(props) => (props.orientation === 'maximized' ? '62px' : '46.5px')};
  padding: 0 4px;
}`;

const ParticipantsIcon = styled.img` 
  width: 31px;
  height: 31px;

  &.index0 {
    position: relative;
    top: 0;
    left: 0;
    z-index: 3;
  }
  &.index1 {
    position: relative;
    top: 0;
    left: -50%;
    z-index: 2;
  }
  &.index2 {
    position: relative;
    top: 0;
    left: -100%;
    z-index: 1;
  }
}`;

const ParticipantsText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: auto;
}`;
