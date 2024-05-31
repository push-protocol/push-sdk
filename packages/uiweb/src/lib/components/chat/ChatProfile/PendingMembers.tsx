import { useEffect, useRef, useState } from 'react';

import { ChatMemberProfile, ParticipantStatus } from '@pushprotocol/restapi';
import { MdCheckCircle, MdError } from 'react-icons/md';
import styled from 'styled-components';

import { useChatData, useClickAway, useIsInViewport } from '../../../hooks';
import useGroupMemberUtilities from '../../../hooks/chat/useGroupMemberUtilities';
import useUpdateGroup from '../../../hooks/chat/useUpdateGroup';
import { IChatTheme } from '../exportedTypes';
import { DropdownValueType, ProfileContainer } from '../reusables';
import { GROUP_ROLES, GroupRolesKeys } from '../types';
import { MemberPaginationData } from './ChatProfileInfoModal';
import { MemberProfileCard } from './MemberProfileCard';

import { pCAIP10ToWallet, shortenText } from '../../../helpers';
import ArrowIcon from '../../../icons/CaretUp.svg';
import AddAdmin from '../../../icons/addadmin.svg';
import DismissAdmin from '../../../icons/dismissadmin.svg';
import Remove from '../../../icons/remove.svg';
import { Image, Section, Span, Spinner } from '../../reusables';
import { isAdmin } from '../helpers';

interface ShadowedProps {
  setPosition: boolean;
}

type PendingMembersProps = {
  pendingMemberPaginationData: MemberPaginationData;
  setPendingMemberPaginationData: React.Dispatch<React.SetStateAction<MemberPaginationData>>;
  pendingMembers: ChatMemberProfile[];
  setShowPendingRequests: React.Dispatch<React.SetStateAction<boolean>>;
  showPendingRequests: boolean;
  count: number;
  theme: IChatTheme;
};
type AcceptedMembersProps = {
  acceptedMemberPaginationData: MemberPaginationData;
  setAcceptedMemberPaginationData: React.Dispatch<React.SetStateAction<MemberPaginationData>>;
  acceptedMembers: ChatMemberProfile[];
  accountStatus: ParticipantStatus | null;
  chatId: string;
  theme: IChatTheme;
};

const UPDATE_KEYS = {
  REMOVE_MEMBER: 'REMOVE_MEMBER',
  ADD_MEMBER: 'ADD_MEMBER',
  REMOVE_ADMIN: 'REMOVE_ADMIN',
  ADD_ADMIN: 'ADD_ADMIN',
} as const;

const SUCCESS_MESSAGE = {
  REMOVE_MEMBER: 'Removed Member successfully',
  ADD_MEMBER: 'Group Invitation sent',
  REMOVE_ADMIN: 'Admin removed successfully',
  ADD_ADMIN: 'Admin added successfully',
};

