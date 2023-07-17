import React, { MouseEventHandler } from 'react'
import styled from 'styled-components'

import { Modal } from '../../reusables/Modal'
import { Button } from '../../reusables/Button';
import { ModalHeader } from '../../reusables/ModalHeader';
import { TextInputWithCounter } from '../../reusables/TextInput';

import { CalendarPurple } from '../../../../icons/CalendarPurple';

export interface ISCWCModalProps { // Space Creation Widget Create Modal Interface
    isInviteVisible?: any;
    closeCreateModal?: MouseEventHandler;
    handleNameChange?: any;
    handleDescriptionChange?: any;
    nameValue?: any;
    descriptionValue?: any;
    isDescriptionEnabled: boolean;
    isScheduleVisible?: any;
    onClose: () => void;
}

export const SCWCreateModal: React.FC<ISCWCModalProps> = (props) => {
    const { 
        isInviteVisible, closeCreateModal, handleNameChange,
        handleDescriptionChange, nameValue, descriptionValue,
        isDescriptionEnabled, isScheduleVisible, onClose,
    } = props;

    const secBtn = {
        background: 'transparent',
        borderColor: '#8b5cf6'
    }

    return (
            <Modal
                clickawayClose={onClose}
            >
                <ModalHeader
                    heading='Create your space'
                    closeCallback={closeCreateModal}
                />

                <TextInputWithCounter
                    labelName='Name'
                    inputValue={nameValue}
                    onInputChange={handleNameChange}
                    charCount={50}
                />

                {
                    isDescriptionEnabled ?
                        <TextInputWithCounter
                            labelName='Description'
                            inputValue={descriptionValue}
                            onInputChange={handleDescriptionChange}
                            charCount={120}
                        />
                    : null
                }

                <ButtonContainer>
                    <Button
                        onClick={isInviteVisible}
                        width='85%'
                    >
                        Create Space
                    </Button>

                    <div title="Schedule your Space">
                        <Button
                            width='40px'
                            height='41px'
                            customStyle={secBtn}
                            onClick={isScheduleVisible}
                        >
                            <CalendarPurple height='20' width='20' />
                        </Button>
                    </div>
                </ButtonContainer>
            </Modal>
    )
}

/* styling */
const ButtonContainer = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
`;