import React, { MouseEventHandler } from 'react'
import styled from 'styled-components'
import { Modal } from '../common/Modal';
import { ModalHeader } from '../common/ModalHeader';
import { TextInputWithCounter } from '../common/TextInput';
import { Button } from '../common/Button';

export interface ISCWSModalProps { // Space Creation Widget Schedule Modal Interface
    closeScheduleModal?: MouseEventHandler;
    makeCreateVisible?: MouseEventHandler;
    makeInviteVisible?: MouseEventHandler;

    dateValue?: any;
    onDateChange?: any;
    timeValue?: any;
    onTimeChange?: any;
}

export const SCWScheduleModal: React.FC<ISCWSModalProps> = (props) => {

    const { closeScheduleModal, makeCreateVisible, makeInviteVisible, dateValue, timeValue, onDateChange, onTimeChange } = props;

    return (
        <Modal>
            <ModalHeader
                heading='Schedule space modal'
                backCallback={makeCreateVisible}
                closeCallback={closeScheduleModal}
            />

            <TextInputWithCounter
                labelName='Date'
                inputValue={dateValue}
                onInputChange={onDateChange}
                charCount={12}
            />

            <TextInputWithCounter
                labelName='Time'
                inputValue={timeValue}
                onInputChange={onTimeChange}
                charCount={12}
            />

            <Button
                onClick={makeInviteVisible}
            >
                Schedule Space
            </Button>
        </Modal>
    )
}
