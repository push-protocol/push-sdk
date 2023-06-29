import React from 'react';

import { Modal } from '../reusables/Modal';
import { ModalHeader } from '../reusables/ModalHeader';

interface ISpaceMembersModalProps {
  onClose: () => void;
}

export const SpaceMembersSectionModal: React.FC<ISpaceMembersModalProps> = ({ onClose }: ISpaceMembersModalProps) => {

    return (
      <Modal clickawayClose={onClose}>
        <ModalHeader
          heading='Members'
          closeCallback={onClose}
        />
      </Modal>
    )
}

/* styling */
// const ButtonContainer = styled.div`
//     display: flex;
//     justify-content: space-between;
//     width: 100%;
// `;