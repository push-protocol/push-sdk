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
}

interface IThemeProps {
    theme: IThemeProviderProps;
}

export const SpacesInfo: React.FC<ISpacesInfoProps> = (props) => {
    const tempImageUrl = "https://imgv3.fotor.com/images/blog-richtext-image/10-profile-picture-ideas-to-make-you-stand-out.jpg";

    const theme = useContext(ThemeContext);

    const customStyle = {
        color: theme.textColorPrimary,
        background: theme.bgColorPrimary,
        borderColor: theme.borderColor,
        fontWeight: '500',
        padding: '14px',
    }

    return (
        <Modal
            width='440px'
        >
            <SpacesInfoContainer>
            <ModalHeader
                heading='Spaces info'
                closeCallback={props.closeSpacesInfo}
            />

            <ProfileContainer
                imageUrl={tempImageUrl}
                name={'Arnab Chatterjee'}
                handle={'arn4b'}
                imageHeight='48px'
                tag='Host'
            />

            <SpacesDetailsContainer>
                <Title>larryscruff's space</Title>
                <Description theme={theme}>Ac orci quam cras in placerat. Sollicitudin tristique sed nisi proin duis.</Description>
            </SpacesDetailsContainer>

            <Button
                customStyle={customStyle}
            >
                Invite Members
            </Button>

            <Accordion title='Pending Invites'>
                <ProfileContainer
                    imageHeight='48px'
                    handle={'s4m4'}
                    name={'Samarendra'}
                    imageUrl={tempImageUrl}
                />

                <ProfileContainer
                    imageHeight='48px'
                    handle={'aamsa'}
                    name={'Aam Saltman'}
                    imageUrl={tempImageUrl}
                />
            </Accordion>

            <ProfileContainer
                border
                tag='Co-Host'
                imageHeight='48px'
                handle={'n1lesh'}
                name={'Nilesh Gupta'}
                imageUrl={tempImageUrl}
            />

            </SpacesInfoContainer>
        </Modal>
    )
}


/** styling */
const SpacesInfoContainer = styled.div`
    color: black;
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