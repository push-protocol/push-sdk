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
import { ProfileContainer } from '../reusables';

import { IGroup } from '../../../types';
import { IChatTheme } from '../theme';
import { ENV, device } from '../../../config';
import {
  convertToWalletAddressList,
  getAdminList,
  getUpdatedAdminList,
  getUpdatedMemberList,
  isAccountOwnerAdmin,
} from '../helpers/group';
import LockIcon from '../../../icons/Lock.png';
import LockSlashIcon from '../../../icons/LockSlash.png';
import ArrowIcon from '../../../icons/CaretUp.svg';
import addIcon from '../../../icons/addicon.svg';
import DismissAdmin from '../../../icons/dismissadmin.svg';
import AddAdmin from '../../../icons/addadmin.svg';
import Remove from '../../../icons/remove.svg';
import { copyToClipboard, shortenText } from '../../../helpers';
import TokenGatedIcon from '../../../icons/TokenGatedIcon.svg';
import ConditionsComponent from '../CreateGroup/ConditionsComponent';
import { ACCESS_TYPE_TITLE, OPERATOR_OPTIONS_INFO } from '../constants';
import { getRuleInfo } from '../helpers/getRulesToCondtionArray';

const UPDATE_KEYS = {
  REMOVE_MEMBER: 'REMOVE_MEMBER',
  ADD_MEMBER: 'ADD_MEMBER',
  REMOVE_ADMIN: 'REMOVE_ADMIN',
  ADD_ADMIN: 'ADD_ADMIN',
} as const;

type UpdateKeys = typeof UPDATE_KEYS[keyof typeof UPDATE_KEYS];
const SUCCESS_MESSAGE = {
  REMOVE_MEMBER: 'Removed Member successfully',
  ADD_MEMBER: 'Group Invitation sent',
  REMOVE_ADMIN: 'Admin added successfully',
  ADD_ADMIN: 'Removed added successfully',
};

type PendingMembersProps = {
  groupInfo?: IGroup | null;
  setShowPendingRequests: React.Dispatch<React.SetStateAction<boolean>>;
  showPendingRequests: boolean;
  theme: IChatTheme;
};

interface ShadowedProps {
  setPosition: boolean;
}

const PendingMembers = ({
  groupInfo,
  setShowPendingRequests,
  showPendingRequests,
  theme,
}: PendingMembersProps) => {
  if (groupInfo) {
    return (
      <PendingRequestWrapper theme={theme}>
        <PendingSection
          onClick={() => setShowPendingRequests(!showPendingRequests)}
        >
          <Span fontSize="18px" color={theme.textColor?.modalSubHeadingText}>
            Pending Requests
          </Span>
          <Badge>{groupInfo?.pendingMembers?.length}</Badge>

          <ArrowImage
            src={ArrowIcon}
            width={'auto'}
            setPosition={!showPendingRequests}
            borderRadius="100%"
          />
        </PendingSection>

        {showPendingRequests && (
          <ProfileSection
            flexDirection="column"
            flex="1"
            theme={theme}
            maxHeight="7rem"
            height="7rem"
            justifyContent="start"
            overflow="hidden auto"
            borderRadius="16px"
          >
            {groupInfo?.pendingMembers &&
              groupInfo?.pendingMembers?.length > 0 &&
              groupInfo?.pendingMembers.map((item) => (
                <GroupPendingMembers theme={theme}>
                  <ProfileContainer
                    theme={theme}
                    member={{
                      wallet: shortenText(item.wallet?.split(':')[1], 6, true),
                      image: item?.image || '',
                    }}
                    customStyle={{
                      imgHeight: '36px',
                      imgMaxHeight: '36px',
                      fontSize: 'inherit',
                      fontWeight: '300',
                    }}
                  />
                </GroupPendingMembers>
              ))}
          </ProfileSection>
        )}
      </PendingRequestWrapper>
    );
  } else {
    return null;
  }
};

interface ConditionsInformationProps {
  theme: IChatTheme;
  groupInfo?: IGroup | null;
}

