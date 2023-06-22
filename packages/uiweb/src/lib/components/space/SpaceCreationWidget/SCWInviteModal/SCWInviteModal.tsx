import React, { MouseEventHandler } from 'react'
import styled from 'styled-components'
import { ModalHeader } from '../../reusables/ModalHeader';
import { Modal } from '../../reusables/Modal';
import { Button } from '../../reusables/Button';

export interface ISCWIModalProps { // Space Creation Widget Create Modal Interface
    closeInviteModal?: MouseEventHandler;
    makeScheduleVisible?: MouseEventHandler;
    createSpace?: MouseEventHandler;
}
export const SCWInviteModal: React.FC<ISCWIModalProps> = (props) => {
    const { closeInviteModal, makeScheduleVisible, createSpace } = props;
    return (
        <div>
            <Modal>
                <ModalHeader
                    heading='invite to space modal'
                    backCallback={makeScheduleVisible}
                    closeCallback={closeInviteModal}
                />

                <Button
                    onClick={createSpace}
                    width='500px'
                >
                    Schedule Space
                </Button>
            </Modal>
        </div>
    )
}
