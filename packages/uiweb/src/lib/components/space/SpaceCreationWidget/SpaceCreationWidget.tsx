import { useState } from 'react'
import styled from 'styled-components';
import * as PushAPI from '@pushprotocol/restapi';

import { SCWCreateModal } from './SCWCreateModal/SCWCreateModal'
import { SCWScheduleModal } from './SCWScheduleModal/SCWScheduleModal';
import { SCWInviteModal } from './SCWInviteModal/SCWInviteModal';
import { SCWButton } from './SCWButton';

import { useSpaceData } from '../../../hooks';

export interface ISpaceCreateWidgetProps {
    children?: React.ReactNode;
}

export const SpaceCreationWidget:React.FC<ISpaceCreateWidgetProps> = (props) => {
    const { children } = props;

    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isScheduleModalVisible, setIsScheduleModalVisible] = useState(false);
    const [isInviteModalVisible, setIsInviteModalVisible] = useState(false);

    const [invitedMembersList, setInvitedMembersList] = useState([])
    const [invitedAddressList, setInvitedAddressList] = useState([])

    const [adminsList, setAdminsList] = useState([])
    const [adminsAddressList, setAdminsAddressList] = useState([])

    const [isLoading, setLoading] = useState(false);

    const [spaceState, setSpaceState] = useState({
        spaceName: '',
        spaceDescription: '',
        date: new Date(),
        time: Date.now(),
    })

    const { signer, env, account, pgpPrivateKey } = useSpaceData();

    const handleNameChange = (event: any) => {
        setSpaceState((prevState) => ({...prevState, spaceName: event.target.value}))
    };

    const handleDescriptionChange = (event: any) => {
        setSpaceState((prevState) => ({...prevState, spaceDescription: event.target.value}))
    };

    const onDateChange = (dateValue: any) => {
        setSpaceState((prevState) => ({...prevState, date: dateValue}))
    };

    const onTimeChange = (timeValue: any) => {
        setSpaceState((prevState) => ({...prevState, time: timeValue}))
    };

    const showCreateSpace = () => {
        setIsCreateModalVisible(!isCreateModalVisible);
        setIsScheduleModalVisible(false);
        setIsInviteModalVisible(false);
    }

    const showScheduleSpace = () => {
        setIsScheduleModalVisible(!isScheduleModalVisible);
        setIsCreateModalVisible(false);
        setIsInviteModalVisible(false);
    }

    const showInviteSpace = () => {
        setIsInviteModalVisible(!isInviteModalVisible);
        setIsScheduleModalVisible(false);
        setIsCreateModalVisible(false);
    }

    const closeCreateModal = () => {
        setIsCreateModalVisible(false);
    }

    const closeScheduleModal = () => {
        setIsScheduleModalVisible(false);
    }

    const closeInviteModal = () => {
        setIsInviteModalVisible(false);
    }

    const clearAllState = () => {
        setIsCreateModalVisible(false)
        setIsScheduleModalVisible(false)
        setIsInviteModalVisible(false)
        setInvitedMembersList([])
        setInvitedAddressList([])
        setAdminsList([])
        setAdminsAddressList([])
        setLoading(false)
        setSpaceState({
            spaceName: '',
            spaceDescription: '',
            date: new Date(),
            time: Date.now(),
        })
    }

    const createSpace = async () => {
        const spaceCreate = {
            spaceName: spaceState.spaceName.length === 0 ? `${account}'s Space` : spaceState.spaceName,
            spaceDescription: 'Push Space',
            listeners: invitedAddressList,
            spaceImage: 'asd',
            speakers: adminsAddressList,
            isPublic: true,
            scheduleAt: spaceState.time > Date.now() ? new Date(spaceState.time) : new Date(Date.now() + 120000),
            signer: signer as PushAPI.SignerType,
            env,
            ...(pgpPrivateKey && pgpPrivateKey !== '' && { pgpPrivateKey }), // Conditionally add pgpPrivateKey
        }

        try {
            setLoading(true);
            const response = await PushAPI.space.create(spaceCreate);
            console.log(response);
        } catch (e:any) {
            console.error(e.message);
        } finally {
            setLoading(false);
            closeInviteModal();
            clearAllState();
        }
    };

    return (
        <div>
            <SCWContainer>
                {!children &&
                    <SCWButton
                        onCreate={showCreateSpace}
                    />
                }

                {children && <div onClick={showCreateSpace}>{children}</div>}

                {isCreateModalVisible &&
                    <SCWCreateModal
                        isInviteVisible={showInviteSpace}
                        closeCreateModal={closeCreateModal}
                        nameValue={spaceState.spaceName}
                        descriptionValue={spaceState.spaceDescription}
                        handleNameChange={handleNameChange}
                        handleDescriptionChange={handleDescriptionChange}
                        isDescriptionEnabled={false}
                        isScheduleVisible={showScheduleSpace}
                        onClose={closeCreateModal}
                    />
                }

                {isScheduleModalVisible &&
                    <SCWScheduleModal
                        closeScheduleModal={closeScheduleModal}
                        makeCreateVisible={showCreateSpace}
                        makeInviteVisible={showInviteSpace}
                        dateValue={spaceState.date}
                        timeValue={spaceState.time}
                        onDateChange={onDateChange}
                        onTimeChange={onTimeChange}
                        onClose={closeScheduleModal}
                    />
                }

                {isInviteModalVisible &&
                    <SCWInviteModal
                        closeInviteModal={closeInviteModal}
                        makeScheduleVisible={showCreateSpace}
                        createSpace={createSpace}
                        isLoading={isLoading}
                        invitedMembersList={invitedMembersList}
                        setInvitedMembersList={setInvitedMembersList}
                        invitedAddressList={invitedAddressList}
                        setInvitedAddressList={setInvitedAddressList}
                        adminsList={adminsList}
                        setAdminsList={setAdminsList}
                        adminsAddressList={adminsAddressList}
                        setAdminsAddressList={setAdminsAddressList}
                        onClose={closeInviteModal}
                    />
                }
            </SCWContainer>
        </div>
    )
}

const SCWContainer = styled.div`
    font-family: 'Strawford'; // update to fontFamily theme
`;
