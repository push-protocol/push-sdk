import { useEffect, useRef, useState } from 'react';

import styled from 'styled-components';
import { MdCheckCircle, MdError } from 'react-icons/md';

import { useChatData, useClickAway } from '../../../hooks';
import { DropdownValueType } from '../reusables/DropDown';
import { Section, Span, Image, Div } from '../../reusables/sharedStyling';
import { AddWalletContent } from './AddWalletContent';
import { Modal, ModalHeader } from '../reusables';
import useMediaQuery from '../../../hooks/useMediaQuery';
import useToast from '../reusables/NewToast';
import useUpdateGroup from '../../../hooks/chat/useUpdateGroup';
import { MemberProfileCard } from './MemberProfileCard';
import ConditionsComponent from '../CreateGroup/ConditionsComponent';
import { PendingMembers } from './PendingMembers';

import { IChatTheme } from '../theme';
import { device } from '../../../config';
// import {
//   isAccountOwnerAdmin,
// } from '../helpers/group';
import LockIcon from '../../../icons/Lock.png';
import LockSlashIcon from '../../../icons/LockSlash.png';
import addIcon from '../../../icons/addicon.svg';
import DismissAdmin from '../../../icons/dismissadmin.svg';
import AddAdmin from '../../../icons/addadmin.svg';
import Remove from '../../../icons/remove.svg';
import { copyToClipboard, shortenText } from '../../../helpers';
import { ACCESS_TYPE_TITLE, OPERATOR_OPTIONS_INFO } from '../constants';
import { getRuleInfo } from '../helpers/getRulesToCondtionArray';
import { Group, MODAL_BACKGROUND_TYPE, MODAL_POSITION_TYPE, ModalBackgroundType, ModalPositionType } from '../exportedTypes';
import { TokenGatedSvg } from '../../../icons/TokenGatedSvg';
import { GROUP_ROLES, GroupRolesKeys } from '../types';


const UPDATE_KEYS = {
  REMOVE_MEMBER: 'REMOVE_MEMBER',
  ADD_MEMBER: 'ADD_MEMBER',
  REMOVE_ADMIN: 'REMOVE_ADMIN',
  ADD_ADMIN: 'ADD_ADMIN',
} as const;

type UpdateKeys = typeof UPDATE_KEYS[keyof typeof UPDATE_KEYS];
type UpdateGroupType = {
  memberList: Array<string>;
};

const SUCCESS_MESSAGE = {
  REMOVE_MEMBER: 'Removed Member successfully',
  ADD_MEMBER: 'Group Invitation sent',
  REMOVE_ADMIN: 'Admin added successfully',
  ADD_ADMIN: 'Removed added successfully',
};



interface ConditionsInformationProps {
  theme: IChatTheme;
  groupInfo?: Group | null;
  alert?: boolean;
  header?: string;
  subheader?: string;
}

export const ConditionsInformation = ({
  theme,
  groupInfo,
  alert,
  header,
  subheader,
}: ConditionsInformationProps) => {
  const groupRules = getRuleInfo(groupInfo?.rules);
  const isMobile = useMediaQuery(device.mobileL);

  const getOperator = (key: keyof typeof groupRules) => {
    if (groupRules[key as keyof typeof groupRules].length) {
      return groupRules[key as keyof typeof groupRules][0][0]
        ?.operator as keyof typeof OPERATOR_OPTIONS_INFO;
    }
    return null;
  };

  return (
    <Section
      margin="5px 0px 0px 0px"
      gap="16px"
      flexDirection="column"
      width="100%"
    >
      {!!(Object.keys(groupInfo?.rules||{}).length) && (
        <GroupTypeBadge
          theme={theme}
          icon={<TokenGatedSvg color={alert?'#E93636':undefined}/>}
          header={header ?? 'Gated group'}
          subheader={subheader ?? 'Conditions must be true to join and chat'}
          alert={alert}
        />
      )}
      <ConditionSection
        overflow="hidden auto"
        maxHeight={isMobile ? '46vh' : '49vh'}
        justifyContent="start"
        flexDirection="column"
        padding="0 2px 0 0"
        theme={theme}
      >
        {Object.keys(ACCESS_TYPE_TITLE).map((key, idx) => (
          <>
            {getOperator(key as keyof typeof groupRules) ? (
              <Section key={idx} flexDirection="column">
                <Span
                  fontSize="16px"
                  fontWeight="500"
                  alignSelf="start"
                  margin="5px 0"
                >
                  {
                    ACCESS_TYPE_TITLE[key as keyof typeof ACCESS_TYPE_TITLE]
                      ?.heading
                  }
                </Span>

                <Span fontSize="14px" margin="15px 0">
                  {
                    OPERATOR_OPTIONS_INFO[
                      groupRules[key as keyof typeof groupRules][0][0]
                        ?.operator as keyof typeof OPERATOR_OPTIONS_INFO
                    ]?.head
                  }
                  <Span color={theme.textColor?.modalSubHeadingText}>
                    {' '}
                    {
                      OPERATOR_OPTIONS_INFO[
                        groupRules[key as keyof typeof groupRules][0][0]
                          ?.operator as keyof typeof OPERATOR_OPTIONS_INFO
                      ]?.tail
                    }
                  </Span>
                </Span>
                <Section
                  width="100%"
                  justifyContent="start"
                  flexDirection="column"
                >
                  <ConditionsComponent
                    moreOptions={false}
                    conditionData={groupRules[key as keyof typeof groupRules]}
                  />
                </Section>
              </Section>
            ) : null}
          </>
        ))}
      </ConditionSection>
    </Section>
  );
};

