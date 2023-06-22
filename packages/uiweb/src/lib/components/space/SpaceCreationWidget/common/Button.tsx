/**
 * @file 
 */

import React, { MouseEventHandler } from 'react'
import styled from 'styled-components';

export interface IButtonProps {
    width?: string;
    children?: any;
    onClick?: MouseEventHandler;
}

export const Button = (props: IButtonProps) => {
    const { onClick, width } = props;
    return (
        <SpacesButton
            onClick={onClick}
            width={width}
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
    padding: 16px;

    background: #8B5CF6;
    border: 1px solid #703BEB;
    color: white;
    border-radius: 8px;

    /* Inside auto layout */
    flex: none;
    order: 0;
    flex-grow: 0;

    transition: 150ms ease-in-out;

    &:hover {
        cursor: pointer;
        background: #703BEB;
    }

    width: ${(props => props.width ? props.width : '100%')};
`;