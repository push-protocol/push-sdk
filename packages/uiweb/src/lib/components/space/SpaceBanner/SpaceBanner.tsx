import React from 'react';
import styled from 'styled-components';

import live from './assets/live.svg';
import scheduled from './assets/CalendarBlank.svg';

import { ISpacesTheme } from '../theme';
import { ThemeContext } from '../theme/ThemeProvider';
import { useSpaceData } from './../../../hooks';
import { getDateAndTime, getStatus } from './utils';

import * as PushAPI from '@pushprotocol/restapi';

export interface ISpaceBannerProps {
  spaceId: string;
  orientation?: 'maximized' | 'minimized';
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
  // const [spaceBannerData, setSpaceBannerData] = React.useState<any>();
  const { spaceBannerData, setSpaceBannerData } = useSpaceData();

  React.useEffect(() => {
    (async () => {
      await PushAPI.space.get({
        spaceId: spaceId,
      })
        .then((response) => {
          setSpaceBannerData({spaceId: spaceId, apiData: response});
        })
        .catch((error) => {
          console.log(error);
        });
    })();
  }, [spaceId, spaceBannerData, setSpaceBannerData]);

  return (
      <Container orientation={orientation} status={getStatus(spaceBannerData?.apiData.scheduleAt as string)} theme={theme}>
        <ProfileContainer orientation={orientation}>
          <PfpContainer>
            <Pfp src={spaceBannerData?.apiData.members[0].image} alt="pfp" />
          </PfpContainer>
          <HostContainer>
            <HostName>
              {spaceBannerData?.apiData.members[0].wallet.slice(7)}
              <Host>Host</Host>
            </HostName>
            <HostHandle>
              {/* Fetch the handle from Lenster */}@
              {spaceBannerData?.apiData.members[0].wallet.slice(7)}
            </HostHandle>
          </HostContainer>
        </ProfileContainer>
        {orientation === 'maximized' ? null : (
          <Icon
            src={
              getStatus(spaceBannerData?.apiData.scheduleAt as string) === 'Live'
                ? live
                : getStatus(spaceBannerData?.apiData.scheduleAt as string ) === 'Scheduled'
                ? scheduled
                : '' // Ended
            }
            alt="status"
          />
        )}
        <Title orientation={orientation}>
          {orientation === 'minimized'
            ? `${spaceBannerData?.apiData.spaceName.slice(0, 20)}...`
            : spaceBannerData?.apiData.spaceName}
        </Title>
        <Status>
          <Time orientation={orientation}>
            <Icon
              src={
                getStatus(spaceBannerData?.apiData.scheduleAt as string) === 'Live'
                  ? live
                  : getStatus(spaceBannerData?.apiData.scheduleAt as string) === 'Scheduled'
                  ? scheduled
                  : '' // Ended
              }
              alt="status"
            />
            <TimeText>
              {getStatus(spaceBannerData?.apiData.scheduleAt as string) === 'Live'
                ? 'Live'
                : getStatus(spaceBannerData?.apiData.scheduleAt as string) === 'Scheduled'
                ? `${getDateAndTime(spaceBannerData?.apiData.scheduleAt as string)}`
                : 'Ended'}
            </TimeText>
          </Time>
          <Participants>
            <ParticipantsIconContainer orientation={orientation}>
              {orientation === 'maximized'
                ? spaceBannerData &&
                  (spaceBannerData.apiData.pendingMembers as []).map(
                    (person, index) =>
                      index < 3 && (
                        <ParticipantsIcon
                          src={(person as any)?.image}
                          alt="avatar"
                          className={`index${index}`}
                        />
                      )
                  )
                : spaceBannerData &&
                  (spaceBannerData?.apiData.pendingMembers as []).map(
                    (person, index) =>
                      index < 2 && (
                        <ParticipantsIcon
                          src={(person as any)?.image}
                          alt="avatar"
                          className={`index${index}`}
                        />
                      )
                  )}
            </ParticipantsIconContainer>
            <ParticipantsText>
              {orientation === 'maximized'
                ? spaceBannerData &&
                  `+${((spaceBannerData?.apiData.pendingMembers as []).length as number) -3}`
                : spaceBannerData &&
                  `+${((spaceBannerData?.apiData.pendingMembers as []).length as number) - 2}`}
            </ParticipantsText>
          </Participants>
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
    props.orientation === 'maximized' ? '16px' : '0 11px'};
  gap: ${(props) => (props.orientation === 'maximized' ? '16px' : '8px')};
  width: ${(props) =>
    props.orientation === 'maximized' ? '37vw' : 'fit-content'};
  height: ${(props) => (props.orientation === 'maximized' ? 'auto' : '63px')};
  background: ${(props) =>
    props.status === 'Live'
      ? props.theme.bannerBackground1
      : props.theme.bannerBackground2};
  border-radius: ${(props) =>
    props.orientation === 'maximized' ? '17px' : '24px'};
  color: ${(props) => (props.status === 'Live' ? '#f5f5f5' : '#1E1E1E')};

  @media(max-width: 425px) {
    min-width: ${(props) => (props.orientation === 'maximized' ? '100%' : '0')};
  }
}`;

const ProfileContainer = styled.div<{ orientation?: string }>`
  display: ${(props) => (props.orientation === 'maximized' ? 'flex' : 'none')};
  flex-direction: row;
  justify-content: space-between;
  width: fit-content;
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
  padding: 0;
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
    props.orientation === 'maximized' ? '20px' : '12px'};
  line-height: 130%;
  width: 90%;
  line-clamp: ${(props) => (props.orientation === 'maximized' ? '3' : '2')};

  @media (max-width: 425px) {
    width: 95%;
  }
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
  border-radius: 50%;

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
