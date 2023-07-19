import React, { MouseEventHandler, useContext } from 'react'
import styled from 'styled-components';

import { ISpacesTheme } from '../../theme';
import { ThemeContext } from '../../theme/ThemeProvider';
import { SpacesLogo } from '../../../../icons/SpacesLogo';

export interface ISCWButtonProps { // Space Creation Widget Button Interface
    btnText?: string;
    customStyle?: any;
    theme?: ISpacesTheme;
    onCreate?: MouseEventHandler;
}

const defaultProps: ISCWButtonProps = {
    btnText: 'Create your Space',
    customStyle: {
        padding: '14px 20px',
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
                <SpacesLogo color={theme.btnColorPrimary} />
                <BtnText>
                    {btnText}
                </BtnText>
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

    background: ${(props) => props.theme.btnColorPrimary};
    color: ${(props) => props.theme.titleTextColor};

    display: flex;
    align-items: center;

    font-family: 'Strawford';

    cursor: pointer;
`;

const BtnText = styled.div`
    margin-left: 6px;
`;

SCWButton.defaultProps = defaultProps;

export default SCWButton;
