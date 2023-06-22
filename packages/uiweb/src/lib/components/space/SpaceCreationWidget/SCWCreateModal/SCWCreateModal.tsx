import React, { MouseEventHandler, useState } from 'react'
import styled from 'styled-components'

import { Modal } from '../../reusables/Modal'
import { Button } from '../../reusables/Button';
import { ModalHeader } from '../../reusables/ModalHeader';
import { TextInputWithCounter } from '../../reusables/TextInput';

export interface ISCWCModalProps { // Space Creation Widget Create Modal Interface
    isScheduleVisible?: any;
    closeCreateModal?: MouseEventHandler;
    onInputChange?: any;
    inputValue?: any;
}

export const SCWCreateModal: React.FC<ISCWCModalProps> = (props) => {
    const { isScheduleVisible, closeCreateModal, onInputChange, inputValue } = props;

    return (
        <div>
            <Modal>
                <ModalHeader
                    heading='Create your space'
                    closeCallback={closeCreateModal}
                />

                <TextInputWithCounter
                    labelName='Name'
                    inputValue={inputValue}
                    onInputChange={onInputChange}
                    charCount={50}
                />

                <Button
                    onClick={isScheduleVisible}
                >
                    Create Space
                </Button>
            </Modal>
        </div>
    )
}

/* styling */