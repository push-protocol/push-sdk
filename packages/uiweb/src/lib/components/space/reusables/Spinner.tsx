import React, { useContext } from 'react';
import styled, { keyframes, ThemeProvider } from 'styled-components';
import { SpinnerSvg } from '../../../icons/SpinnerSvg';
import { ThemeContext } from '../theme/ThemeProvider';

type SpinnerPropType = {
  size?: string;
};

type SpinLoaderPropType = {
  width?: string;
};

export const Spinner: React.FC<SpinnerPropType> = ({ size = 42 }) => {
  const theme = useContext(ThemeContext);
  return (
    <ThemeProvider theme={theme}>
      <SpinLoader width={`${size}px`}>
        <SpinnerSvg color={`${theme.btnOutline}`} />
      </SpinLoader>
    </ThemeProvider>
  );
};

//styles
const spinAnimation = keyframes`
  from { transform:rotate(0deg); }
  to { transform:rotate(360deg); }
`;
const SpinLoader = styled.div<SpinLoaderPropType>`
  display: flex;
  flex: initial;
  align-self: center;
  width: ${(props) => props.width};
  animation-name: ${spinAnimation};
  animation-duration: 2500ms;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
`;
