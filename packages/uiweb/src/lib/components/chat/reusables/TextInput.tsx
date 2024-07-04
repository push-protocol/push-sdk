import React, { ChangeEvent, useContext } from 'react';
import styled, { ThemeProvider } from 'styled-components';

import { ThemeContext } from '../theme/ThemeProvider';
import { IChatTheme } from '../theme';

export interface ITextInputProps {
  charCount?: number;
  labelName?: string;
  inputValue: string;
  placeholder?: string;
  onInputChange?: any;
  disabled?: boolean;
  customStyle?: CustomStyleParamsType;
  error?: boolean;
}
type CustomStyleParamsType = {
  background?: string;
};

export const TextInput = (props: ITextInputProps) => {
  const theme = useContext(ThemeContext);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (props.charCount) {
      const newText = event.target.value;
      const count = newText.length;

      if (count <= props.charCount) {
        props.onInputChange(event);
      }
    } else {
      props.onInputChange(event);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <InputContainer>
        <LabelContainer>
          <label>{props.labelName}</label>
          {props.charCount && (
            <CharCounter theme={theme}>
              {props.inputValue.length} / {props.charCount}
            </CharCounter>
          )}
        </LabelContainer>
        <Input
          customStyle={props.customStyle!}
          disabled={!!props.disabled}
          theme={theme}
          error={props.error || false}
          value={props.inputValue}
          onChange={handleChange}
          placeholder={props.placeholder}
        />
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
  font-size: 14px;
  color: ${(props) => props.theme.textColor?.modalHeadingText ?? '#000'};
`;

const Input = styled.input<IChatTheme & { customStyle: CustomStyleParamsType; error: boolean }>`
  padding: 16px;
  margin-top: 8px;
  color: ${(props) => props.theme.textColor?.modalHeadingText ?? '#000'};
  background: ${(props) =>
    props.customStyle?.background ? props.customStyle.background : props.theme.backgroundColor.modalInputBackground};
  border: ${(props) => (props.error ? ' 1px solid #ED5858' : props.theme.border.modalInnerComponents)};
  border-radius: ${(props) => props.theme.borderRadius.modalInnerComponents};

  font-family: ${(props) => props.theme.fontFamily};
  font-size: 16px;

  font-weight: 500;
  [readonly='readonly'] {
    pointer-events: none;
  }
  &:focus {
    border: 1px solid #ffdbf0;
  }
`;

const CharCounter = styled.div<IChatTheme>`
  color: ${(props) => props.theme.textColor?.modalSubHeadingText};
  font-size: 14px;

  font-weight: 400;
`;
