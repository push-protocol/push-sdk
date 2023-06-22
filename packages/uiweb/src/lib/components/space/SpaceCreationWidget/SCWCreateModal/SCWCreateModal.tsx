import React, { MouseEventHandler, useState } from 'react'
import styled from 'styled-components'

import { Modal } from '../common/Modal'
import { Button } from '../common/Button';
import { ModalHeader } from '../common/ModalHeader';
import { TextInputWithCounter } from '../common/TextInput';

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