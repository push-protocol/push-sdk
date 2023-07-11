import React, { useContext, MouseEventHandler } from 'react'
import styled from 'styled-components';

import { Modal } from '../reusables/Modal'
import { ModalHeader } from '../reusables/ModalHeader'
import { IThemeProviderProps, ThemeContext } from '../theme/ThemeProvider';
import { Button } from '../reusables/Button';
import { ProfileContainer } from '../reusables/ProfileContainer';
import Accordion from '../reusables/Accordion';

export interface ISpacesInfoProps {
    closeSpacesInfo: MouseEventHandler;
    spaceData: any;
}

interface IThemeProps {
    theme: IThemeProviderProps;
}

export const SpacesInfo: React.FC<ISpacesInfoProps> = (props) => {
    const { spaceData } = props;
    console.log("🚀 ~ file: SpacesInfo.tsx:22 ~ spaceData:", spaceData)
    const tempImageUrl = "https://imgv3.fotor.com/images/blog-richtext-image/10-profile-picture-ideas-to-make-you-stand-out.jpg";

    const theme = useContext(ThemeContext);

    const customStyle = {
        color: theme.textColorPrimary,
        background: theme.bgColorPrimary,
        borderColor: theme.borderColor,
        fontWeight: '500',
        padding: '14px',
    }

    const adminsArray = spaceData.members.filter((member: { isSpeaker: boolean; }) => member.isSpeaker);

    return (
        <Modal
            width='400px'
        >
            <SpacesInfoContainer>
            <ModalHeader
                heading='Spaces Info'
                closeCallback={props.closeSpacesInfo}
            />

            <ProfileContainer
                imageUrl={spaceData.members[0].image}
                name={spaceData.members[0].wallet.substring(7)}
                handle={spaceData.members[0].wallet.substring(7)}
                imageHeight='48px'
                tag='Host'
            />

            <SpacesDetailsContainer>
                <Title>{spaceData.spaceName}</Title>
                <Description theme={theme}>{spaceData.spaceDescription}</Description>
            </SpacesDetailsContainer>

            <Button
                customStyle={customStyle}
            >
                Invite Members
            </Button>

            <Accordion title='Pending Invites' items={spaceData.pendingMembers.length}>
                {
                    spaceData.pendingMembers.map((item: any) => {
                        return <ProfileContainer
                            tag={item.isSpeaker ? 'Co-Host' : undefined}
                            imageHeight='48px'
                            handle={item.wallet.substring(7)}
                            name={item.wallet.substring(7)}
                            imageUrl={item.image}
                        />  
                    })
                }
            </Accordion>

            {
                adminsArray.slice(1).map((item: any) => {
                    return <ProfileContainer
                        border
                        tag="Co-Host"
                        imageHeight='48px'
                        handle={item.wallet.substring(7)}
                        name={item.wallet.substring(7)}
                        imageUrl={item.image}
                    />  
                })
            }

            </SpacesInfoContainer>
        </Modal>
    )
}


/** styling */
const SpacesInfoContainer = styled.div`
    color: black;
    width: 400px;
`;

const SpacesDetailsContainer = styled.div`
    padding: 0 16px;
    margin: 24px 0;
`;

const Title = styled.div`
    font-weight: 500;
`;

const Description = styled.div<IThemeProps>`
    color: ${(props => props.theme.textColorSecondary)};
`;