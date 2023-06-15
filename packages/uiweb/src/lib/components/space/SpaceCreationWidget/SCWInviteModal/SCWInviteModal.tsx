import React, { MouseEventHandler } from 'react'
import styled from 'styled-components'

export interface ISCWIModalProps { // Space Creation Widget Create Modal Interface
    closeInviteModal?: MouseEventHandler;
    makeScheduleVisible?: MouseEventHandler;
}
export const SCWInviteModal: React.FC<ISCWIModalProps> = (props) => {
    const { closeInviteModal, makeScheduleVisible } = props;
    return (
        <div>
            <ModalOverlay>
                <ModalParent>
                    Invite Modal

                    <CloseBtn
                        onClick={closeInviteModal}
                    >
                        close invite modal
                    </CloseBtn>

                    <BackBtn
                        onClick={makeScheduleVisible}
                    >
                        back button
                    </BackBtn>
                </ModalParent>
            </ModalOverlay>
        </div>
    )
}

/* styling */
const ModalParent = styled.div<ISCWIModalProps>`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 6rem;
    background-color: green;
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

const CloseBtn = styled.button`
    position: absolute;
    top: 0;
    right: 0;
    margin: 1rem;
`;

const BackBtn = styled.button`
    position: absolute;
    top: 0;
    left: 0;
    margin: 1rem;
`;
