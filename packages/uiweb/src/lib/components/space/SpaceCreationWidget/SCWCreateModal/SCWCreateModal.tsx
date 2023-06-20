import React, { MouseEventHandler, useState } from 'react'
import styled from 'styled-components'

import { Modal } from '../common/Modal'

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
                <button
                    onClick={isScheduleVisible}
                >
                    Schedule Space
                </button>

                <input
                    type="text"
                    value={inputValue}
                    onChange={onInputChange}
                />

                <CloseBtn
                    onClick={closeCreateModal}
                >
                    close create modal
                </CloseBtn>
            </Modal>
        </div>
    )
}

/* styling */

const CloseBtn = styled.button`
    position: absolute;
    top: 0;
    right: 0;
    margin: 1rem;
`;