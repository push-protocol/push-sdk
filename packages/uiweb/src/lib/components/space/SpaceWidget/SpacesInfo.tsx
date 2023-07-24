import React, { useContext, MouseEventHandler, useState } from 'react'
import styled from 'styled-components';
import * as PushAPI from '@pushprotocol/restapi';

import { Modal } from '../reusables/Modal'
import { ModalHeader } from '../reusables/ModalHeader'
import { ThemeContext } from '../theme/ThemeProvider';
import { Button } from '../reusables/Button';
import { ProfileContainer } from '../reusables/ProfileContainer';
import Accordion from '../reusables/Accordion';
import { SCWInviteModal } from '../SpaceCreationWidget/SCWInviteModal';

import { useSpaceData } from '../../../hooks';

export interface ISpacesInfoProps {
    closeSpacesInfo: MouseEventHandler;
    spaceData: any;
}

export const SpacesInfo: React.FC<ISpacesInfoProps> = (props) => {
    const { spaceData } = props;

    const theme = useContext(ThemeContext);

    const [isInviteVisible, setIsInviteVisible] = useState(false);

    const [invitedMembersList, setInvitedMembersList] = useState([])
    const [invitedAddressList, setInvitedAddressList] = useState([])

    const [adminsList, setAdminsList] = useState([])
    const [adminsAddressList, setAdminsAddressList] = useState([])

    const [isLoading, setLoading] = useState(false);

    const { signer, env, pgpPrivateKey } = useSpaceData();

    const customStyle = {
        color: theme?.textColorPrimary,
        background: theme?.bgColorPrimary,
        borderColor: theme?.borderColor,
        fontWeight: '500',
        padding: '14px',
    }

    const showExplicitInvite: React.MouseEventHandler = () => {
        setIsInviteVisible(!isInviteVisible);
    }

    const closeInviteModal = () => {
        setIsInviteVisible(false);
    }

    const adminsArray = spaceData?.members?.filter((member: { isSpeaker: boolean; }) => member.isSpeaker);

    const updateSpace = async () => {
        const spaceUpdate = {
            spaceName: spaceData?.spaceName,
            spaceDescription: 'Push Space',
            listeners: invitedAddressList,
            spaceImage: 'asd',
            speakers: adminsAddressList,
            isPublic: true,
            scheduleAt: new Date(Date.now() + 120000),
            signer: signer as PushAPI.SignerType,
            env,
            spaceId: spaceData?.spaceId,
            status: spaceData?.status,
            ...(pgpPrivateKey && pgpPrivateKey !== '' && { pgpPrivateKey }), // Conditionally add pgpPrivateKey
        }

        try {
            setLoading(true);
            const response = await PushAPI.space.update(spaceUpdate);

            console.log(response);
        } catch (e:any) {
            console.error(e.message);
        } finally {
            setLoading(false);
            closeInviteModal();
        }
    };

    return (
        <Modal
            width='400px'
        >
            <SpacesInfoContainer theme={theme}>
            <ModalHeader
                heading='Spaces Info'
                closeCallback={props.closeSpacesInfo}
            />

            <ProfileContainer
                imageUrl={spaceData?.members[0]?.image}
                name={spaceData?.members[0]?.wallet?.substring(7)}
                handle={spaceData?.members[0]?.wallet?.substring(7)}
                imageHeight='48px'
                tag='Host'
            />

            <SpacesDetailsContainer>
                <Title>{spaceData?.spaceName}</Title>
                <Description theme={theme}>{spaceData?.spaceDescription}</Description>
            </SpacesDetailsContainer>

            <Button
                customStyle={customStyle}
                onClick={showExplicitInvite}
            >
                Invite Members
            </Button>

            <Accordion title='Pending Invites' items={spaceData?.pendingMembers?.length}>
                {spaceData?.pendingMembers &&
                    spaceData.pendingMembers.map((item: any) => {
                        return <ProfileContainer
                            tag={item?.isSpeaker ? 'Co-Host' : undefined}
                            imageHeight='48px'
                            handle={item?.wallet?.substring(7)}
                            name={item?.wallet?.substring(7)}
                            imageUrl={item?.image}
                        />
                    })
                }
            </Accordion>

            {adminsArray &&
                adminsArray.slice(1).map((item: any) => {
                    return <ProfileContainer
                        border
                        tag="Co-Host"
                        imageHeight='48px'
                        handle={item?.wallet?.substring(7)}
                        name={item?.wallet?.substring(7)}
                        imageUrl={item?.image}
                    />
                })
            }

            {
                isInviteVisible ?
                <SCWInviteModal
                    closeInviteModal={showExplicitInvite}
                    makeScheduleVisible={showExplicitInvite}
                    createSpace={updateSpace}
                    isLoading={isLoading}
                    invitedMembersList={invitedMembersList}
                    setInvitedMembersList={setInvitedMembersList}
                    invitedAddressList={invitedAddressList}
                    setInvitedAddressList={setInvitedAddressList}
                    adminsList={adminsList}
                    setAdminsList={setAdminsList}
                    adminsAddressList={adminsAddressList}
                    setAdminsAddressList={setAdminsAddressList}
                    onClose={showExplicitInvite}
                    btnString='Update Space'
                />
                : null
            }
            </SpacesInfoContainer>
        </Modal>
    )
}


/** styling */
const SpacesInfoContainer = styled.div`
    color: ${(props => props.theme?.textColorPrimary)};
`;

const SpacesDetailsContainer = styled.div`
    padding: 0 16px;
    margin: 24px 0;
`;

const Title = styled.div`
    font-weight: 500;
`;

const Description = styled.div`
    color: ${(props => props.theme?.textColorSecondary)};
`;
