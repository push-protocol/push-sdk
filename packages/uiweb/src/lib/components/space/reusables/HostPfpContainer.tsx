import React from 'react';
import styled from 'styled-components';

import { ISpacesTheme } from '../theme';
import { ThemeContext } from '../theme/ThemeProvider';

export interface IHostPfpContainerProps {
  name?: string;
  handle?: string;
  imageUrl?: string;
  statusTheme: 'Live' | 'Scheduled' | 'Ended';
  imageHeight?: string;
}

interface IThemeProps {
  theme?: ISpacesTheme;
  statusTheme?: string;
  imageHeight?: string;
}

export const HostPfpContainer: React.FC<IHostPfpContainerProps> = ({
  name = 'Host Name',
  handle = 'Host Handle',
  imageUrl = '',
  statusTheme,
  imageHeight,
}: IHostPfpContainerProps) => {
  const theme = React.useContext(ThemeContext);
  return (
    <ProfileContainer theme={theme}>
      <PfpContainer theme={theme}>
        <Pfp
          src={imageUrl}
          alt="host pfp"
          imageHeight={imageHeight}
          theme={theme}
        />
      </PfpContainer>
      <HostContainer theme={theme}>
        <HostName theme={theme}>
          <Name theme={theme}>{name}</Name>
          <Host statusTheme={statusTheme} theme={theme}>
            Host
          </Host>
        </HostName>
        {handle && (
          <HostHandle statusTheme={statusTheme} theme={theme}>
            {/* Fetch the handle from Lenster */}@{handle}
          </HostHandle>
        )}
      </HostContainer>
    </ProfileContainer>
  );
};

const ProfileContainer = styled.div<IThemeProps>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  align-items: center;
`;

const PfpContainer = styled.div`
  display: flex;
`;

const Pfp = styled.img<IThemeProps>`
  height: ${(props) => props.imageHeight ?? '32px'};
  width: ${(props) => props.imageHeight ?? '32px'};
  border-radius: 50%;
`;

const HostContainer = styled.div<IThemeProps>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding-left: 8px;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const HostName = styled.div<IThemeProps>`
  display: flex;
  flex-direction: row;
  font-weight: 600;
  font-size: 15px;
  width: 100%;
`;

const Name = styled.span<IThemeProps>`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const Host = styled.div<IThemeProps>`
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
      ? `${props.theme.btnOutline}`
      : `${props.theme.btnOutline}`};
  color: ${(props) =>
    props.statusTheme === 'Live'
      ? 'inherit'
      : `${props.theme.bgColorSecondary}`};
  border-radius: 6px;
  font-weight: 500;
  font-size: 10px;
`;

const HostHandle = styled.div<IThemeProps>`
  color: ${(props) =>
    props.statusTheme === 'Live'
      ? `${props.theme.textColorPrimary}`
      : `${props.theme.textColorSecondary}`};
  padding: 0;
  font-weight: 450;
  font-size: 14px;
  line-height: 130%;
  width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;
