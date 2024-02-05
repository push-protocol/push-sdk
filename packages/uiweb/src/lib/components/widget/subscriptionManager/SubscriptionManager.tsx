import React, { useContext } from 'react';
import { ISubscriptionManagerProps } from './types';
import { Modal, ModalHeader } from '../reusables';
import { Section } from '../../reusables';

// /**
//  * @interface IThemeProps
//  * this interface is used for defining the props for styled components
//  */
// interface IThemeProps {
// }

export const SubscriptionManager: React.FC<ISubscriptionManagerProps> = (
  options: ISubscriptionManagerProps
) => {
  const { channelAddress, modalBackground, modalPositionType, onClose } =
    options || {};
  return (
    <Modal
      clickawayClose={onClose}
      modalBackground={modalBackground}
      modalPositionType={modalPositionType}
    >
      <Section
        flexDirection="column"
        alignItems="center"
        gap="16px"
        overflow="hidden auto"
        justifyContent="start"
      >
        <ModalHeader title="Subscribe to get Notified" handleClose={onClose} />
      </Section>
    </Modal>
  );
};
