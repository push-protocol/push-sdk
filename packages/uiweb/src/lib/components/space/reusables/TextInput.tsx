import React, { ChangeEvent, useContext } from 'react';
import styled from 'styled-components';

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
        <InputContainer>
            <LabelContainer>
                <label>{props.labelName}</label>
                <CharCounter theme={theme}>{props.inputValue.length} / {props.charCount}</CharCounter>
            </LabelContainer>
            <Input theme={theme} value={props.inputValue} onChange={handleChange} />
        </InputContainer>
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
`;

const Input = styled.input<ISpacesTheme>`
    padding: 16px;
    margin-top: 12px;

    width: 330px;

    background: #FFFFFF;
    border: 1px solid ${(props => props.theme.btnOutline)};
    box-shadow: -1px -1px 2px ${(props => props.theme.btnOutline)}, 1px 1px 2px ${(props => props.theme.btnOutline)};
    border-radius: 12px;

    font-family: 'Strawford'; // update to fontFamily theme 
    font-size: 14px;
`;

const CharCounter = styled.div<ISpacesTheme>`
    color: ${(props => props.theme.textColorSecondary)};
`;