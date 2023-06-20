import React, { MouseEventHandler, useState } from 'react'
import styled from 'styled-components'

export interface IModalProps { // Space Creation Widget Create Modal Interface
    isVisible?: any;
    closeModal?: MouseEventHandler;
    onInputChange?: any;
    inputValue?: any;
    children?: any;
}

export const Modal: React.FC<IModalProps> = (props) => {
    // const { isVisible, closeModal, onInputChange, inputValue } = props;

    return (
        <div>
            <ModalOverlay>
                <ModalParent>
                    { props.children }
                </ModalParent>
            </ModalOverlay>
        </div>
    )
}

/* styling */

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

// const ModalParent = styled.div<IModalProps>`
const ModalParent = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 5rem;
    background-color: red;

    display: flex;
    flex-direction: column;
`;