export const PendingMembers = ({
  pendingMembers,
  setShowPendingRequests,
  setPendingMemberPaginationData,
  showPendingRequests,
  pendingMemberPaginationData,
  count,
  theme,
}: PendingMembersProps) => {
  const pendingMemberPageRef = useRef<HTMLDivElement>(null);

  const isInViewportPending = useIsInViewport(pendingMemberPageRef, '1px');

  useEffect(() => {
    if (!isInViewportPending || pendingMemberPaginationData.loading || pendingMemberPaginationData.finishedFetching) {
      return;
    }

    const newPage = pendingMemberPaginationData.page + 1;
    setPendingMemberPaginationData((prev: MemberPaginationData) => ({
      ...prev,
      page: newPage,
    }));
    // eslint-disable-next-line no-use-before-define
  }, [isInViewportPending]);
  if (pendingMembers && pendingMembers.length) {
    return (
      <PendingRequestWrapper theme={theme}>
        <PendingSection onClick={() => setShowPendingRequests(!showPendingRequests)}>
          <Span
            fontSize="18px"
            color={theme.textColor?.modalSubHeadingText}
          >
            Pending Requests
          </Span>
          <Badge>{count}</Badge>

          <ArrowImage
            src={ArrowIcon}
            width={'auto'}
            setPosition={!showPendingRequests}
            borderRadius="100%"
          />
        </PendingSection>

        <ProfileSection
          flexDirection="column"
          flex="1"
          justifyContent="start"
          borderRadius="12px"
          theme={theme}
          padding='10px 0 0 0'
        >
          {showPendingRequests &&
            pendingMembers &&
            pendingMembers?.length > 0 &&
            pendingMembers.map((item) => (
              <GroupPendingMembers theme={theme}>
                <ProfileContainer
                  theme={theme}
                  member={{
                    name: null,
                    icon: item?.userInfo?.profile?.picture || null,
                    chatId: null,
                    web3Name: null,
                    recipient: pCAIP10ToWallet(item.address?.split(':')[1]),
                    abbrRecipient: shortenText(pCAIP10ToWallet(item.address?.split(':')[1]), 6, true),
                    desc: null,
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
          {pendingMemberPaginationData.loading && (
            <Section>
              <Spinner
                size="20"
                color={theme.spinnerColor}
              />
            </Section>
          )}
          <div
            ref={pendingMemberPageRef}
            style={{ padding: '1px' }}
          ></div>
        </ProfileSection>
      </PendingRequestWrapper>
    );
  } else {
    return null;
  }
};

export const AcceptedMembers = ({
  acceptedMembers,
  setAcceptedMemberPaginationData,
  acceptedMemberPaginationData,
  accountStatus,
  chatId,
  theme,
}: AcceptedMembersProps) => {
  const { toast } = useChatData();
  const acceptedMemberPageRef = useRef<HTMLDivElement>(null);
  const [selectedMemberAddress, setSelectedMemberAddress] = useState<string | null>(null);
  const dropdownRef = useRef<any>(null);
  const { addMember, removeMember, modifyLoading, addLoading, removeLoading, modifyParticipant } = useUpdateGroup();

  const isInViewportPending = useIsInViewport(acceptedMemberPageRef, '1px');

  useEffect(() => {
    if (!isInViewportPending || acceptedMemberPaginationData.loading || acceptedMemberPaginationData.finishedFetching) {
      return;
    }

    const newPage = acceptedMemberPaginationData.page + 1;
    setAcceptedMemberPaginationData((prev: MemberPaginationData) => ({
      ...prev,
      page: newPage,
    }));
    // eslint-disable-next-line no-use-before-define
  }, [isInViewportPending]);

  const handleRemoveMember = async (role: GroupRolesKeys) => {
    try {
      const response = await removeMember({
        memberList: [selectedMemberAddress!],
        chatId: chatId!,
        role: role,
      });

      if (role === GROUP_ROLES.ADMIN) {
        handleError(response, SUCCESS_MESSAGE[UPDATE_KEYS.REMOVE_ADMIN]);
      }
      if (role === GROUP_ROLES.MEMBER) {
        handleError(response, SUCCESS_MESSAGE[UPDATE_KEYS.REMOVE_MEMBER]);
      }
    } catch (error) {
      toast.showMessageToast({
        toastTitle: 'Error',
        toastMessage: 'Please, try again',
        toastType: 'ERROR',
        getToastIcon: (size: number) => (
          <MdError
            size={size}
            color="red"
          />
        ),
      });
    } finally {
      setSelectedMemberAddress(null);
    }
  };
  const handleModifyParticipant = async (role: GroupRolesKeys) => {
    try {
      const response = await modifyParticipant({
        memberList: [selectedMemberAddress!],
        chatId: chatId!,
        role: role,
      });

      if (role === GROUP_ROLES.ADMIN) {
        handleError(response, SUCCESS_MESSAGE[UPDATE_KEYS.ADD_ADMIN]);
      }
      if (role === GROUP_ROLES.MEMBER) {
        handleError(response, SUCCESS_MESSAGE[UPDATE_KEYS.REMOVE_ADMIN]);
      }
    } catch (error) {
      toast.showMessageToast({
        toastTitle: 'Error',
        toastMessage: 'Please, try again',
        toastType: 'ERROR',
        getToastIcon: (size: number) => (
          <MdError
            size={size}
            color="red"
          />
        ),
      });
    } finally {
      setSelectedMemberAddress(null);
    }
  };

  const handleError = (response: any, errMessage: string) => {
    if (typeof response !== 'string') {
      toast.showMessageToast({
        toastTitle: 'Success',
        toastMessage: errMessage,
        toastType: 'SUCCESS',
        getToastIcon: (size: number) => (
          <MdCheckCircle
            size={size}
            color="green"
          />
        ),
      });
    } else {
      toast.showMessageToast({
        toastTitle: 'Error',
        toastMessage: 'Error',
        toastType: 'ERROR',
        getToastIcon: (size: number) => (
          <MdError
            size={size}
            color="red"
          />
        ),
      });
    }
  };

  const removeAdminDropdown: DropdownValueType = {
    id: 'dismiss_admin',
    title: 'Dismiss as admin',
    icon: DismissAdmin,
    function: () => handleModifyParticipant(GROUP_ROLES.MEMBER),
  };
  const addAdminDropdown: DropdownValueType = {
    id: 'add_admin',
    title: 'Make group admin',
    icon: AddAdmin,
    function: () => handleModifyParticipant(GROUP_ROLES.ADMIN),
  };
  const removeMemberDropdown: DropdownValueType = {
    id: 'remove_member',
    title: 'Remove',
    icon: Remove,
    function: () => handleRemoveMember(GROUP_ROLES.MEMBER),
    textColor: '#ED5858',
  };

  useClickAway(dropdownRef, () => setSelectedMemberAddress(null));
  if (acceptedMembers && acceptedMembers.length) {
    return (
      <ProfileSection
        flexDirection="column"
        zIndex="2"
        justifyContent="start"
        theme={theme}
        padding='10px 0 0 0'
      >
        {acceptedMembers.map((item, index) => (
          <MemberProfileCard
            key={index}
            member={item}
            dropdownValues={
              isAdmin(item) && accountStatus?.role === GROUP_ROLES.ADMIN.toLowerCase()
                ? [removeAdminDropdown, removeMemberDropdown]
                : accountStatus?.role === GROUP_ROLES.ADMIN.toLowerCase()
                  ? [addAdminDropdown, removeMemberDropdown]
                  : []
            }
            selectedMemberAddress={selectedMemberAddress}
            setSelectedMemberAddress={setSelectedMemberAddress}
            dropdownRef={dropdownRef}
          />
        ))}
        <div
          ref={acceptedMemberPageRef}
          style={{ padding: '1px' }}
        ></div>
        {acceptedMemberPaginationData.loading && (
          <Section>
            <Spinner
              size="20"
              color={theme.spinnerColor}
            />
          </Section>
        )}
      </ProfileSection>
    );
  } else {
    return null;
  }
};

//styles
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
  padding: 15px 20px 5px 20px;
  box-sizing: border-box;
`;

const ArrowImage = styled(Image) <ShadowedProps>`
  margin-left: auto;
  transform: ${(props) => (props?.setPosition ? 'rotate(0)' : 'rotate(180deg)')};
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

const ProfileSection = styled(Section) <{ theme: IChatTheme }>`
  height: fit-content;
  &::-webkit-scrollbar-thumb {
    background: transparent;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-button {
    height: 20px;
  }
  &::-webkit-scrollbar {
    width: 0px;
  }
`;
