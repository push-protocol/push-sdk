import { ChangeEvent, useContext } from 'react';
import styled, { ThemeProvider } from 'styled-components';

import { ISpacesTheme } from '../theme';
import { ThemeContext } from '../theme/ThemeProvider';

import { CloseSvg } from '../../../icons/CloseSvg';

export interface ISearchInputProps {
    labelName?: string;
    inputValue?: string;
    onInputChange?: any;
    clearInput?: any;
}

export const SearchInput = (props: ISearchInputProps) => {
    const theme = useContext(ThemeContext);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        props.onInputChange(event);
    };

    return (
      <ThemeProvider theme={theme}>
        <InputContainer>
            <LabelContainer>
                <label>{props.labelName}</label>
            </LabelContainer>
            <InputWrapper>
                <Input theme={theme} value={props.inputValue} onChange={handleChange} placeholder='Search...'/>
                <CloseBtn onClick={props.clearInput}>
                    <CloseSvg />
                </CloseBtn>
            </InputWrapper>
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
`;

const InputWrapper = styled.div`
    position: relative;
`;

const CloseBtn = styled.div`
    position: absolute;
    right: 0;
    top: 0;
    padding: 1.75rem 0.75rem;
`;
