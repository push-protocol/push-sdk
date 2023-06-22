import React, { useContext } from 'react';
import styled from 'styled-components';

import { ISpacesTheme } from '../theme';
import { ThemeContext } from '../theme/ThemeProvider';
import { Item } from '../../../config';

export interface ISpaceWidgetProps {
  // Add props specific to the SpaceWidget component
  temporary?: string; // just to remove eslint error of empty prop
}

/**
 * @interface IThemeProps
 * this interface is used for defining the props for styled components
 */
interface IThemeProps {
  theme?: ISpacesTheme;
}

export const SpaceWidget: React.FC<ISpaceWidgetProps> = (props) => {
  // Implement the SpaceWidget component
  const theme = useContext(ThemeContext);

  return (
    <div>
      <Header theme={theme}>
        SpaceWidget Component
        <Item fontSize={'69px'}>vkfvk</Item>
      </Header>
    </div>
  )
}

const Header = styled.div<IThemeProps>`
  background-image: ${(props) => props.theme.titleBg};
  color: ${(props) => props.theme.primary};
`;
