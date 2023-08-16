import { useContext, useRef, useState } from "react";
import { ThemeContext } from "../theme/ThemeProvider";
import { useClickAway } from "../../../hooks";
import Dropdown, { DropdownValueType } from "./DropDown";
import DismissAdmin from '../../../icons/dismissadmin.svg';
import AddAdmin from '../../../icons/addadmin.svg';
import Remove from '../../../icons/remove.svg';
import styled from "styled-components";
import { Section, Image, Span } from "../../reusables/sharedStyling";
import { MemberListContainerType, WalletProfileContainerProps } from "../exportedTypes";
import { findObject } from "../helpers/helper";
import { device } from "../../../config";
import { shortenText } from "../../../helpers";

export const MemberListContainer = ({ key, memberData, handleMembers, handleMemberList, lightIcon, darkIcon, memberList }: MemberListContainerType) => {
    const theme = useContext(ThemeContext);
   const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [dropdownHeight, setDropdownHeight] = useState<number | undefined>(0);
  const dropdownRef = useRef<any>(null);


  useClickAway(dropdownRef, () => setSelectedWallet(null));

  const removeAdminDropdown: DropdownValueType =
    { id: 'dismiss_admin', title: 'Dismiss as admin', icon: DismissAdmin, function: () => dismissGroupAdmin() }

  const addAdminDropdown: DropdownValueType =
    { id: 'dismiss_admin', title: 'Make group admin', icon: AddAdmin, function: () => makeGroupAdmin() }

  const removeUserDropdown: DropdownValueType =
    { id: 'remove_user', title: 'Remove', icon: Remove, function: () => removeUser() }

  const dismissGroupAdmin = () => {
    const updatedMembers = memberList.map((member:any) => member?.wallets?.toLowerCase() == memberData?.wallets?.toLowerCase() ? ({ ...member, isAdmin: false }) : member)
    handleMembers?.(updatedMembers)
    setSelectedWallet(null)
  }

  const makeGroupAdmin = () => {
    const updatedMembers = memberList.map((member: any) => member?.wallets?.toLowerCase() == memberData?.wallets?.toLowerCase() ? ({ ...member, isAdmin: true }) : member)
    handleMembers?.(updatedMembers)
    setSelectedWallet(null)
  }

  const removeUser = () => {
    handleMemberList(memberData)
    setSelectedWallet(null)
  }


  const handleHeight = (id: any) => {
    const containerHeight = document.getElementById(id)?.getBoundingClientRect();
    setDropdownHeight(containerHeight?.top);
  };


    return (
    <WalletProfileContainer id={memberData?.wallets} background = { memberList ? 'transparent' : theme.groupSearchProfilBackground } 
    border={memberList ? `1px solid ${theme.modalInputBorderColor}`: 'none'}
    >
      <WalletProfile>
        <Section
          width="48px"
          maxWidth="48px"
          borderRadius="100%"
          overflow="auto"
          margin="0px 12px 0px 0px"
        >
          <Image src={memberData?.profilePicture ?? ''} height="48px" maxHeight="48px" width={'auto'} cursor='pointer' />
        </Section>
        
        <Span fontSize="18px" fontWeight="400" color={theme.modalPrimaryTextColor}>{shortenText(memberData?.wallets?.split(':')[1], 8, true)}</Span>
        </WalletProfile>  

        <Section justifyContent="flex-end">
        {memberData?.isAdmin && (
            <Span
                background="#F4DCEA"
                color="#D53A94"
                borderRadius="8px"
                padding="6px"
                fontWeight="500"
                fontSize="10px"
            >
            Admin
            </Span>
        )}
      <Section
        maxWidth='fit-content'
        onClick={() => {
          handleHeight(memberData?.wallets);
          setSelectedWallet(null)
          memberList
            ? findObject(memberData, memberList, 'wallets')
              ? setSelectedWallet(memberData?.wallets)
              : handleMemberList(memberData)
            : handleMemberList(memberData)
        }}
      >
        {/* {theme === 'light' ? lightIcon : darkIcon} */}
        {darkIcon}
      </Section>
      </Section>

      {selectedWallet?.toLowerCase() == memberData?.wallets?.toLowerCase() && (
        <DropdownContainer style={{ top: dropdownHeight! > 500 ? '50%' : "40%" }} ref={dropdownRef} theme={theme}>
          <Dropdown
            dropdownValues={memberData?.isAdmin ? [removeAdminDropdown,removeUserDropdown] : [addAdminDropdown, removeUserDropdown]}
            hoverBGColor={theme.snapFocusBg}
          />
        </DropdownContainer>
      )}

    </ WalletProfileContainer>
    )
}


const WalletProfileContainer = styled(Section)<WalletProfileContainerProps>`
    // position: relative;
    padding: 5px 16px;
    margin: 8px 0px;
    justify-content: space-between;
    // min-width: 450px;
    min-width: 100%;
    box-sizing: border-box;
    align-items: center;
    border-radius: 16px;
    @media (max-width: 480px) {
    // min-width: 300px;
    }

`;

const WalletProfile = styled(Section)`
  justify-content: flex-start;
`;

const DropdownContainer = styled.div`
  position: absolute;
  left: 48%;
  border-radius: 16px;
  padding: 14px 8px;
  background: ${(props) => props.theme.modalContentBackground};
  z-index: 11;
  @media ${device.mobileL} {
    left: 27%;
  }
  @media (min-width: 426px) and (max-width: 1150px) {
    left: 47%;
  }
`;