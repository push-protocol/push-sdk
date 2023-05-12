import React, { useContext } from 'react';
import styled, { keyframes } from 'styled-components';
import { SupportChatPropsContext } from '../../../context';
import { SpinnerSvg } from '../../../icons/SpinnerSvg';

type SpinnerPropType = {
  size?: string;
};

type SpinLoaderPropType = {
  width?: string;
};

export const Spinner: React.FC<SpinnerPropType> = ({ size = 42 }) => {
  const { theme } = useContext<any>(SupportChatPropsContext);
  return (
    <SpinLoader width={`${size}px`}>
      <SpinnerSvg color={theme.btnColorPrimary} />
    </SpinLoader>
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
