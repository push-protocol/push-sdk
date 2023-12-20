import styled from 'styled-components';

import { IChatTheme } from '../exportedTypes';
import { ProfileContainer } from '../reusables';
import ArrowIcon from '../../../icons/CaretUp.svg';
import { Span, Image, Section, Spinner } from '../../reusables';
import { pCAIP10ToWallet, shortenText } from '../../../helpers';
import { ChatMemberProfile, GroupInfoDTO } from '@pushprotocol/restapi';
import { MemberPaginationData } from './GroupInfoModal';
import { useIsInViewport } from '../../../hooks';
import { useEffect, useRef } from 'react';
import { MemberProfileCard } from './MemberProfileCard';

interface ShadowedProps {
  setPosition: boolean;
}

type PendingMembersProps = {
  pendingMemberPaginationData: MemberPaginationData;
  setPendingMemberPaginationData: React.Dispatch<
    React.SetStateAction<MemberPaginationData>
  >;
  pendingMembers: ChatMemberProfile[];
  setShowPendingRequests: React.Dispatch<React.SetStateAction<boolean>>;
  showPendingRequests: boolean;
  theme: IChatTheme;
};
type AcceptedMembersProps = {
  acceptedMemberPaginationData: MemberPaginationData;
  setAcceptedMemberPaginationData: React.Dispatch<
    React.SetStateAction<MemberPaginationData>
  >;
  acceptedMembers: ChatMemberProfile[];
  theme: IChatTheme;
};

export const PendingMembers = ({
  pendingMembers,
  setShowPendingRequests,
  setPendingMemberPaginationData,
  showPendingRequests,
  pendingMemberPaginationData,
  theme,
}: PendingMembersProps) => {
  const pendingMemberPageRef = useRef<HTMLDivElement>(null);
  const isInViewportPending = useIsInViewport(pendingMemberPageRef, '1px');

  useEffect(() => {
    console.log(isInViewportPending,pendingMemberPaginationData.finishedFetching);
    if (
      !isInViewportPending ||
      pendingMemberPaginationData.loading ||
      pendingMemberPaginationData.finishedFetching
    ) {
      return;
    }

    const newPage = pendingMemberPaginationData.page + 1;
    console.log('new page updated', newPage);
    setPendingMemberPaginationData((prev: MemberPaginationData) => ({
      ...prev,
      page: newPage,
    }));
    // eslint-disable-next-line no-use-before-define
  }, [isInViewportPending]);
  console.log(isInViewportPending)

  if (pendingMembers && pendingMembers.length) {
    return (
      <PendingRequestWrapper theme={theme}>
        <PendingSection
          onClick={() => setShowPendingRequests(!showPendingRequests)}
        >
          <Span fontSize="18px" color={theme.textColor?.modalSubHeadingText}>
            Pending Requests
          </Span>
          {/* <Badge>{groupInfo?.pendingMembers?.length}</Badge> */}

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
            overflow="hidden scroll"
            maxHeight="10rem"
            justifyContent="start"
            borderRadius="16px"
          >
            {pendingMembers &&
              pendingMembers?.length > 0 &&
              pendingMembers.map((item) => (
                <GroupPendingMembers theme={theme}>
                  <ProfileContainer
                    theme={theme}
                    member={{
                      wallet: shortenText(
                        pCAIP10ToWallet(item.address?.split(':')[1]),
                        6,
                        true
                      ),
                      image: item?.userInfo?.profile?.picture || '',
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
            <div ref={pendingMemberPageRef} style={{ padding: '5px' }}>hello</div>
            {pendingMemberPaginationData.loading && (
              <Section>
                <Spinner size="20" />
              </Section>
            )}
          </ProfileSection>
        )}
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
  theme,
}: AcceptedMembersProps) => {
  const acceptedMemberPageRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<any>(null);

  const isInViewportPending = useIsInViewport(acceptedMemberPageRef, '1px');

  useEffect(() => {
    console.log(isInViewportPending,acceptedMemberPaginationData.finishedFetching);
    if (
      !isInViewportPending ||
      acceptedMemberPaginationData.loading ||
      acceptedMemberPaginationData.finishedFetching
    ) {
      return;
    }

    const newPage = acceptedMemberPaginationData.page + 1;
    console.log('new page updated', newPage);
    setAcceptedMemberPaginationData((prev: MemberPaginationData) => ({
      ...prev,
      page: newPage,
    }));
    // eslint-disable-next-line no-use-before-define
  }, [isInViewportPending]);
  console.log(acceptedMembers,'in hereeeeeee')

  if (acceptedMembers && acceptedMembers.length) {
    return (
      <ProfileSection flexDirection="column" zIndex="2" justifyContent="start">
      {
        acceptedMembers.map((item, index) => (
          <MemberProfileCard
            key={index}
            member={item}
            dropdownValues={
              []
              // item?.isAdmin && isAccountOwnerAdmin(groupInfo, account!)
              //   ? [removeAdminDropdown, removeMemberDropdown]
              //   : isAccountOwnerAdmin(groupInfo, account!)
              //   ? [addAdminDropdown, removeMemberDropdown]
              //   : []
            }
            // selectedMemberAddress={selectedMemberAddress}
            // setSelectedMemberAddress={setSelectedMemberAddress}
            dropdownRef={dropdownRef}
          />
        ))}
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

const ProfileSection = styled(Section)`
  height: fit-content;
`;
