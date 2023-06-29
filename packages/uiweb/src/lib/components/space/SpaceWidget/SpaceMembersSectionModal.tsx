import React, { useState } from 'react';
import styled from 'styled-components';

import { Modal } from '../reusables/Modal';
import { ModalHeader } from '../reusables/ModalHeader';
import { ProfileContainer } from '../reusables/ProfileContainer';

import { Button, Container, Image, Text } from '../../../config';
import SettingsIcon from '../../../icons/settingsBlack.svg';

const tempImageUrl = "https://imgv3.fotor.com/images/blog-richtext-image/10-profile-picture-ideas-to-make-you-stand-out.jpg";
const Requests: React.FC = () => {
  return (
    <Container>
      <ProfileContainer
          imageUrl={tempImageUrl}
          name={'Dan'}
          handle={'red'}
          imageHeight='48px'
      />
      <ProfileContainer
          imageUrl={tempImageUrl}
          name={'Abramov'}
          handle={'ux'}
          imageHeight='48px'
      />
    </Container>
  )
}

const Speakers: React.FC = () => {
  return (
    <Container>
      <ProfileWithSettingsContainer>
        <ProfileContainer
          imageUrl={tempImageUrl}
          name={'Dan'}
          handle={'red'}
          imageHeight='48px'
        />
        <SettingsIconContainer>
          <Image
            alt="Settings icon"
            height={'40px'}
            src={SettingsIcon}
          />
        </SettingsIconContainer>
      </ProfileWithSettingsContainer>
      <ProfileWithSettingsContainer>
        <ProfileContainer
          imageUrl={tempImageUrl}
          name={'Abramov'}
          handle={'ux'}
          imageHeight='48px'
        />
        <SettingsIconContainer>
          <Image
            alt="Settings icon"
            height={'40px'}
            src={SettingsIcon}
          />
        </SettingsIconContainer>
      </ProfileWithSettingsContainer>
    </Container>
  )
}

const CoHosts: React.FC = () => {
  return (
    <Container>
      <ProfileWithSettingsContainer>
        <ProfileContainer
          imageUrl={tempImageUrl}
          name={'Dan'}
          handle={'red'}
          imageHeight='48px'
        />
        <SettingsIconContainer>
          <Image
            alt="Settings icon"
            height={'40px'}
            src={SettingsIcon}
          />
        </SettingsIconContainer>
      </ProfileWithSettingsContainer>
      <ProfileWithSettingsContainer>
        <ProfileContainer
          imageUrl={tempImageUrl}
          name={'Abramov'}
          handle={'ux'}
          imageHeight='48px'
        />
        <SettingsIconContainer>
          <Image
            alt="Settings icon"
            height={'40px'}
            src={SettingsIcon}
          />
        </SettingsIconContainer>
      </ProfileWithSettingsContainer>
    </Container>
  )
}

const Listeners: React.FC = () => {
  return (
    <Container>
      <ProfileWithSettingsContainer>
        <ProfileContainer
          imageUrl={tempImageUrl}
          name={'Dan'}
          handle={'red'}
          imageHeight='48px'
        />
        <SettingsIconContainer>
          <Image
            alt="Settings icon"
            height={'40px'}
            src={SettingsIcon}
          />
        </SettingsIconContainer>
      </ProfileWithSettingsContainer>
      <ProfileWithSettingsContainer>
        <ProfileContainer
          imageUrl={tempImageUrl}
          name={'Abramov'}
          handle={'ux'}
          imageHeight='48px'
        />
        <SettingsIconContainer>
          <Image
            alt="Settings icon"
            height={'40px'}
            src={SettingsIcon}
          />
        </SettingsIconContainer>
      </ProfileWithSettingsContainer>
    </Container>
  )
}

interface ISpaceMembersModalProps {
  onClose: () => void;
}

export const SpaceMembersSectionModal: React.FC<ISpaceMembersModalProps> = ({ onClose }: ISpaceMembersModalProps) => {

    const [activeTab, setActiveTab] = useState<number>(0);

    const handleTabClick = (index: number) => {
      setActiveTab(index);
    };

    return (
      <Modal clickawayClose={onClose} width='380px'>
        <ModalHeader
                heading='Members'
                closeCallback={onClose}
            />
            <SpacesMembersContainer>
            
            <ProfileContainer
                imageUrl={tempImageUrl}
                name={'Arnab Chatterjee'}
                handle={'arn4b'}
                imageHeight='48px'
                tag='Host'
            />

            <TabContainer>
              <Tab active={activeTab === 0} onClick={() => handleTabClick(0)}>
                Co-host
              </Tab>
              <Tab active={activeTab === 1} onClick={() => handleTabClick(1)}>
                Speakers
              </Tab>
              <Tab active={activeTab === 2} onClick={() => handleTabClick(2)}>
                Requests
              </Tab>
              <Tab active={activeTab === 3} onClick={() => handleTabClick(3)}>
                Listeners
              </Tab>
            </TabContainer>

            {activeTab === 0 && <CoHosts />}
            {activeTab === 1 && <Speakers />}
            {activeTab === 2 && <Requests />}
            {activeTab === 3 && <Listeners />}

            <Button 
              padding={'16px'} 
              borderRadius={'8px'} 
              background={'#8B5CF6'} 
              border={'1px solid #703BEB'}
              cursor={'pointer'}
              alignSelf={'center'}
              width={'fit-content'}
            >
              <Text fontSize="14px" fontWeight={600} color="#fff">
                Update Members
              </Text>
            </Button>

            </SpacesMembersContainer>
        </Modal>
    )
}

/* styling */
// const ButtonContainer = styled.div`
//     display: flex;
//     justify-content: space-between;
//     width: 100%;
// `;
const SpacesMembersContainer = styled.div`
    color: black;
    display: flex;
    flex-direction: column;
    margin-top: 28px;
    gap: 16px;
    width: 100%;
`;

const ProfileWithSettingsContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const SettingsIconContainer = styled.div`
  display: flex;
  margin: 0px 16px;
  align-items: center;
  cursor: pointer;
`

const TabContainer = styled.div`
  display: flex;
  padding: 0px 10px;
`;

const Tab = styled.div<{active: boolean}>`
  flex: 1;
  padding: 10px;
  text-align: center;
  border-bottom: ${(props) =>
    props.active ? '1px solid #8B5CF6' : '1px solid #82828A26'};
  cursor: pointer;
  color: ${(props) => (props.active ? '#8B5CF6' : '#82828A')};
`;