interface GroupTypeProps {
  theme: IChatTheme;
  icon: React.ReactNode;
  header: string;
  subheader: string;
  cursor?: string;
  handleNextInformation?: () => void;
  alert?: boolean;
}

export const GroupTypeBadge = ({
  theme,
  icon,
  header,
  subheader,
  handleNextInformation,
  cursor,
  alert,
}: GroupTypeProps) => {
  return (
    // <Section cursor={cursor} justifyContent='start' alignItems='start'>
    <PublicEncrypted
      onClick={handleNextInformation}
      theme={theme}
      alert={alert}
      cursor="pointer"
      justifyContent="start"
    >
      {/* <Image
          cursor={cursor}
          src={icon}
          height="24px"
          maxHeight="24px"
          width={'auto'}
        /> */}
      {icon}
      <Section
        cursor={cursor}
        flexDirection="column"
        alignItems="flex-start"
        gap="5px"
      >
        <Span
          cursor={cursor}
          fontSize="18px"
          textAlign="left"
          color={theme.textColor?.modalHeadingText}
        >
          {header}
        </Span>
        <Span
          cursor={cursor}
          textAlign="left"
          fontSize="12px"
          color={theme.textColor?.modalSubHeadingText}
        >
          {subheader}
        </Span>
      </Section>
    </PublicEncrypted>
    // </Section>
  );
};

type GroupSectionProps = GroupInfoModalProps & {
  handleNextInformation: () => void;
  handlePreviousInformation?: () => void;
  setShowAddMoreWalletModal: React.Dispatch<React.SetStateAction<boolean>>;
  selectedMemberAddress: string | null;
  setSelectedMemberAddress: React.Dispatch<React.SetStateAction<string | null>>;
};

type GroupInfoModalProps = {
  theme: IChatTheme;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  groupInfo: Group;
  // setGroupInfo: React.Dispatch<React.SetStateAction<IGroup | null | undefined>>;
  groupInfoModalBackground?: ModalBackgroundType;
  groupInfoModalPositionType?: ModalPositionType;
};

export const GROUPINFO_STEPS = {
  GROUP_INFO: 1,
  CRITERIA: 2,
} as const;

export type GROUP_INFO_TYPE =
  typeof GROUPINFO_STEPS[keyof typeof GROUPINFO_STEPS];

