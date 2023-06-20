import React, { MouseEventHandler } from 'react'
import styled from 'styled-components'
import { Modal } from '../common/Modal';

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
            Schedule Modal

            <CloseBtn
                onClick={closeScheduleModal}
            >
                close Schedule modal
            </CloseBtn>

            <BackBtn
                onClick={makeCreateVisible}
            >
                back button
            </BackBtn>

            <input
                type="text"
                value={dateValue}
                onChange={onDateChange}
            />

            <input
                type="text"
                value={timeValue}
                onChange={onTimeChange}
            />

            <button
                onClick={makeInviteVisible}
            >
                open invite modal
            </button>
        </Modal>
    )
}

/* styling */
const BackBtn = styled.button`
    position: absolute;
    top: 0;
    left: 0;
    margin: 1rem;
`;

const CloseBtn = styled.button`
    position: absolute;
    top: 0;
    right: 0;
    margin: 1rem;
`;