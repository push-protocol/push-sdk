import React, { ChangeEvent, useContext } from 'react';
import styled, { ThemeProvider } from 'styled-components';

import { ISpacesTheme } from '../theme';
import { ThemeContext } from '../theme/ThemeProvider';

export interface ITextInputProps {
    charCount: number;
    labelName?: string;
    inputValue: string;
    onInputChange: any;
}

export const TextInputWithCounter = (props: ITextInputProps) => {
    const theme = useContext(ThemeContext);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newText = event.target.value;
        const count = newText.length;

        if (count <= props.charCount) {
            props.onInputChange(event);
        }
    };

    return (
      <ThemeProvider theme={theme}>
        <InputContainer>
            <LabelContainer>
                <label>{props.labelName}</label>
                <CharCounter theme={theme}>{props.inputValue.length} / {props.charCount}</CharCounter>
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

    margin: 16px 0;

    font-family: 'Strawford'; // update to fontFamily theme
`;

const LabelContainer = styled.div`
    display: flex;
    justify-content: space-between;

    font-weight: 500;
    color: ${props => props.theme.textColorPrimary ?? '#000'}
`;

const Input = styled.input<ISpacesTheme>`
    padding: 16px;
    margin-top: 12px;

    width: 330px;

    background: #FFFFFF;
    border: 2px solid ${(props => props.theme.btnOutline)};
    border-radius: 12px;

    font-family: 'Strawford'; // update to fontFamily theme
    font-size: 14px;
`;

const CharCounter = styled.div<ISpacesTheme>`
    color: ${(props => props.theme.textColorSecondary)};
`;
