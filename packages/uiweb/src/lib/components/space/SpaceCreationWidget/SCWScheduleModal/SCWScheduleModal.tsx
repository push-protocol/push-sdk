import React, { MouseEventHandler } from 'react'
import styled from 'styled-components'

export interface ISCWSModalProps { // Space Creation Widget Schedule Modal Interface
    closeScheduleModal?: MouseEventHandler;
    makeCreateVisible?: MouseEventHandler;
    makeInviteVisible?: MouseEventHandler;
}

export const SCWScheduleModal: React.FC<ISCWSModalProps> = (props) => {

    const { closeScheduleModal, makeCreateVisible, makeInviteVisible } = props;

    return (
        <ModalOverlay>
            <ModalParent>
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

                <button
                    onClick={makeInviteVisible}
                >
                    open invite modal
                </button>
            </ModalParent>
        </ModalOverlay>
    )
}

/* styling */
const ModalParent = styled.div<ISCWSModalProps>`
    position: absolute;
    top: 60%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 4rem;
    background-color: blue;
`;

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4); /* Black with 50% opacity */
    display: flex;
    justify-content: center;
    align-items: center;
`;

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