export const ConditionsInformation = ({
  theme,
  groupInfo,
}: ConditionsInformationProps) => {
  const groupRules = getRuleInfo(groupInfo?.rules);

  const getOperator = (key: keyof typeof groupRules) => {
    if (groupRules[key as keyof typeof groupRules].length) {
      return groupRules[key as keyof typeof groupRules][0][0]
        ?.operator as keyof typeof OPERATOR_OPTIONS_INFO;
    }
    return null;
  };

  
  return (
    <Section
      margin="15px 0px 0px 0px"
      gap="20px"
      flexDirection="column"
      width="100%"
    >
      {(groupInfo?.rules?.chat?.conditions ||
        groupInfo?.rules?.entry?.conditions) && (
        <GroupTypeBadge
          theme={theme}
          icon={TokenGatedIcon}
          header={'Gated group'}
          subheader={'Conditions must be true to join and chat'}
        />
      )}
      {Object.keys(ACCESS_TYPE_TITLE).map((key, idx) => (
        <Section key={idx} flexDirection="column">
         {getOperator(key as keyof typeof groupRules) ? (
          <>
         <Span
            fontSize="16px"
            fontWeight="500"
            alignSelf="start"
            margin="0 0 5px 0"
          >
            {ACCESS_TYPE_TITLE[key as keyof typeof ACCESS_TYPE_TITLE]?.heading}
          </Span>
           
            <Span fontSize="14px" margin="20px 0">
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
            </>
          ) : null}

          <ConditionSection
            width="100%"
            overflow="hidden auto"
            maxHeight="12.5rem"
            theme={theme}
            padding="0 4px 0 0"
            justifyContent="start"
            flexDirection="column"
          >
            <ConditionsComponent
              moreOptions={false}
              conditionData={groupRules[key as keyof typeof groupRules]}
            />
          </ConditionSection>
        </Section>
      ))}
    </Section>
  );
};

interface GroupTypeProps {
  theme: IChatTheme;
  icon: string;
  header: string;
  subheader: string;
  cursor?: string;
  handleNextInformation?: () => void;
}

const GroupTypeBadge = ({
  theme,
  icon,
  header,
  subheader,
  handleNextInformation,
  cursor,
}: GroupTypeProps) => {
  return (
    <Section cursor={cursor}>
      <PublicEncrypted onClick={handleNextInformation} theme={theme}>
        <Image
          cursor={cursor}
          src={icon}
          height="24px"
          maxHeight="24px"
          width={'auto'}
        />

        <Section
          cursor={cursor}
          flexDirection="column"
          alignItems="flex-start"
          gap="5px"
        >
          <Span
            cursor={cursor}
            fontSize="18px"
            color={theme.textColor?.modalHeadingText}
          >
            {header}
          </Span>
          <Span
            cursor={cursor}
            fontSize="12px"
            color={theme.textColor?.modalSubHeadingText}
          >
            {subheader}
          </Span>
        </Section>
      </PublicEncrypted>
    </Section>
  );
};

type GroupSectionProps = GroupInfoModalProps & {
  handleNextInformation: () => void;
  handlePreviousInformation?: () => void;
};

type GroupInfoModalProps = {
  theme: IChatTheme;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  groupInfo: IGroup;
  setGroupInfo: React.Dispatch<React.SetStateAction<IGroup | null | undefined>>;
};

export const GROUPINFO_STEPS = {
  GROUP_INFO: 1,
  CRITERIA: 2,
} as const;

export type GROUP_INFO_TYPE =
  typeof GROUPINFO_STEPS[keyof typeof GROUPINFO_STEPS];

