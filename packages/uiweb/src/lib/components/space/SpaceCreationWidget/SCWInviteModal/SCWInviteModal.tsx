import React, { useState, MouseEventHandler } from 'react'
import styled from 'styled-components'

import { ModalHeader } from '../../reusables/ModalHeader';
import { Modal } from '../../reusables/Modal';
import { Button } from '../../reusables/Button';
import { SearchInput } from '../../reusables/SearchInput';

export interface ISCWIModalProps { // Space Creation Widget Create Modal Interface
    closeInviteModal?: MouseEventHandler;
    makeScheduleVisible?: MouseEventHandler;
    createSpace?: MouseEventHandler;
}
export const SCWInviteModal: React.FC<ISCWIModalProps> = (props) => {
    const { closeInviteModal, makeScheduleVisible, createSpace } = props;

    const [invitedMember, setInvitedMember] = useState('')

    const searchMember = (event: any) => {
        setInvitedMember(event.target.value)
    }

    const clearInput = () => {
        setInvitedMember('');
    }

    return (
        <div>
            <Modal>
                <ModalHeader
                    heading='invite to space modal'
                    backCallback={makeScheduleVisible}
                    closeCallback={closeInviteModal}
                />

            <SearchInput
                labelName='Add users'
                inputValue={invitedMember}
                onInputChange={searchMember}
                clearInput={clearInput}
            />

                <Button
                    onClick={createSpace}
                >
                    Schedule Space
                </Button>
            </Modal>
        </div>
    )
}