const GroupInformation = ({
  theme,
  groupInfo,
  handleNextInformation,
  setShowAddMoreWalletModal,
  selectedMemberAddress,
  setSelectedMemberAddress,
}: GroupSectionProps) => {
  const { account } = useChatData();

  const [showPendingRequests, setShowPendingRequests] =
    useState<boolean>(false);

  const [copyText, setCopyText] = useState<string>('');
  const { addMember, removeMember } = useUpdateGroup();


  const isMobile = useMediaQuery(device.mobileL);

  const dropdownRef = useRef<any>(null);
  useClickAway(dropdownRef, () => setSelectedMemberAddress(null));



  const handleAddMember = async (role: GroupRolesKeys) => {
    await addMember({
      memberList: [selectedMemberAddress!],
      chatId:groupInfo!.chatId!,
      role: role,
    });
  };

  const handleRemoveMember = async (role: GroupRolesKeys) => {
    await removeMember({
      memberList: [selectedMemberAddress!],
      chatId:groupInfo!.chatId!,
      role: role,
    });
  };
  // const messageUserDropdown: DropdownValueType = {
  //     id: 'message_user',
  //     title: 'Message user',
  //     icon: Message,
  //     function: () => messageUser(),
  //   };

  const removeAdminDropdown: DropdownValueType = {
    id: 'dismiss_admin',
    title: 'Dismiss as admin',
    icon: DismissAdmin,
    function: () => handleRemoveMember(GROUP_ROLES.ADMIN),
  };
  const addAdminDropdown: DropdownValueType = {
    id: 'add_admin',
    title: 'Make group admin',
    icon: AddAdmin,
    function: () => handleAddMember(GROUP_ROLES.ADMIN),
  };
  const removeMemberDropdown: DropdownValueType = {
    id: 'remove_member',
    title: 'Remove',
    icon: Remove,
    function: () => handleRemoveMember(GROUP_ROLES.MEMBER),
    textColor: '#ED5858',
  };

  return (
    <ScrollSection
      margin="auto"
      width="100%"
      flexDirection="column"
      gap="16px"
      maxHeight={isMobile ? '59vh' : '61vh'}
      height={isMobile ? '59vh' : '61vh'}
      overflow="hidden auto"
      justifyContent="start"
      padding="0 2px 0 0"
      theme={theme}
    >
      <GroupDescription>
        <Span fontSize="18px" color={theme.textColor?.modalHeadingText}>
          Chat ID
        </Span>
        <Section
          gap="5px"
          alignSelf="start"
          onClick={() => {
            copyToClipboard(groupInfo!.chatId!);
            setCopyText('copied');
          }}
          onMouseEnter={() => {
            setCopyText('click to copy');
          }}
          onMouseLeave={() => {
            setCopyText('');
          }}
        >
          <Span
            textAlign="start"
            fontSize="16px"
            fontWeight="400"
            color={theme.textColor?.modalSubHeadingText}
          >
            {shortenText(groupInfo!.chatId!, 8, true)}
          </Span>
          {!!copyText && (
            <Span
              cursor="pointer"
              position="relative"
              padding="2px 10px"
              color={theme.textColor?.modalSubHeadingText}
              fontSize="14px"
              fontWeight="400"
              background={theme.backgroundColor?.modalHoverBackground}
              borderRadius="16px"
            >
              {copyText}
            </Span>
          )}
        </Section>
      </GroupDescription>
      <GroupDescription>
        <Span fontSize="18px" color={theme.textColor?.modalHeadingText}>
          Group Description
        </Span>
        <Span
          textAlign="start"
          fontSize="16px"
          fontWeight="400"
          color={theme.textColor?.modalSubHeadingText}
        >
          {groupInfo?.groupDescription}
        </Span>
      </GroupDescription>
      <GroupTypeBadge
        theme={theme}
        icon={
          <Image
            cursor="default"
            src={groupInfo?.isPublic ? LockIcon : LockSlashIcon}
            height="24px"
            maxHeight="24px"
            width={'auto'}
          />
        }
        header={groupInfo?.isPublic ? 'Open' : 'Encrypted'}
        subheader={
          groupInfo?.isPublic
            ? 'Chats are not encrypted'
            : 'Chats are end-to-end encrypted'
        }
      />
      {!!(Object.keys(groupInfo?.rules||{}).length) && (
        <GroupTypeBadge
          cursor="pointer"
          handleNextInformation={handleNextInformation}
          theme={theme}
          icon={<TokenGatedSvg/>}
          header={'Gated group'}
          subheader={'Conditions must be true to join'}
        />
      )}
{/* 
      {isAccountOwnerAdmin(groupInfo, account!) &&
        groupInfo?.members &&
        groupInfo?.members?.length < 10 && (
          <AddWalletContainer
            theme={theme}
            onClick={() => setShowAddMoreWalletModal(true)}
          >
            <Image
              cursor="pointer"
              src={addIcon}
              height="18px"
              maxHeight="18px"
              width={'auto'}
            />

            <Span
              cursor="pointer"
              color={theme.textColor?.modalSubHeadingText}
              margin="0px 14px"
              fontSize="16px"
              fontWeight="400"
            >
              Add more wallets
            </Span>
          </AddWalletContainer>
        )} */}

      {/* <Section borderRadius="16px">
        {groupInfo?.pendingMembers?.length > 0 && (
          <PendingMembers
            groupInfo={groupInfo}
            setShowPendingRequests={setShowPendingRequests}
            showPendingRequests={showPendingRequests}
            theme={theme}
          />
        )}
      </Section> */}

      {/* <ProfileSection
        flexDirection="column"
        zIndex="2"
        justifyContent="start"
      >
        {groupInfo?.members &&
          groupInfo?.members?.length > 0 &&
          groupInfo?.members.map((item, index) => (
            <MemberProfileCard
              key={index}
              member={item}
              dropdownValues={
                item?.isAdmin && isAccountOwnerAdmin(groupInfo, account!)
                  ? [removeAdminDropdown, removeMemberDropdown]
                  : isAccountOwnerAdmin(groupInfo, account!)
                  ? [addAdminDropdown, removeMemberDropdown]
                  : []
              }
              selectedMemberAddress={selectedMemberAddress}
              setSelectedMemberAddress={setSelectedMemberAddress}
              dropdownRef={dropdownRef}
            />
          ))}
      </ProfileSection> */}
    </ScrollSection>
  );
};

