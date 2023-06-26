import React, { MouseEventHandler, useState } from 'react'
import styled from 'styled-components'
import { CloseSvg } from 'packages/uiweb/src/lib/icons/CloseSvg';

import { Modal } from '../../reusables/Modal'
import { Button } from '../../reusables/Button';
import { ModalHeader } from '../../reusables/ModalHeader';
import { TextInputWithCounter } from '../../reusables/TextInput';

export interface ISCWCModalProps { // Space Creation Widget Create Modal Interface
    isScheduleVisible?: any;
    closeCreateModal?: MouseEventHandler;
    handleNameChange?: any;
    handleDescriptionChange?: any;
    nameValue?: any;
    descriptionValue?: any;
    isDescriptionEnabled: boolean;
}

export const SCWCreateModal: React.FC<ISCWCModalProps> = (props) => {
    const { 
        isScheduleVisible, closeCreateModal, handleNameChange, handleDescriptionChange, nameValue, descriptionValue, isDescriptionEnabled,
    } = props;

    const secBtn = {
        background: 'transparent',
        borderColor: '#8b5cf6'
    }

    return (
        <div>
            <Modal>
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
                        onClick={isScheduleVisible}
                        width='85%'
                    >
                        Create Space
                    </Button>

                    <Button
                        width='40px'
                        customStyle={secBtn}
                    >
                        <CloseSvg />
                    </Button>
                </ButtonContainer>
            </Modal>
        </div>
    )
}

/* styling */
const ButtonContainer = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
`;