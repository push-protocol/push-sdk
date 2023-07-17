/**
 * @file Modal
 * generic modal component for spaces UI
 * does not handle any business logic, acts only as a container
 */
import { useRef, useContext } from 'react';
import styled from 'styled-components'

import { ThemeContext } from '../theme/ThemeProvider';

import { useClickAway } from '../../../hooks';

interface IModalProps {
    width?: string;
    clickawayClose?: () => void;
    children: any;
}

const ClickawayCloseModal = ({ children, clickawayClose, width }: IModalProps) => {
    const modalRef = useRef(null);
    const theme = useContext(ThemeContext)

    useClickAway(modalRef, () => {
        if (clickawayClose) {
        clickawayClose();
        }
    });

    return (
        <ModalParent ref={modalRef} width={width} theme={theme}>
          {children}
        </ModalParent>
    );
};

export const Modal = ({ clickawayClose, children, width }: IModalProps) => {
    const theme = useContext(ThemeContext)
    return (
        <ModalOverlay theme={theme}>
        {clickawayClose ? (
            <ClickawayCloseModal clickawayClose={clickawayClose} width={width}>{children}</ClickawayCloseModal>
        ) : (
            <ModalParent
                width={width}
                theme={theme}
            >
                { children }
            </ModalParent>
        )}
        </ModalOverlay>
    );
};

/* styling */

const ModalOverlay = styled.div<IModalProps>`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4); /* Black with 40% opacity */
    display: flex;
    color: ${props => props.theme.textColorPrimary ?? '#000'};
    justify-content: center;
    align-items: center;
`;

const ModalParent = styled.div<IModalProps>`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px 20px;

    background: ${(props => props.theme.bgColorPrimary)};
    border-radius: 12px;

    width: ${(props => props.width ? props.width : 'auto')};
`;