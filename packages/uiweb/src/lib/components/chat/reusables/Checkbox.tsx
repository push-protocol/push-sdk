import React, { ChangeEvent, useContext } from 'react';
import styled, { ThemeProvider } from 'styled-components';

import { ThemeContext } from '../theme/ThemeProvider';
import { IChatTheme } from '../theme';

export interface ICheckboxProps {
  checked: boolean;
  onToggle: any;
  labelName?: string;
}

export const Checkbox = (props: ICheckboxProps) => {
  const theme = useContext(ThemeContext);
  return (
    <ThemeProvider theme={theme}>
      <CheckboxContainer>
      <input type="checkbox" id="checkbox" checked={props.checked} onChange={()=>props.onToggle()} />
        <LabelContainer>
        <label>{props.labelName}</label>
        </LabelContainer>
       
      </CheckboxContainer>
    </ThemeProvider>
  );
};

/* styling */
const CheckboxContainer = styled.div`
  display: flex;
  width: 100%;
  gap:5px;
  align-items:center;
  font-family: ${(props) => props.theme.fontFamily};
  input{
    width: 18px;
height: 18px
  }
`;

const LabelContainer = styled.div`
  display: flex;

  font-weight: 400;
  font-size: 16px;
  color: ${(props) => props.theme.textColor?.modalHeadingText ?? '#000'};
`;
