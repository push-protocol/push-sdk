/**
 * @file Button
 * generic button component for spaces
 * Represents the props for the Button component.
 * @interface IButtonProps
 * @property {string} [width] - The width of the button. Optional.
 * @property {React.ReactNode} children - The content of the button.
 * @property {React.MouseEventHandler} [onClick] - The click event handler for the button. Optional.
 * @property {ISpacesTheme} [theme] - The theme for the button. Optional.
 * @property {any} [customStyle] - Custom styles for the button. Optional.
 */

import { MouseEventHandler, useContext } from 'react'
import styled from 'styled-components';

import { ISpacesTheme } from '../theme';
import { ThemeContext } from '../theme/ThemeProvider';

export interface IButtonProps {
    width?: string;
    height?: string;
    children: any;
    onClick?: MouseEventHandler;
    theme?: ISpacesTheme;
    customStyle?: any;
}

/**
 * A button component.
 * @function Button
 * @param {IButtonProps} props - The props for the Button component.
 * @returns {JSX.Element} The rendered Button component.
 */
export const Button: React.FC<IButtonProps> = (props) => {
    const theme = useContext(ThemeContext);

    const { onClick, width, height, customStyle } = props;

    return (
        <SpacesButton
            onClick={onClick}
            width={width}
            height={height}
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
    padding: ${(props => props.customStyle ? props.customStyle.padding : '10px 16px')};
    margin-top: 12px;

    background: ${(props => props.customStyle ? props.customStyle.background : props.theme.btnColorPrimary)};
    border: 2px solid ${(props => props.customStyle ? props.customStyle.borderColor : props.theme.btnOutline)};
    color: ${(props => props.customStyle ? props.customStyle.color : props.theme.titleTextColor)};
    border-radius: 8px;
    font-size: 14px;
    font-weight: ${(props => props.customStyle ? props.customStyle.fontWeight : '700')};
    font-family: 'Strawford'; // update to fontFamily theme 

    /* Inside auto layout */
    flex: none;
    order: 0;
    flex-grow: 0;

    transition: 150ms ease-in-out;

    &:hover {
        cursor: pointer;
    }

    width: ${(props => props.width ? props.width : '100%')};
    height: ${(props => props.height ? props.height : '100%')};
`;