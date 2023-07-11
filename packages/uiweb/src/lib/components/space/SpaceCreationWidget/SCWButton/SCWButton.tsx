import React, { MouseEventHandler, useContext } from 'react'
import styled from 'styled-components';

import { ISpacesTheme } from '../../theme';
import { ThemeContext } from '../../theme/ThemeProvider';

export interface ISCWButtonProps { // Space Creation Widget Button Interface
    btnText?: string;
    customStyle?: any;
    theme?: ISpacesTheme;
    onCreate?: MouseEventHandler;
}

const defaultProps: ISCWButtonProps = {
    btnText: 'Create your Space',
    customStyle: {
        padding: '20px',
        borderRadius: '12px',
        border: '0px solid transparent',
        fontSize: '1rem',
    },
}

export const SCWButton: React.FC<ISCWButtonProps> = (props) => {
    const { btnText, customStyle, onCreate } = props;
    
    const theme = useContext(ThemeContext);

    return (
        <div>
            <CreateButton
                customStyle={customStyle}
                theme={theme}
                onClick={onCreate}
            >
                {btnText}
            </CreateButton>
        </div>
    )
}

/* styling */
const CreateButton = styled.button<ISCWButtonProps>`
    padding: ${props => props.customStyle.padding};
    border-radius: ${props => props.customStyle.borderRadius};
    border: ${props => props.customStyle.border};
    font-size: ${props => props.customStyle.fontSize};

    background-image: ${(props) => props.theme.titleBg};
    color: ${(props) => props.theme.titleTextColor};

    cursor: pointer;
`;

SCWButton.defaultProps = defaultProps;

export default SCWButton;
