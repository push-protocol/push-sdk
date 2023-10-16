import React, {  useContext } from 'react';
import styled, { ThemeProvider } from 'styled-components';

import { ThemeContext } from '../theme/ThemeProvider';

export interface IToggleInputProps {
  labelHeading?: string;
  labelSubHeading?: string;
  checked: boolean;
  onToggle: any;
}

interface ILabelProps {
  fontSize?: string;
  fontWeight?: string;
  textColor?: string;
}
export const ToggleInput = (props: IToggleInputProps) => {

  const theme = useContext(ThemeContext);

  return (
    <ThemeProvider theme={theme}>
      <ToggleContainer>
        <LabelContainer>
          <Label textColor={theme.textColor?.modalHeadingText}>
            {props.labelHeading}
          </Label>
          <Label
            textColor={theme.textColor?.modalSubHeadingText}
            fontSize='12px'
            fontWeight='400'
          >
            {props.labelSubHeading}
          </Label>
        </LabelContainer>
        <ToggleLabel htmlFor="checkbox">
          <input type="checkbox" id="checkbox" checked={props.checked} onChange={()=>props.onToggle()} />
          <div className="slider round"></div>
        </ToggleLabel>
        {/* <input type="checkbox" id="checkbox" />
    <div class="slider round"></div> */}
      </ToggleContainer>
    </ThemeProvider>
  );
};

/* styling */
const ToggleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width:100%;
  gap:10px;
  font-family: ${props => props.theme.fontFamily};
    align-items:center;
`;

const LabelContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap:4px;
  width:73%;
`;
const Label = styled.label<ILabelProps>`
    font-size: ${(props) => props.fontSize ?? '16px'};
    font-weight: ${(props) => props.fontWeight ?? '500'};
    color: ${(props) => props.textColor ?? '#000'};
`;

const ToggleLabel = styled.label`
  display: inline-block;
  height: 24px;
  position: relative;
  width: 44px;
  padding:2px;
  input {
    display: none;
  }
  .slider {
    background-color: #ccc;
    bottom: 0;
    cursor: pointer;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    transition: 0.4s;
  }
  .slider:before {
    background-color: #fff;
    bottom: 4px;
    content: '';
    height: 20px;
    left: 4px;
    position: absolute;
    transition: 0.4s;
    width: 20px;
  }
  input:checked + .slider {
    background-color: ${(props) =>props.theme.backgroundColor.buttonBackground};
  }

  input:checked + .slider:before {
    transform: translateX(20px);
  }
  .slider.round {
    border-radius: 34px;
  }

  .slider.round:before {
    border-radius: 50%;
  }
`;

