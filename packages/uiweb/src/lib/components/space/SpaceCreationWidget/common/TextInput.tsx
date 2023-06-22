import React, { ChangeEvent } from 'react';
import styled from 'styled-components';

export interface ITextInputProps {
    charCount: number;
    labelName?: string;
    inputValue: string;
    onInputChange: any;
}

export const TextInputWithCounter = (props: ITextInputProps) => {
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
                {props.inputValue.length} / {props.charCount}
            </LabelContainer>
            <Input value={props.inputValue} onChange={handleChange} />
        </InputContainer>
    );
};

/* styling */
const InputContainer = styled.div`
    display: flex;
    flex-direction: column;

    margin: 16px 0;
`;

const LabelContainer = styled.div`
    display: flex;
    justify-content: space-between;
`;

const Input = styled.input`
    padding: 16px;
    margin-top: 12px;

    width: 330px;

    background: #FFFFFF;
    border: 1px solid #8B5CF6;
    box-shadow: -1px -1px 4px rgba(139, 92, 246, 0.14), 1px 1px 4px rgba(139, 92, 246, 0.12);
    border-radius: 12px;
`;