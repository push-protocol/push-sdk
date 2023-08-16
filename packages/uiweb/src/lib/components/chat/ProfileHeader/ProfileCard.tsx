// React + Web3 Essentials
import React, { useContext ,useState } from 'react';

// External Packages
import styled from 'styled-components';
import { ethers } from 'ethers';

// Internal Components
import { ReactComponent as MoreLight } from '../../../icons/more.svg';
import { ReactComponent as MoreDark } from '../../../icons/moredark.svg';
import { shortenText } from "../../../helpers";
import { ThemeContext } from "../theme/ThemeProvider";
import { useChatData, useClickAway} from "../../../hooks";
import { Image, Section, Span } from "../../reusables";
import Dropdown from './DropDown';
import { pCAIP10ToWallet } from '../../../helpers';
import { device } from "../../../config";


type ProfileCardProps = {
  key?: number | string,
  member?: any,
  dropdownValues?: any;
  selectedMemberAddress?: any;
  setSelectedMemberAddress?: any;
  dropdownRef?: any;
}

export const ProfileCard = ({
  key,
  member,
  dropdownValues,
  selectedMemberAddress,
  setSelectedMemberAddress,
  dropdownRef,
}: ProfileCardProps) => {
  const theme = useContext(ThemeContext);
  const { account } = useChatData();

  const [dropdownHeight, setDropdownHeight] = useState<number | undefined>(0);

  const handleHeight = (id: any) => {
    const containerHeight = document.getElementById(id)?.getBoundingClientRect();
    setDropdownHeight(containerHeight?.top);
  };

  return (
    <ProfileCardItem background={member.wallet === selectedMemberAddress ? theme.snapFocusBg : ''} id={member.wallet} key={key} theme={theme}>
      <Section flex='1' justifyContent="flex-start">
        <Section
          height="48px"
          maxWidth="48px"
          borderRadius="100%"
          overflow="hidden"
          margin="0px 12px 0px 0px"
        >
          <Image
            height="48px" maxHeight="48px" width={'auto'} cursor='pointer'
            src={member?.image}
          />
        </Section>
        <Span
          fontSize="18px"
          fontWeight="400"
          color={theme.modalProfileTextColor}
        >
          {shortenText(member?.wallet?.split(':')[1], 6, true)}
        </Span>
      </Section>
      <Section justifyContent="flex-end">
        {member?.isAdmin && (
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
        {pCAIP10ToWallet(member?.wallet)?.toLowerCase() !== account?.toLowerCase() && dropdownValues.length > 0 && (
          <Section
            maxWidth="fit-content"
            padding="0 0px 0 0"
            onClick={() => {
              handleHeight(member.wallet);
              setSelectedMemberAddress(member?.wallet)
            }}
            style={{ cursor: 'pointer' }}
          >
            {theme ? <MoreLight /> : <MoreDark />}
          </Section>
        )}
      </Section>
      {selectedMemberAddress?.toLowerCase() == member?.wallet?.toLowerCase() && (
        <DropdownContainer
          style={{ top: dropdownHeight! > 570 ? '30%' : '40%' }}
          theme={theme}
          ref={dropdownRef}>
          <Dropdown
            dropdownValues={dropdownValues}
            hoverBGColor={theme.snapFocusBg}
          />
        </DropdownContainer>
      )}
    </ProfileCardItem>
  );
};

const ProfileCardItem = styled(Section)`
  justify-content: space-between;
  padding: 8px 16px;
  border-radius: 16px;
  position: relative;
  box-sizing: border-box;
  width: 100%;
  flex: 1;
  background-color: ${(props) => props.theme.snapFocusBg};
  margin-bottom: 8px;
  max-height: 64px;
  @media (max-width: 480px) {
    max-width: 100%;
  }
`;

const DropdownContainer = styled.div`
  position: absolute;
  left:48%;
  top: 69%;
  border-radius: 16px;
  padding: 14px 8px;
  background: ${(props) => props.theme.modalContentBackground};
  border: 1px solid ${(props) => props.theme.modalBorderColor};
  z-index: 52;
  @media ${device.mobileL} {
    left: 27%;
  }
  @media (min-width: 426px) and (max-width: 1150px) {
    left: 48%;
  }
  @media (max-width: 480px){
    left: 25%;
  }
`;
