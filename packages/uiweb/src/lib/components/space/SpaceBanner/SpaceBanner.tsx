import React from 'react';
import { useSpaceData } from '../../../hooks';
import styled from 'styled-components';

export interface ISpaceBannerProps {
  // Add props specific to the SpaceBanner component
  title?: string;
  peopleInSpace?: string[];
  participants?: number;
  time?: Date;
  status?: 'live' | 'scheduled' | 'ended';
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
  const { spaceBannerData, setSpaceBannerData } = useSpaceData();

  // Use spaceBannerData and setSpaceBannerData in your component

  return (
    <div>
      <Container orientation={orientation}>
        <ProfileContainer orientation={orientation}>
          <PfpContainer>
            <Pfp src="" alt="pfp" />
          </PfpContainer>
          <HostContainer>
            <HostName>
              
              <Host>Host</Host>
            </HostName>
            <HostHandle></HostHandle>
          </HostContainer>
        </ProfileContainer>
        {orientation === 'maximized' ? null : <Icon src="" />}
        <Title orientation={orientation}>
          {orientation === 'minimized' ? `${title?.slice(0, 30)}...` : title}
        </Title>
        <Status>
          <Time orientation={orientation}>
            <Icon />
            <TimeText></TimeText>
          </Time>
          <Participants>
            <ParticipantsIconContainer orientation={orientation}>
              <ParticipantsIcon1 src="" alt="pfp"/>
              <ParticipantsIcon2 src="" alt="pfp"/>
              <ParticipantsIcon3 src="" alt="pfp" orientation={orientation} />
            </ParticipantsIconContainer>
            <ParticipantsText></ParticipantsText>
          </Participants>
        </Status>
      </Container>
    </div>
  );
};

// Styling
const Container = styled.div<{ orientation?: string }>`
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
  background: linear-gradient(
    87.17deg,
    #ea4ee4 0%,
    #d23cdf 0.01%,
    #8b5cf6 100%
  );
  border-radius: ${(props) =>
    props.orientation === 'maximized' ? '17px' : '24px'};
  color: #f5f5f5;

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
  align-items: flex-start;

}`;

const HostName = styled.div`
  display: flex;
  flex-direction: row;
  font-family: 'Strawford';
  font-style: normal;
  font-weight: 500;
  font-size: 15px;

}`;

const Host = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 2px 8px;
  margin-left: 8px;
  line-height: 18px;

  width: auto;
  height: 19px;

  background: rgba(255, 255, 255, 0.2);
  border-radius: 6px;

  font-family: "Strawford";
  font-style: normal;
  font-weight: 500;
  font-size: 10px;

}`;

const HostHandle = styled.div`
  font-family: 'Strawford';
  font-style: normal;

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
  width: 598px;
  line-clamp: ${(props) => (props.orientation === 'maximized' ? '3' : '2')};

}`;

const Status = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  font-family: 'Strawford';
  font-style: normal;

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

const TimeText = styled.div`
  font-family: 'Strawford';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 150%;

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

const ParticipantsIcon1 = styled.img` 
  grid-column: 1 / 3;
  grid-row: 1 / 2;
  width: 31px;
  height: 31px;
  z-index: 3;

}`;

const ParticipantsIcon2 = styled.img`
  grid-row: 1 / 2;
  grid-column: 2 / -1;
  width: 31px;
  height: 31px;
  z-index: 2;

}`;

const ParticipantsIcon3 = styled.img<{ orientation?: string }>`
  display: ${(props) => (props.orientation === 'maximized' ? 'block' : 'none')};
  grid-row: 1 / 2;
  grid-column: 3 / -1;
  width: 31px;
  height: 31px;
  z-index: 1;

}`;

const ParticipantsText = styled.div`
  font-family: 'Strawford';
  display: flex;
  justify-content: center;
  align-items: center;
  width: 38px;

}`;
