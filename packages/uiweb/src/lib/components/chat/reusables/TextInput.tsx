import React, { ChangeEvent, useContext } from 'react';
import styled, { ThemeProvider } from 'styled-components';

import { ThemeContext } from '../theme/ThemeProvider';
import { IChatTheme } from '../theme';

export interface ITextInputProps {
  charCount?: number;
  labelName?: string;
  inputValue: string;
  onInputChange: any;
}

export const TextInput = (props: ITextInputProps) => {
  const theme = useContext(ThemeContext);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if(props.charCount){
        const newText = event.target.value;
        const count = newText.length;
    
        if (count <= props.charCount) {
          props.onInputChange(event);
        }
    }
    else{
        props.onInputChange(event);  
    }
  
  };

  return (
    <ThemeProvider theme={theme}>
      <InputContainer>
        <LabelContainer>
          <label>{props.labelName}</label>
          {props.charCount &&<CharCounter theme={theme}>
            {props.inputValue.length} / {props.charCount}
          </CharCounter>}
        </LabelContainer>
        <Input theme={theme} value={props.inputValue} onChange={handleChange} />
      </InputContainer>
    </ThemeProvider>
  );
};

/* styling */
const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  font-family: ${(props) => props.theme.fontFamily};
`;

const LabelContainer = styled.div`
  display: flex;
  justify-content: space-between;

  font-weight: 500;
  font-size: 16px;
  color: ${(props) => props.theme.textColor?.modalHeadingText ?? '#000'};
`;

const Input = styled.input<IChatTheme>`
  padding: 16px;
  margin-top: 8px;
  color: ${(props) => props.theme.textColor?.modalHeadingText ?? '#000'};

  background: ${(props) => props.theme.backgroundColor.modalInputBackground};
  border: ${(props) => props.theme.border.modalInnerComponents};
  border-radius: ${(props) => props.theme.borderRadius.modalInnerComponents};

  font-family: ${(props) => props.theme.fontFamily};
  font-size: 16px;

  font-weight: 500;
`;

const CharCounter = styled.div<IChatTheme>`
  color: ${(props) => props.theme.textColor?.modalSubHeadingText};
  font-size: 14px;

  font-weight: 400;
`;