const GroupInformation = ({
  theme,
  setModal,
  groupInfo,
  setGroupInfo,
  handleNextInformation,
}: GroupSectionProps) => {
  const { account } = useChatData();
  const [showAddMoreWalletModal, setShowAddMoreWalletModal] =
    useState<boolean>(false);
  const [showPendingRequests, setShowPendingRequests] =
    useState<boolean>(false);
  const [memberList, setMemberList] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copyText, setCopyText] = useState<string>('');
  const [selectedMemberAddress, setSelectedMemberAddress] = useState<
    string | null
  >(null);
  const { updateGroup } = useUpdateGroup();
  const isMobile = useMediaQuery(device.mobileL);

  const handleClose = () => onClose();
  const dropdownRef = useRef<any>(null);
  useClickAway(dropdownRef, () => setSelectedMemberAddress(null));
  const groupInfoToast = useToast();

  const groupCreator = groupInfo?.groupCreator;
  const membersExceptGroupCreator = groupInfo?.members?.filter(
    (x) => x.wallet?.toLowerCase() !== groupCreator?.toLowerCase()
  );

  const groupMembers = [
    ...membersExceptGroupCreator,
    ...groupInfo.pendingMembers,
  ];

  type UpdateGroupType = {
    adminList: Array<string>;
    memberList: Array<string>;
  };

  const handleUpdateGroup = async (options: UpdateGroupType) => {
    const { adminList, memberList } = options || {};
    const updateResponse = await updateGroup({
      groupInfo,
      memberList,
      adminList,
    });
    return { updateResponse };
  };

  const handleAddRemove = async (
    options: UpdateGroupType & { updateKey: UpdateKeys }
  ) => {
    const { adminList, memberList, updateKey } = options || {};

    try {
      setIsLoading(true);
      const { updateResponse } = await handleUpdateGroup({
        adminList,
        memberList,
      });

      if (typeof updateResponse !== 'string') {
        setGroupInfo(updateResponse);

        groupInfoToast.showMessageToast({
          toastTitle: 'Success',
          toastMessage: SUCCESS_MESSAGE[updateKey],
          toastType: 'SUCCESS',
          getToastIcon: (size) => <MdCheckCircle size={size} color="green" />,
        });
      } else {
        groupInfoToast.showMessageToast({
          toastTitle: 'Error',
          toastMessage: updateResponse,
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
      if (updateKey === UPDATE_KEYS.ADD_MEMBER) handleClose();
      setIsLoading(false);
      setSelectedMemberAddress(null);
    }
  };
  const removeMember = async () => {
    const updatedMemberList = getUpdatedMemberList(
      groupInfo,
      selectedMemberAddress!
    );
    const adminList = getUpdatedAdminList(
      groupInfo,
      selectedMemberAddress,
      true
    );
    await handleAddRemove({
      memberList: updatedMemberList,
      adminList,
      updateKey: UPDATE_KEYS.REMOVE_MEMBER,
    });
  };

  const addMembers = async () => {
    //Already Present Members and PendingMembers
    const groupMemberList = convertToWalletAddressList([
      ...groupInfo.members,
      ...groupInfo.pendingMembers,
    ]);

    //Newly Added Members and alreadyPresent Members in the groupchat
    const newMembersToAdd = memberList.map((member: any) => member.wallets);
    const members = [...groupMemberList, ...newMembersToAdd];

    //Admins wallet address from both members and pendingMembers
    const adminList = getAdminList?.(groupInfo);

    await handleAddRemove({
      memberList: members,
      adminList,
      updateKey: UPDATE_KEYS.ADD_MEMBER,
    });
  };

  const updateGroupAdmin = async (updateKey: UpdateKeys) => {
    const groupMemberList = convertToWalletAddressList([
      ...groupInfo.members,
      ...groupInfo.pendingMembers,
    ]);
    const newAdminList = getUpdatedAdminList(
      groupInfo,
      selectedMemberAddress,
      !(updateKey === UPDATE_KEYS.ADD_ADMIN)
    );
    await handleAddRemove({
      memberList: groupMemberList,
      adminList: newAdminList,
      updateKey,
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
    function: () => updateGroupAdmin(UPDATE_KEYS.REMOVE_ADMIN),
  };
  const addAdminDropdown: DropdownValueType = {
    id: 'add_admin',
    title: 'Make group admin',
    icon: AddAdmin,
    function: () => updateGroupAdmin(UPDATE_KEYS.ADD_ADMIN),
  };
  const removeMemberDropdown: DropdownValueType = {
    id: 'remove_member',
    title: 'Remove',
    icon: Remove,
    function: () => removeMember(),
    textColor: '#ED5858',
  };

  //remove all testing things

  const a1: DropdownValueType = {
    id: 'dismiss_admin',
    title: 'Dismiss as admin',
    function: () => updateGroupAdmin(UPDATE_KEYS.REMOVE_ADMIN),
  };
  const a2: DropdownValueType = {
    id: 'add_admin',
    title: 'Make group admin',
    function: () => updateGroupAdmin(UPDATE_KEYS.ADD_ADMIN),
  };

  const handlePrevious = () => {
    setShowAddMoreWalletModal(false);
  };

  const onClose = (): void => {
    setModal(false);
  };

  return (
    <Section width={isMobile ? '100%' : '410px'} flexDirection="column">
      <GroupDescription>
        <Span fontSize="18px" color={theme.textColor?.modalHeadingText}>
          Chat ID
        </Span>
        <Section
          gap="5px"
          alignSelf="start"
          onClick={() => {
            copyToClipboard(groupInfo?.chatId);
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
            {shortenText(groupInfo?.chatId, 8, true)}
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
        icon={groupInfo?.isPublic ? LockIcon : LockSlashIcon}
        header={groupInfo?.isPublic ? 'Open' : 'Encrypted'}
        subheader={
          groupInfo?.isPublic
            ? 'Chats are not encrypted'
            : 'Chats are end-to-end encrypted'
        }
      />
      {(groupInfo.rules?.chat?.conditions ||
        groupInfo.rules?.entry?.conditions) && (
        <GroupTypeBadge
          cursor="pointer"
          handleNextInformation={handleNextInformation}
          theme={theme}
          icon={TokenGatedIcon}
          header={'Gated group'}
          subheader={'Conditions must be true to join'}
        />
      )}

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
        )}

      <Section borderRadius="16px">
        {groupInfo?.pendingMembers?.length > 0 && (
          <PendingMembers
            groupInfo={groupInfo}
            setShowPendingRequests={setShowPendingRequests}
            showPendingRequests={showPendingRequests}
            theme={theme}
          />
        )}
      </Section>

      <ProfileSection
        margin="15px 10px"
        flexDirection="column"
        zIndex="2"
        maxHeight="9rem"
        height="9rem"
        justifyContent="start"
        overflow="hidden auto"
        theme={theme}
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
      </ProfileSection>
      {showAddMoreWalletModal && (
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
      )}
    </Section>
  );
};

export const GroupInfoModal = ({
  theme,
  setModal,
  groupInfo,
  setGroupInfo,
}: GroupInfoModalProps) => {
  const [activeComponent, setActiveComponent] = useState<GROUP_INFO_TYPE>(
    GROUPINFO_STEPS.GROUP_INFO
  );
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
            setGroupInfo={setGroupInfo}
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
            setGroupInfo={setGroupInfo}
          />
        );
    }
  };
  const [showAddMoreWalletModal, setShowAddMoreWalletModal] =
    useState<boolean>(false);
  useState<boolean>(false);
  const [selectedMemberAddress, setSelectedMemberAddress] = useState<
    string | null
  >(null);

  const isMobile = useMediaQuery(device.mobileL);

  const dropdownRef = useRef<any>(null);
  useClickAway(dropdownRef, () => setSelectedMemberAddress(null));

  const onClose = (): void => {
    setModal(false);
  };

  if (groupInfo) {
    return (
      <Modal clickawayClose={onClose}>
        {!showAddMoreWalletModal && (
          <Section
            width={isMobile ? '100%' : '410px'}
            flexDirection="column"
            padding={isMobile ? '0px auto' : '0px 10px'}
          >
            <ModalHeader
              handlePrevious={
                activeComponent == 2 ? handlePreviousInfo : undefined
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
                <Span
                  fontSize="16px"
                  fontWeight="500"
                  color={theme.textColor?.modalSubHeadingText}
                >
                  {groupInfo?.members?.length} Members
                </Span>
              </Section>
            </GroupHeader>
            {renderComponent()}
          </Section>
        )}
      </Modal>
    );
  } else {
    return null;
  }
};

//styles
const GroupHeader = styled.div`
  margin-top: 34px;
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 19px;
`;

const GroupDescription = styled.div`
  margin-top: 25px;
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: flex-start;
  gap: 5px;
`;

const PublicEncrypted = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 12px;
  align-items: center;
  border: ${(props) => props.theme.border.modalInnerComponents};
  border-radius: ${(props) => props.theme.borderRadius.modalInnerComponents};
  padding: 16px;
  box-sizing: border-box;
  background: ${(props) => props.theme.backgroundColor.modalHoverBackground};
`;

const AddWalletContainer = styled.div`
  margin-top: 20px;
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

const GroupPendingMembers = styled.div`
  margin-top: 3px;
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  background: ${(props) => props.theme.backgroundColor.modalHoverBackground};
  padding: 10px 15px;
  box-sizing: border-box;

  &:last-child {
    border-radius: 0px 0px 16px 16px;
  }
`;

const PendingRequestWrapper = styled.div`
  width: 100%;
  margin-top: 20px;
  border: ${(props) => props.theme.border.modalInnerComponents};
  border-radius: ${(props) => props.theme.borderRadius.modalInnerComponents};
  padding: 0px 0px;
  box-sizing: border-box;
`;

const PendingSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 1;
  cursor: pointer;
  padding: 15px 20px;
  box-sizing: border-box;
`;

const ArrowImage = styled(Image)<ShadowedProps>`
  margin-left: auto;
  transform: ${(props) =>
    props?.setPosition ? 'rotate(0)' : 'rotate(180deg)'};
`;

const Badge = styled.div`
  margin: 0 0 0 5px;
  font-size: 13px;
  background: rgb(207, 28, 132);
  padding: 4px 8px;
  border-radius: 7px;
  color: white;
  font-weight: 700;
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

const ProfileSection = styled(Section)<{ theme: IChatTheme }>`
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