export const GroupInfoModal = ({
  theme,
  setModal,
  groupInfo,
  // setGroupInfo,
  groupInfoModalBackground = MODAL_BACKGROUND_TYPE.OVERLAY,
  groupInfoModalPositionType = MODAL_POSITION_TYPE.GLOBAL,
}: GroupInfoModalProps) => {
  const [activeComponent, setActiveComponent] = useState<GROUP_INFO_TYPE>(
    GROUPINFO_STEPS.GROUP_INFO
  );
  const [memberList, setMemberList] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showAddMoreWalletModal, setShowAddMoreWalletModal] =
    useState<boolean>(false);
  useState<boolean>(false);
  const [selectedMemberAddress, setSelectedMemberAddress] = useState<
    string | null
  >(null);

  const isMobile = useMediaQuery(device.mobileL);
  const groupInfoToast = useToast();
  // const groupCreator = groupInfo?.groupCreator;
  // const membersExceptGroupCreator = groupInfo?.members?.filter(
  //   (x) => x.wallet?.toLowerCase() !== groupCreator?.toLowerCase()
  // );
  console.log(groupInfo)
  // console.log(membersExceptGroupCreator)
  // const groupMembers = [
  //   ...membersExceptGroupCreator,
  //   ...groupInfo.pendingMembers,
  // ];
  const {addMember} = useUpdateGroup();
  const dropdownRef = useRef<any>(null);

  const handleNextInfo = () => {
    setActiveComponent((activeComponent + 1) as GROUP_INFO_TYPE);
  };

  const handlePreviousInfo = () => {
    setActiveComponent((activeComponent - 1) as GROUP_INFO_TYPE);
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case GROUPINFO_STEPS.GROUP_INFO:
        return (
          <GroupInformation
            handleNextInformation={handleNextInfo}
            theme={theme}
            setModal={setModal}
            groupInfo={groupInfo}
            // setGroupInfo={setGroupInfo}
            setShowAddMoreWalletModal={setShowAddMoreWalletModal}
            selectedMemberAddress={selectedMemberAddress}
            setSelectedMemberAddress={setSelectedMemberAddress}
          />
        );
      case GROUPINFO_STEPS.CRITERIA:
        return <ConditionsInformation groupInfo={groupInfo} theme={theme} />;

      default:
        return (
          <GroupInformation
            handleNextInformation={handleNextInfo}
            theme={theme}
            setModal={setModal}
            groupInfo={groupInfo}
            // setGroupInfo={setGroupInfo}
            setShowAddMoreWalletModal={setShowAddMoreWalletModal}
            selectedMemberAddress={selectedMemberAddress}
            setSelectedMemberAddress={setSelectedMemberAddress}
          />
        );
    }
  };

  useClickAway(dropdownRef, () => setSelectedMemberAddress(null));

  const onClose = (): void => {
    setModal(false);
  };



  const handleClose = () => onClose();
  const handleAddMemberToGroup = async (
    options: UpdateGroupType
  ) => {
    const {  memberList } = options || {};
    try {
      setIsLoading(true);
  
      const updateMemberResponse  = await addMember({
        chatId:groupInfo!.chatId!,
        role:GROUP_ROLES.MEMBER,
        memberList,
      });
      if ( (typeof updateMemberResponse !== 'string')) {
        // setGroupInfo(updateMemberResponse!);

        groupInfoToast.showMessageToast({
          toastTitle: 'Success',
          toastMessage: SUCCESS_MESSAGE[UPDATE_KEYS.ADD_MEMBER],
          toastType: 'SUCCESS',
          getToastIcon: (size) => <MdCheckCircle size={size} color="green" />,
        });
      } else {
        groupInfoToast.showMessageToast({
          toastTitle: 'Error',
          toastMessage: 'Error in adding member',
          toastType: 'ERROR',
          getToastIcon: (size) => <MdError size={size} color="red" />,
        });
      }
    } catch (error) {
      console.error('Error', error);
      groupInfoToast.showMessageToast({
        toastTitle: 'Error',
        toastMessage: 'Please, try again',
        toastType: 'ERROR',
        getToastIcon: (size) => <MdError size={size} color="red" />,
      });
    } finally {
      handleClose();
      setIsLoading(false);
      setSelectedMemberAddress(null);
    }
  };

  const addMembers = async () => {

    //Newly Added Members and alreadyPresent Members in the groupchat
    console.log(memberList)
    const newMembersToAdd = memberList.map((member: any) => member.wallets);
    const members =  newMembersToAdd;
    //Admins wallet address from both members and pendingMembers
console.log(members)
    await handleAddMemberToGroup({
      memberList: members,
    });
  };
  const handlePrevious = () => {
    setShowAddMoreWalletModal(false);
  };

  if (groupInfo) {
    return (
      <Modal
        clickawayClose={onClose}
        modalBackground={groupInfoModalBackground}
        modalPositionType={groupInfoModalPositionType}
      >
        {!showAddMoreWalletModal && (
          <Section
            margin="auto"
            width={isMobile ? '100%' : '410px'}
            flexDirection="column"
            gap="16px"
            padding={isMobile ? '0px auto' : '0px 10px'}
          >
            <ModalHeader
              handlePrevious={
                activeComponent === 2 ? handlePreviousInfo : undefined
              }
              title="Group Info"
              handleClose={onClose}
            />

            <GroupHeader>
              <Image
                src={groupInfo?.groupImage ?? ''}
                height="64px"
                maxHeight="64px"
                width={'auto'}
                borderRadius="16px"
              />

              <Section flexDirection="column" alignItems="flex-start" gap="5px">
                <Span
                  fontSize="20px"
                  fontWeight="500"
                  color={theme.textColor?.modalHeadingText}
                >
                  {groupInfo?.groupName}
                </Span>
                {/* <Span
                  fontSize="16px"
                  fontWeight="500"
                  color={theme.textColor?.modalSubHeadingText}
                >
                  {groupInfo?.members?.length} Members
                </Span> */}
              </Section>
            </GroupHeader>
            {renderComponent()}
          </Section>
        )}
        {/* {showAddMoreWalletModal && (
          <AddWalletContent
            onSubmit={addMembers}
            handlePrevious={handlePrevious}
            onClose={onClose}
            memberList={memberList}
            handleMemberList={setMemberList}
            groupMembers={groupMembers}
            isLoading={isLoading}
            modalHeader={'Add More Wallets'}
          />
        )} */}
      </Modal>
    );
  } else {
    return null;
  }
};

