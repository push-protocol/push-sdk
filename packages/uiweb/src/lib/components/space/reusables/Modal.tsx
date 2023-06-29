/**
 * @file Modal
 * generic modal component for spaces UI
 * does not handle any business logic, acts only as a container
 */
import { useRef } from 'react';
import styled from 'styled-components'

import { useClickAway } from '../../../hooks';

interface IModalProps {
  width?: string;
  clickawayClose?: () => void;
  children: any;
}

const ClickawayCloseModal = ({ children, clickawayClose, width }: IModalProps) => {
  const modalRef = useRef(null);

  useClickAway(modalRef, () => {
    if (clickawayClose) {
      clickawayClose();
    }
  });

  return (
    <ModalParent ref={modalRef} width={width}>
      {children}
    </ModalParent>
  );
};

export const Modal = ({ clickawayClose, children, width }: IModalProps) => {
  return (
    <ModalOverlay>
      {clickawayClose ? (
        <ClickawayCloseModal clickawayClose={clickawayClose} width={width}>{children}</ClickawayCloseModal>
      ) : (
        <ModalParent width={width}>{children}</ModalParent>
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

const ModalParent = styled.div<IModalProps>`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px 20px;

    background: #FFFFFF;
    border-radius: 12px;

    width: ${(props => props.width ? props.width : 'auto')};
`;