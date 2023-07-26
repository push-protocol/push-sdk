import React, { ReactNode, useState, useContext } from 'react';
import styled from 'styled-components';

import { Modal } from '../reusables/Modal';
import { ModalHeader } from '../reusables/ModalHeader';
import { ProfileContainer } from '../reusables/ProfileContainer';
import { ThemeContext } from '../theme/ThemeProvider';
import { createBlockie } from '../helpers/blockies';

import { Button, Container, Image, Text } from '../../../config';
import SettingsIcon from '../../../icons/settingsBlack.svg';
import { SettingsLogo } from '../../../icons/SettingsLogo';
import { AcceptRequest } from '../../../icons/Accept';
import { RejectRequest } from '../../../icons/Reject';


const tempImageUrl = "https://imgv3.fotor.com/images/blog-richtext-image/10-profile-picture-ideas-to-make-you-stand-out.jpg";

const Requests = (props: any) => {
  const { members, acceptCallback, rejectCallback } = props;

  return (
    <MembersContainer>
      {members.map((item: any) => {
          return <ProfileContainer
          handle={item.wallet.substring(7)}
          name={item.wallet.substring(7)}
          imageUrl={item.image}
          imageHeight='48px'
          contBtn={
            <SettingsCont>
              {/* these will change according to data recieved */}
              <div onClick={rejectCallback(item.wallet)}><RejectRequest /></div>
              <div onClick={acceptCallback(item.wallet)}><AcceptRequest /></div>
            </SettingsCont>
          }
        border
      />
      })}
    </MembersContainer>
  )
}

const Speakers = (props: any) => {
  const { members, theme } = props;
  return (
    <MembersContainer>
      {members.map((item: any) => {
        return <ProfileContainer
        handle={item.wallet.substring(7)}
        name={item.wallet.substring(7)}
        imageUrl={item.image}
        imageHeight='48px'
        contBtn={
          <SettingsCont>
            <SettingsLogo color={theme.textColorPrimary} />
          </SettingsCont>
      }
      // removeCallback={() => handleDeleteInvitedAdmin(item)}
      // promoteCallback={() => handlePromoteToAdmin(item)}
      border
    />
      })}
    </MembersContainer>
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
  spaceData: any;
  acceptCallback?: any;
  rejectCallback?: any;
}
enum MemberTabsEnum {
  // CoHost = 'Co-Host',
  Speakers = 'Speakers',
  Requests = 'Requests',
  Listeners = 'Listeners',
}

export const SpaceMembersSectionModal: React.FC<ISpaceMembersModalProps> = ({ onClose, spaceData, acceptCallback, rejectCallback }: ISpaceMembersModalProps) => {

  const [activeTab, setActiveTab] = useState<MemberTabsEnum>(MemberTabsEnum.Speakers);

  const theme = useContext(ThemeContext);

  const coHosts = spaceData.members.filter((member: any) => member.isSpeaker) 
  const listeners = spaceData.pendingMembers.filter((member: any) => !member.isSpeaker) 

    const handleTabClick = (index: MemberTabsEnum) => {
      setActiveTab(index);
    };

    const renderTabs = (): ReactNode => {
      return Object.values(MemberTabsEnum).map((tab) => (
        <Tab
          key={tab}
          active={activeTab === tab}
          onClick={() => handleTabClick(tab)}
        >
          {tab}
        </Tab>
      ));
    };

    return (
      <Modal clickawayClose={onClose} width='380px'>
        <ModalHeader
                heading='Members'
                closeCallback={onClose}
            />
            <SpacesMembersContainer>
            
            <ProfileContainer
                imageUrl={createBlockie?.(spaceData.spaceCreator.substring(7))
                  ?.toDataURL()
                  ?.toString()}
                name={spaceData.spaceCreator.substring(7)}
                handle={spaceData.spaceCreator.substring(7)}
                imageHeight='48px'
                tag='Host'
            />

            <TabContainer>
              {renderTabs()}
            </TabContainer>

            {/* {activeTab === MemberTabsEnum.CoHost && <CoHosts members={coHosts} />} */}
            {activeTab === MemberTabsEnum.Speakers && <Speakers members={coHosts} theme={theme} />}
            {activeTab === MemberTabsEnum.Requests && <Requests theme={theme} acceptCallback={acceptCallback} rejectCallback={rejectCallback} />}
            {activeTab === MemberTabsEnum.Listeners && <Speakers members={listeners} theme={theme} />}

            {/* <Button 
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
            </Button> */}

            </SpacesMembersContainer>
        </Modal>
    )
}

/* styling */
const MembersContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

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

const SettingsCont = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
`;
