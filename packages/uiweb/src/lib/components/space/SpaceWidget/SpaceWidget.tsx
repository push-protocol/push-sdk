import React, { useContext } from 'react';

import { ThemeContext } from '../theme/ThemeProvider';
import { ISpacesTheme } from '../theme';
import styled from 'styled-components';

export interface ISpaceWidgetProps {
  // Add props specific to the SpaceWidget component
  theme?: ISpacesTheme;
}

export const SpaceWidget: React.FC<ISpaceWidgetProps> = (props) => {
  // Implement the SpaceWidget component
  const theme = useContext(ThemeContext);

  return (
    <div>
      <Header theme={theme}>
        SpaceWidget Component
      </Header>
    </div>
  )
}

const Header = styled.div<ISpaceWidgetProps>`
  background-image: ${(props) => props.theme.bannerBackground1};
  color: ${(props) => props.theme.primary};
`;