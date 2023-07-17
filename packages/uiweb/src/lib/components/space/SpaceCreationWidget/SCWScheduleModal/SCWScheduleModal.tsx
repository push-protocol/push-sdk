import React, { MouseEventHandler } from 'react'
import styled from 'styled-components';

import DateTimePicker from '../../reusables/DateTimePicker';

import { Modal } from '../../reusables/Modal';
import { ModalHeader } from '../../reusables/ModalHeader';
import { Button } from '../../reusables/Button';

export interface ISCWSModalProps { // Space Creation Widget Schedule Modal Interface
    closeScheduleModal?: MouseEventHandler;
    makeCreateVisible?: MouseEventHandler;
    makeInviteVisible?: MouseEventHandler;

    dateValue?: any;
    onDateChange?: any;
    timeValue?: any;
    onTimeChange?: any;

    onClose: () => void;
}

export const SCWScheduleModal: React.FC<ISCWSModalProps> = (props) => {

    const { closeScheduleModal, makeCreateVisible, makeInviteVisible, dateValue, timeValue, onDateChange, onTimeChange, onClose } = props;

    return (
        <Modal
            clickawayClose={onClose}
        >
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
                    >
                        Schedule Space
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
