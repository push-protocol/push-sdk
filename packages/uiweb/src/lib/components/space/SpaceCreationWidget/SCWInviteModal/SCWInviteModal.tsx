import React, { useState, MouseEventHandler, useContext } from 'react'
import styled from 'styled-components'
import * as PushAPI from '@pushprotocol/restapi';

import { ModalHeader } from '../../reusables/ModalHeader';
import { Modal } from '../../reusables/Modal';
import { Button } from '../../reusables/Button';
import { SearchInput } from '../../reusables/SearchInput';
import { ProfileContainer } from '../../reusables/ProfileContainer';
import { ThemeContext } from '../../theme/ThemeProvider';
import { Spinner } from '../../reusables/Spinner';

import CircularProgressSpinner from '../../../loader/loader';

import { useSpaceData } from '../../../../hooks';
import SettingsIcon from '../../../../icons/settingsBlack.svg';
import { Image } from '../../../../config';

export interface ISCWIModalProps { // Space Creation Widget Create Modal Interface
    closeInviteModal?: MouseEventHandler;
    makeScheduleVisible?: MouseEventHandler;
    createSpace?: MouseEventHandler;
    isLoading?: boolean;
    invitedMembersList?: any;
    setInvitedMembersList?: any;
    invitedAddressList?: any;
    setInvitedAddressList?: any;
    adminsList?: any;
    setAdminsList?: any;
    adminsAddressList?: any;
    setAdminsAddressList?: any;
    onClose: () => void;
}

interface User {
    handle: string;
    name: string;
}

export const SCWInviteModal: React.FC<ISCWIModalProps> = (props) => {
    const {
        closeInviteModal, makeScheduleVisible, createSpace, isLoading,
        invitedMembersList,
        setInvitedMembersList,
        invitedAddressList,
        setInvitedAddressList,
        adminsList,
        setAdminsList,
        adminsAddressList,
        setAdminsAddressList,
        onClose
    } = props;

    const { env } = useSpaceData();

    const theme = useContext(ThemeContext);

    const [invitedMember, setInvitedMember] = useState('')
    const [loadingAccount, setLoadingAccount] = useState(false)

    const [searchedUser, setSearchedUser]= useState<any>({});
    const [errorMsg, setErrorMsg] = useState<any>('');

    const searchMember = async (event: any) => {
        setInvitedMember(event.target.value)

        try {
            setLoadingAccount(true);
            const response = await PushAPI.user.get({
                account: event.target.value,
                env,
            });

            setSearchedUser(response);
            setErrorMsg('');
        } catch (e:any) {
            console.error(e.message);
            setSearchedUser({});
            setErrorMsg(e.message);
        } finally {
            setLoadingAccount(false);
        }
    }

    const clearInput = () => {
        setInvitedMember('');
        setSearchedUser({});
        setErrorMsg('');
    }

    const handleInviteMember = (user: any) => {
        setInvitedAddressList([...invitedAddressList, user.did.substring(7)])
        setInvitedMembersList([...invitedMembersList, user]);

        clearInput();
    }

    const handlePromoteToAdmin = (user: any) => {
        setAdminsList([...adminsList, user])
        setAdminsAddressList([...adminsAddressList, user.did.substring(7)]);

        const updatedArray = invitedMembersList.filter((item: any) => item !== user)
        setInvitedMembersList(updatedArray);

        clearInput();
    }

    const handleDeleteInvitedUser = (user: any) => {
        const updatedArray = invitedMembersList.filter((item: any) => item !== user)
        setInvitedMembersList(updatedArray);
    };

    const tempImageUrl = "https://imgv3.fotor.com/images/blog-richtext-image/10-profile-picture-ideas-to-make-you-stand-out.jpg";

    return (
        <div>
            <Modal
                clickawayClose={onClose}
            >
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
                {errorMsg}

                <MembersList>
                    {loadingAccount && <Spinner />}
                    {
                        Object.keys(searchedUser).length === 0 ?
                        null
                        : <ProfileContainer
                            imageHeight='48px'
                            handle={searchedUser.did.substring(7)}
                            // handle='test'
                            name={searchedUser.profile.name ?? searchedUser.did.substring(7)}
                            imageUrl={searchedUser.profile.picture}
                            contBtn={<ContBtn>Add +</ContBtn>}
                            btnCallback={() => handleInviteMember(searchedUser)}
                            border
                        />
                    }
                </MembersList>

                {
                    invitedMembersList.length ?
                    <InvitedList>
                        <Heading>Invited Members <PendingCount theme={theme}>{invitedMembersList.length}</PendingCount></Heading>
                        {
                            invitedMembersList.map((item: any) => {
                                return <ProfileContainer
                                    imageHeight='48px'
                                    handle={item.did.substring(7)}
                                    name={item.profile.name ?? item.did.substring(7)}
                                    imageUrl={item.profile.picture}
                                    contBtn={
                                        <SettingsCont>
                                            <Image
                                                alt="Settings icon"
                                                height={'40px'}
                                                src={SettingsIcon}
                                            />
                                        </SettingsCont>
                                    }
                                    // btnCallback={() => handleDeleteInvitedUser(item)}
                                    removeCallback={() => handleDeleteInvitedUser(item)}
                                    promoteCallback={() => handlePromoteToAdmin(item)}
                                    border
                                />
                            })
                        }
                    </InvitedList>
                    : null
                }

                {
                    adminsList.length ?
                    <InvitedList>
                        <Heading>Speakers <PendingCount theme={theme}>{adminsList.length}</PendingCount></Heading>
                        {
                            adminsList.map((item: any) => {
                                return <ProfileContainer
                                    imageHeight='48px'
                                    handle={item.did.substring(7)}
                                    name={item.profile.name ?? item.did.substring(7)}
                                    imageUrl={item.profile.picture}
                                    contBtn={
                                        <SettingsCont>
                                            <Image
                                                alt="Settings icon"
                                                height={'40px'}
                                                src={SettingsIcon}
                                            />
                                        </SettingsCont>
                                    }
                                    // btnCallback={() => handleDeleteInvitedUser(item)}
                                    removeCallback={() => handleDeleteInvitedUser(item)}
                                    // promoteCallback={() => handlePromoteToAdmin(item)}
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

const SettingsCont = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;

    cursor: pointer;
`;

const ContBtn = styled.button`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: 8px;
    line-height: 18px;
    width: max-content;
    background: transparent;
    color: #8B5CF6;
    border-radius: 6px;
    font-weight: 500;
    font-size: 12px;
    padding: 4px 8px;
    border-radius: 8px;
    border: 1px solid #8B5CF6;
    cursor: pointer;
`;