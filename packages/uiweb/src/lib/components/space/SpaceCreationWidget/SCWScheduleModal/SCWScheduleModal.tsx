import React, { MouseEventHandler } from 'react'
import styled from 'styled-components';

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


    return (
        <Modal>
            <ModalHeader
                heading='Schedule your space'
                backCallback={makeCreateVisible}
                closeCallback={closeScheduleModal}
            />

            <TextInputWithCounter
                labelName='Select date and time'
                inputValue={dateValue}
                onInputChange={onDateChange}
                charCount={12}
            />

            <TextInputWithCounter
                inputValue={timeValue}
                onInputChange={onTimeChange}
                charCount={12}
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
