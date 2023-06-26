/**
 * @file Button
 * generic button component for spaces
 */

import { MouseEventHandler, useContext } from 'react'
import styled from 'styled-components';

import { ISpacesTheme } from '../theme';
import { ThemeContext } from '../theme/ThemeProvider';

export interface IButtonProps {
    width?: string;
    children: any;
    onClick?: MouseEventHandler;
    theme?: ISpacesTheme;
    customStyle?: any;
}

export const Button = (props: IButtonProps) => {
    const theme = useContext(ThemeContext);

    const { onClick, width, customStyle } = props;
    return (
        <SpacesButton
            onClick={onClick}
            width={width}
            theme={theme}
            customStyle={customStyle}
        >
            { props.children }
        </SpacesButton>
    )
}

/* styling */
const SpacesButton = styled.button<IButtonProps>`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 10px 16px;
    margin-top: 12px;

    background: ${(props => props.customStyle ? props.customStyle.background : props.theme.btnColorPrimary)};
    border: 1px solid ${(props => props.customStyle ? props.customStyle.borderColor : props.theme.btnOutline)};
    color: ${(props => props.theme.titleTextColor)};
    border-radius: 8px;
    font-size: 14px;
    font-weight: 700;

    /* Inside auto layout */
    flex: none;
    order: 0;
    flex-grow: 0;

    transition: 150ms ease-in-out;

    &:hover {
        cursor: pointer;
        background: ${(props => props.theme.btnOutline)};
    }

    width: ${(props => props.width ? props.width : '100%')};
`;