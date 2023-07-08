import React, { useState, MouseEventHandler, useContext } from 'react'
import styled from 'styled-components'

import CircularProgressSpinner from '../../../loader/loader';

import { ModalHeader } from '../../reusables/ModalHeader';
import { Modal } from '../../reusables/Modal';
import { Button } from '../../reusables/Button';
import { SearchInput } from '../../reusables/SearchInput';
import { ProfileContainer } from '../../reusables/ProfileContainer';
import { ThemeContext } from '../../theme/ThemeProvider';

export interface ISCWIModalProps { // Space Creation Widget Create Modal Interface
    closeInviteModal?: MouseEventHandler;
    makeScheduleVisible?: MouseEventHandler;
    createSpace?: MouseEventHandler;
    isLoading?: boolean;
    tempMembers?: any;
    setTempMembers?: any;
    invitedMembersList?: any;
    setInvitedMembersList?: any;
}

interface User {
    handle: string;
    name: string;
}

export const SCWInviteModal: React.FC<ISCWIModalProps> = (props) => {
    const {
        closeInviteModal, makeScheduleVisible, createSpace, isLoading,
        tempMembers,
        setTempMembers,
        invitedMembersList,
        setInvitedMembersList,
    } = props;

    const theme = useContext(ThemeContext);

    const [invitedMember, setInvitedMember] = useState('')

    // const [tempMembers, setTempMembers] = useState<User[]>([
    //     {
    //         handle: 's4m4',
    //         name: 'Samarendra'
    //     },
    //     {
    //         handle: 'aamsa',
    //         name: 'Aam Saltman'
    //     },
    // ])

    // const [invitedMembersList, setInvitedMembersList] = useState<User[]>([])

    const searchMember = (event: any) => {
        setInvitedMember(event.target.value)
    }

    const clearInput = () => {
        setInvitedMember('');
    }

    const handleInviteUser = (index: any) => {
        console.log('logged')
        const user = tempMembers[index];

        const updatedTempArray = [...tempMembers];
        updatedTempArray.splice(index, 1);
        setTempMembers(updatedTempArray);

        setInvitedMembersList([...invitedMembersList, user]);
    };

    const handleDeleteInvitedUser = (index: number) => {
        const updatedArray = [...invitedMembersList];
        updatedArray.splice(index, 1);
        setInvitedMembersList(updatedArray);
    };

    const tempImageUrl = "https://imgv3.fotor.com/images/blog-richtext-image/10-profile-picture-ideas-to-make-you-stand-out.jpg";

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
                        tempMembers.map((item: any, index: any) => {
                            return <ProfileContainer
                                        imageHeight='48px'
                                        handle={item.handle}
                                        name={item.name}
                                        imageUrl={tempImageUrl}
                                        contBtn='Add +'
                                        btnCallback={() => handleInviteUser(index)}
                                        border
                                    />  
                        })
                    }
                </MembersList>

                {
                    invitedMembersList.length ?
                    <InvitedList>
                        <Heading>Invited Members <PendingCount theme={theme}>{invitedMembersList.length}</PendingCount></Heading>
                        {
                            invitedMembersList.map((item: any, index: number) => {
                                return <ProfileContainer
                                            imageHeight='48px'
                                            handle={item.handle}
                                            name={item.name}
                                            imageUrl={tempImageUrl}
                                            contBtn='x'
                                            btnCallback={() => handleDeleteInvitedUser(index)}
                                            border
                                        />  
                            })
                        }
                    </InvitedList>
                    : null
                }

                <Button
                    onClick={createSpace}
                    width='max-content'
                >
                    {
                        isLoading ?
                        <CircularProgressSpinner />
                        : 'Create Space'
                    }
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

const Heading = styled.div`
    display: flex;
    align-items: center;
`;

const PendingCount = styled.div`
    background: ${(props => props.theme.btnColorPrimary)};
    border-radius: 8px;
    padding: 4px 10px;
    margin-left: 6px;
    font-size: 13px;
    color: ${(props => props.theme.titleTextColor)};
`;