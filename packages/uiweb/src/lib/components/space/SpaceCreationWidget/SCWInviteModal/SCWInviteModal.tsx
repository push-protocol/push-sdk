import React, { useState, MouseEventHandler } from 'react'
import styled from 'styled-components'

import { ModalHeader } from '../../reusables/ModalHeader';
import { Modal } from '../../reusables/Modal';
import { Button } from '../../reusables/Button';
import { SearchInput } from '../../reusables/SearchInput';
import { ProfileContainer } from '../../reusables/ProfileContainer';

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

    const tempImageUrl = "https://imgv3.fotor.com/images/blog-richtext-image/10-profile-picture-ideas-to-make-you-stand-out.jpg";

    const TEMP_MEMBERS = [
        {
            handle: 's4m4',
            name: 'Samarendra'
        },
        {
            handle: 'aamsa',
            name: 'Aam Saltman'
        },
    ]

    return (
        <div>
            <Modal>
                <ModalHeader
                    heading='Invite members'
                    backCallback={makeScheduleVisible}
                    closeCallback={closeInviteModal}
                />

                <SearchInput
                    labelName='Add users'
                    inputValue={invitedMember}
                    onInputChange={searchMember}
                    clearInput={clearInput}
                />

                <MembersList>
                    {
                        TEMP_MEMBERS.map((item) => {
                            return <ProfileContainer
                                        imageHeight='48px'
                                        handle={item.handle}
                                        name={item.name}
                                        imageUrl={tempImageUrl}
                                        tag='Add +'
                                        border
                                    />  
                        })
                    }
                </MembersList>

                <InvitedList>
                    {
                        TEMP_MEMBERS.map((item) => {
                            return <ProfileContainer
                                        imageHeight='48px'
                                        handle={item.handle}
                                        name={item.name}
                                        imageUrl={tempImageUrl}
                                        tag='Add +'
                                        border
                                    />  
                        })
                    }
                </InvitedList>

                <Button
                    onClick={createSpace}
                    width='max-content'
                >
                    Create Space
                </Button>
            </Modal>
        </div>
    )
}


const MembersList = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const InvitedList = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;

    margin-top: 28px;
`;