import React, {  useContext } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { ThemeContext } from '../theme/ThemeProvider';

// import { ThemeContext } from '../../chat/theme/ThemeProvider';

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
          <Label textColor={theme?.textColor?.modalTitleText}>
            {props.labelHeading}
          </Label>
          <Label
            textColor={theme?.textColor?.modalSubTitleText}
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
  font-family: inherit;
    align-items:center;
`;

const LabelContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap:4px;
  width:73%;
`;
const Label = styled.label<ILabelProps>`
    font-size: ${(props) => props.fontSize ?? '13px'};
    font-weight: ${(props) => props.fontWeight ?? '500'};
    color: ${(props) => props.textColor ?? '#000'};
`;

const ToggleLabel = styled.label`
  display: inline-block;
  height: 16px;
  position: relative;
  width: 32px;
  padding:2px;
  input {
    display: none;
  }
  .slider {
    background-color: #A0A3B1;
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
    bottom: 3px;
    content: '';
    height: 15px;
    left: 2px;
    position: absolute;
    transition: 0.4s;
    width: 15px;
  }
  input:checked + .slider {
    background-color: ${(props) =>props.theme.backgroundColor.buttonBackground};
  }

  input:checked + .slider:before {
    transform: translateX(17px);
  }
  .slider.round {
    border-radius: 34px;
  }

  .slider.round:before {
    border-radius: 50%;
  }
`;

