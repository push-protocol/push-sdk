import React, { useState } from 'react';
import styled from 'styled-components';
import { Modal } from '../reusables/Modal';
import { ModalHeader } from '../reusables/ModalHeader';

export interface ISpaceInvitesProps {
  children?: React.ReactNode;
}

export const SpaceInvites: React.FC<ISpaceInvitesProps> = ({
  children
}: ISpaceInvitesProps) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      {!children && (
        <Button onClick={handleOpenModal}>
          Space Invites
        </Button>
      )}

      {children && (
        <div onClick={handleOpenModal}>
          {children}
        </div>
      )}

      {modalOpen && (
        <Modal clickawayClose={handleCloseModal} width='380px'>
        <ModalHeader
          heading='Spaces Invites'
          closeCallback={handleCloseModal}
        />
        </Modal>
      )}
    </>
  );
};

const Button = styled.button`
  padding: 8px 16px;
  background-color: #8B5CF6;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;
