import styled from "styled-components";

import { IChatTheme } from "../exportedTypes";
import { ProfileContainer } from '../reusables';
import ArrowIcon from '../../../icons/CaretUp.svg';
import { Span,Image, Section } from "../../reusables";
import { shortenText } from "../../../helpers";
import { GroupInfoDTO } from "@pushprotocol/restapi";

interface ShadowedProps {
    setPosition: boolean;
  }

type PendingMembersProps = {
    groupInfo?: GroupInfoDTO | null;
    setShowPendingRequests: React.Dispatch<React.SetStateAction<boolean>>;
    showPendingRequests: boolean;
    theme: IChatTheme;
  };
export const PendingMembers = ({
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
              justifyContent="start"
              borderRadius="16px"
            >
              {/* {groupInfo?.pendingMembers &&
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
                ))} */}
            </ProfileSection>
          )}
        </PendingRequestWrapper>
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