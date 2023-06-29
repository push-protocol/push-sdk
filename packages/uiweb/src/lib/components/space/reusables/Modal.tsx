/**
 * @file Modal
 * generic modal component for spaces UI
 * does not handle any business logic, acts only as a container
 */
import { useRef } from 'react';
import styled from 'styled-components'

import { useClickAway } from '../../../hooks';

interface ModalProps {
  clickawayClose?: () => void;
  children: React.ReactNode;
}

const ClickawayCloseModal = ({ children, clickawayClose }: ModalProps) => {
  const modalRef = useRef(null);

  useClickAway(modalRef, () => {
    if (clickawayClose) {
      clickawayClose();
    }
  });

  return (
    <ModalParent ref={modalRef}>
      {children}
    </ModalParent>
  );
};

export const Modal = ({ clickawayClose, children }: ModalProps) => {
  return (
    <ModalOverlay>
      {clickawayClose ? (
        <ClickawayCloseModal clickawayClose={clickawayClose}>{children}</ClickawayCloseModal>
      ) : (
        <ModalParent>{children}</ModalParent>
      )}
    </ModalOverlay>
  );
};

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

    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px 16px;

    background: #FFFFFF;
    border-radius: 12px;
`;