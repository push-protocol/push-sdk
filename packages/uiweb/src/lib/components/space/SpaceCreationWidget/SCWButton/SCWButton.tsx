import React, { useContext, useState } from 'react'
import styled from 'styled-components';

import { SCWCreateModal } from '../SCWCreateModal/SCWCreateModal'
import { SCWScheduleModal } from '../SCWScheduleModal/SCWScheduleModal';
import { SCWInviteModal } from '../SCWInviteModal/SCWInviteModal';

import { ISpacesTheme } from '../../theme';
import { ThemeContext } from '../../theme/ThemeProvider';

export interface ISCWButtonProps { // Space Creation Widget Button Interface
    btnText?: string;
    customStyle?: any;
    theme?: ISpacesTheme;
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
    const { btnText, customStyle } = props;

    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isScheduleModalVisible, setIsScheduleModalVisible] = useState(false);
    const [isInviteModalVisible, setIsInviteModalVisible] = useState(false);

    const [spaceState, setSpaceState] = useState({
        spaceName: '',
        date: '',
        time: '',
    })

    const handleNameChange = (event: any) => {
        setSpaceState({spaceName: event.target.value, date: '', time: ''})
    };

    // const handleDateTimeChange = (event) => {
    //     setSpaceState({date: '', time: ''})
    // }

    const theme = useContext(ThemeContext);

    const showCreateSpace = () => {
        setIsCreateModalVisible(!isCreateModalVisible);
        setIsScheduleModalVisible(false);
    }

    const showScheduleSpace = () => {
        setIsScheduleModalVisible(!isScheduleModalVisible);
        setIsCreateModalVisible(false);
        setIsInviteModalVisible(false);
    }

    const showInviteSpace = () => {
        setIsInviteModalVisible(!isInviteModalVisible);
        setIsScheduleModalVisible(false);
    }

    const closeCreateModal = () => {
        setIsCreateModalVisible(false);
    }

    const closeScheduleModal = () => {
        setIsScheduleModalVisible(false);
    }

    const closeInviteModal = () => {
        setIsInviteModalVisible(false);
    }

    return (
        <div>
            <CreateButton
                customStyle={customStyle}
                theme={theme}
                onClick={showCreateSpace}
            >
                {btnText}
            </CreateButton>

            {spaceState.spaceName}

            {isCreateModalVisible &&
                <SCWCreateModal
                    isScheduleVisible={showScheduleSpace}
                    closeCreateModal={closeCreateModal}
                    inputValue={spaceState.spaceName}
                    onInputChange={handleNameChange}
                />
            }

            {isScheduleModalVisible &&
                <SCWScheduleModal
                    closeScheduleModal={closeScheduleModal}
                    makeCreateVisible={showCreateSpace}
                    makeInviteVisible={showInviteSpace}
                    // dateValue={spaceState.date}
                    // onDateChange={handleDateTimeChange}
                    // timeValue={spaceState.time}
                />
            }

            {isInviteModalVisible &&
                <SCWInviteModal
                    closeInviteModal={closeInviteModal}
                    makeScheduleVisible={showScheduleSpace}
                />
            }
        </div>
    )
}

/* styling */
const CreateButton = styled.button<ISCWButtonProps>`
    padding: ${props => props.customStyle.padding};
    border-radius: ${props => props.customStyle.borderRadius};
    border: ${props => props.customStyle.border};
    font-size: ${props => props.customStyle.fontSize};

    background-image: ${(props) => props.theme.bannerBackground1};
    color: ${(props) => props.theme.secondary};

    cursor: pointer;
`;

SCWButton.defaultProps = defaultProps;

export default SCWButton;
