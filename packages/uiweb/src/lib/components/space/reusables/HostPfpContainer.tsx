import React from 'react';
import styled from 'styled-components';

export interface IHostPfpContainerProps {
  name?: string;
  handle?: string;
  imageUrl?: string;
  statusTheme: "Live" | "Scheduled" | "Ended";
  imageHeight?: string;
}

export const HostPfpContainer: React.FC<IHostPfpContainerProps> = ({
  name = "Host Name",
  handle = "Host Handle",
  imageUrl = "",
  statusTheme,
  imageHeight,
}: IHostPfpContainerProps) => {
  return (
    <ProfileContainer>
      <PfpContainer>
        <Pfp src={imageUrl} alt="host pfp" imageHeight={imageHeight} />
      </PfpContainer>
      <HostContainer>
        <HostName>
          <Name>{name}</Name>
          <Host statusTheme={statusTheme}>Host</Host>
        </HostName>
        {handle &&
          <HostHandle statusTheme={statusTheme}>
            {/* Fetch the handle from Lenster */}@{handle}
          </HostHandle>
        }
      </HostContainer>
    </ProfileContainer>
  );
};

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  align-items: center;
}`;

const PfpContainer = styled.div`
  display: flex;
}`;

const Pfp = styled.img<{ imageHeight?: string }>`
  height: ${(props) => (props.imageHeight ?? '32px')};
  width: ${(props) => (props.imageHeight ?? '32px')};;
  border-radius: 50%;
}`;

const HostContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding-left: 8px;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}`;

const HostName = styled.div`
  display: flex;
  flex-direction: row;
  font-weight: 600;
  font-size: 15px;
  width: 100%;
}`;

const Name = styled.span`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}`;

const Host = styled.div<{ statusTheme?: string }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 2px 8px;
  margin-left: 8px;
  line-height: 18px;
  width: max-content;
  height: 19px;
  background: ${(props) =>
    props.statusTheme === 'Live'
      ? 'rgba(255, 255, 255, 0.2);'
      : 'rgba(139, 92, 246, 0.2)'};
  color: ${(props) => (props.statusTheme === 'Live' ? 'inherit' : '#8B5CF6')};
  border-radius: 6px;
  font-weight: 500;
  font-size: 10px;
}`;

const HostHandle = styled.div<{ statusTheme?: string }>`
  color: ${(props) => (props.statusTheme === 'Live' ? 'inherit' : '#71717A')};
  padding: 0;
  font-weight: 450;
  font-size: 14px;
  line-height: 130%;
  width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}`;
