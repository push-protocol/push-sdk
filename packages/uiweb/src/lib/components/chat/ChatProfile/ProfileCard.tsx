// React + Web3 Essentials
import React, { useContext ,useState } from 'react';

// External Packages
import styled from 'styled-components';
import { ethers } from 'ethers';

// Internal Components
import { MoreLightIcon }  from '../../../icons/MoreLight';
import { MoreDarkIcon } from '../../../icons/MoreDark';
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
      <Section justifyContent="flex-start" position='relative' zIndex='2'>
        <Section
          height="48px"
          maxWidth="48px"
          borderRadius="100%"
          overflow="hidden"
          margin="0px 12px 0px 0px"
          position='relative'
          zIndex='2'
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
          position='relative'
          zIndex='2'
        >
          {shortenText(member?.wallet?.split(':')[1], 6, true)}
        </Span>
      </Section>
      <Section justifyContent="flex-end" position='relative' zIndex='2'>
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
            position='relative'
            zIndex='2'
            onClick={() => {
              handleHeight(member.wallet);
              setSelectedMemberAddress(member?.wallet)
            }}
            style={{ cursor: 'pointer' }}
          >
             <MoreLightIcon fill={theme.iconColor?.groupSettings}/>
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

const ProfileCardItem = styled(Section)<{id: any, key: any, background: any}>`
  justify-content: space-between;
  padding: 8px 16px;
  border-radius: 16px;
  position: relative;
  box-sizing: border-box;
  width: 100%;
  // background-color: ${(props) => props.theme.snapFocusBg};
  max-height: 64px;
  align-self: stretch;
  display: flex;
  height: auto;
  z-index: auto;
  flex: 1;
  @media (max-width: 480px) {
    max-width: 100%;
  }
`;

const DropdownContainer = styled(Section)`
  position: absolute;
  left: 48%;
  top: 69%;
  border-radius: 16px;
  padding: 14px 8px;
  z-index: 999999999999 !important;
  display: flex;
  flex-direction: column !important;
  background: ${(props) => props.theme.modalContentBackground};
  border: 1px solid ${(props) => props.theme.modalBorderColor};

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
