import React, { useState, MouseEventHandler } from 'react'
import styled from 'styled-components';

import DateTimePicker from '../../reusables/DateTimePicker';

import { Modal } from '../../reusables/Modal';
import { ModalHeader } from '../../reusables/ModalHeader';
import { TextInputWithCounter } from '../../reusables/TextInput';
import { Button } from '../../reusables/Button';

import { CloseSvg } from '../../../../icons/CloseSvg';

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

    const secBtn = {
        background: 'transparent',
        borderColor: '#8b5cf6'
    }

    const handleDateTimeChange = (dateTime: Date) => {
        // Handle the selected date and time here
        console.log(dateTime);
    };

    return (
        <Modal>
            <ModalHeader
                heading='Schedule your space'
                backCallback={makeCreateVisible}
                closeCallback={closeScheduleModal}
            />

            <DateTimePicker
                onDateChange={onDateChange}
                onTimeChange={onTimeChange}
                propsDate={dateValue}
                propsTime={timeValue}
            />

            <ButtonContainer>
                    <Button
                        onClick={makeInviteVisible}
                        width='85%'
                    >
                        Schedule Space
                    </Button>

                    <Button
                        width='40px'
                        customStyle={secBtn}
                    >
                        <CloseSvg />
                    </Button>
                </ButtonContainer>
        </Modal>
    )
}

const ButtonContainer = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
`;
