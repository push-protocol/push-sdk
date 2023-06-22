import React from 'react'
import styled from 'styled-components';

export interface ISCWButtonProps {
    btnText?: string;
    customStyle?: any;
}

const defaultProps: ISCWButtonProps = {
    btnText: 'Create your Space',
}

export const SCWButton: React.FC<ISCWButtonProps> = (props) => {
    const { btnText } = props;

    const customStyle = {
        padding: '20px',
        borderRadius: '12px',
    };

    return (
        <CreateButton customStyle={customStyle}>
            {btnText}
        </CreateButton>
    )
}

/* styling */
const CreateButton = styled.button<ISCWButtonProps>`
    padding: ${props => props.customStyle.padding || '1rem'};
    border-radius: ${props => props.customStyle.borderRadius || '1rem'};
`;

SCWButton.defaultProps = defaultProps;

export default SCWButton;