//styles
const GroupHeader = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 19px;
`;

const GroupDescription = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: flex-start;
  gap: 5px;
`;

const PublicEncrypted = styled(Section)<{ alert?: boolean }>`
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 12px;
  align-items: center;
  border: ${(props) =>
    props?.alert
      ? '1px solid #E93636'
      : props.theme.border.modalInnerComponents};
  border-radius: ${(props) => props.theme.borderRadius.modalInnerComponents};
  padding: 12px 16px;
  box-sizing: border-box;
  background: ${(props) => props.theme.backgroundColor.modalHoverBackground};
`;

const AddWalletContainer = styled.div`
  border: ${(props) => props.theme.border.modalInnerComponents};
  border-radius: ${(props) => props.theme.borderRadius.modalInnerComponents};
  width: 100%;
  padding: 20px 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: center;
  cursor: pointer;
  align-items: center;
`;


const ConditionSection = styled(Section)<{ theme: IChatTheme }>`
  &::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.scrollbarColor};
    border-radius: 10px;
  }
  &::-webkit-scrollbar-button {
    height: 20px;
  }
  &::-webkit-scrollbar {
    width: 4px;
  }
`;

const ProfileSection = styled(Section)`
  height: fit-content;
`;
const ScrollSection = styled(Section)<{ theme: IChatTheme }>`
  &::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.scrollbarColor};
    border-radius: 10px;
  }
  &::-webkit-scrollbar-button {
    height: 40px;
  }

  &::-webkit-scrollbar {
    width: 4px;
  }
`;

//auto update members when an user accepts not done
