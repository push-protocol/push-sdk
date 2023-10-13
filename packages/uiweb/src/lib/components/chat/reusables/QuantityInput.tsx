import React, { ChangeEvent, useContext } from 'react';
import styled, { ThemeProvider } from 'styled-components';

import { ThemeContext } from '../theme/ThemeProvider';
import { IChatTheme } from '../theme';
import { DropdownValueType } from './DropDown';
import { Div, Section, Span } from '../../reusables';
import { DropDownInput } from './DropDownInput';
import { device } from '../../../config';
import { shortenText } from '../../../helpers';

export type InputType = { value: number; range: number };
export interface IQuantityInputProps {
  labelName?: string;
  inputValue: InputType;
  placeholder?: string;
  unit: string;
  onInputChange: any;
  dropDownValues: DropdownValueType[];
  error?:boolean;
}

export const QuantityInput = (props: IQuantityInputProps) => {
  const theme = useContext(ThemeContext);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    props.onInputChange(event);
  };

  return (
    <ThemeProvider theme={theme}>
      <QuantityInputContainer>
        <LabelContainer>
          <label>{props.labelName}</label>
        </LabelContainer>
        <Section gap="4px" alignItems="center" >
          <Section  zIndex='500'>
          <DropDownInput
            selectedValue={props.inputValue.range}
            dropdownValues={props.dropDownValues}
          />
          </Section>
          <Section alignItems="baseline" width='fit-content'>
            <Input
              type="number"
              error={props.error ||false}
              theme={theme}
              value={props.inputValue.value}
              onChange={handleChange}
              placeholder={props.placeholder}
            />
            <Unit
              alignSelf='auto'
              background={theme.backgroundColor?.modalHoverBackground}
              width='fit-content'
              height='fit-content'
              error={props.error ||false}
             
            >
              <Span>
              {shortenText(props.unit,15)}
              </Span>
            </Unit>
          </Section>
        </Section>
      </QuantityInputContainer>
    </ThemeProvider>
  );
};

/* styling */
const QuantityInputContainer = styled.div`
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
const Input = styled.input<IChatTheme &{error:boolean}>`
  padding: 16px;
  margin-top: 8px;
  color: ${(props) => props.theme.textColor?.modalHeadingText ?? '#000'};

  background: ${(props) => props.theme.backgroundColor.modalInputBackground};
  border: ${(props) => props.error?' 1px solid #ED5858':props.theme.border.modalInnerComponents};
  border-width: 1px 0px 1px 1px;
  border-radius: 12px 0 0 12px;
  font-family: ${(props) => props.theme.fontFamily};
  font-size: 16px;
  width:60%;
  font-weight: 500;
`;

const Unit = styled(Section)<IChatTheme&{error:boolean}>`
span{
  font-size:14px;
  font-weight:700;
  text-wrap: nowrap;
}
border-radius:0 12px 12px 0;

padding:18.2px 17.2px 17.2px 17.2px;
border: ${(props) => props.error?' 1px solid #ED5858':props.theme.border.modalInnerComponents};
@media ${device.mobileL} {

  padding:21.5px 5px 18px 5px;
  span{
    font-size: 10px;
    font-weight:400
  }
}

`;