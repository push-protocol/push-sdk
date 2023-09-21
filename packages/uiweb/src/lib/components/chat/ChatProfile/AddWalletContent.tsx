import { useContext, useState } from 'react';

import styled from 'styled-components';

import { ThemeContext } from '../theme/ThemeProvider';
import { useChatData } from '../../../hooks';
import { MdError } from 'react-icons/md';

import { Spinner } from '../../supportChat/spinner/Spinner';
import { MoreLightIcon } from '../../../icons/MoreLight';
import { MoreDarkIcon } from '../../../icons/MoreDark';
import { Section, Span, Image } from '../../reusables/sharedStyling';
import { AddUserDarkIcon } from '../../../icons/Adddark';
import { MemberListContainer } from './MemberListContainer';
import useMediaQuery from '../../../hooks/useMediaQuery';
import useToast from '../helpers/NewToast';

import {
  getNewChatUser,
} from '../../../helpers';
import { ModalButtonProps, User } from '../exportedTypes';
import { addWalletValidation } from '../helpers/helper';
import { device } from '../../../config';
import CloseIcon from '../../../icons/close.svg';
import { ChatSearchInput, CustomStyleParamsType } from '../reusables';
import useGetChatProfile from '../../../hooks/useGetChatProfile';
import { BackIcon } from '../../../icons/Back';


//add back button ---> done
type AddWalletContentProps = {
  onSubmit: () => void;
  onClose: () => void;
  handlePrevious: () => void;
  memberList: any;
  handleMemberList: any;
  groupMembers: any;
  isLoading?: boolean;
  modalHeader: string;
};
export const AddWalletContent = ({
  onSubmit,
  handlePrevious,
  onClose,
  memberList,
  handleMemberList,
  groupMembers,
  isLoading,
  modalHeader,
}: AddWalletContentProps) => {
  const theme = useContext(ThemeContext);

  const [filteredUserData, setFilteredUserData] = useState<any>(null);
  const { account, env } = useChatData();
  const isMobile = useMediaQuery(device.mobileL);
  const {fetchChatProfile} = useGetChatProfile();
  const groupInfoToast = useToast();
  const customSearchStyle:CustomStyleParamsType = {
   background:theme.backgroundColor?.modalInputBackground,
   border:theme.border?.modalInnerComponents,
   placeholderColor:theme.textColor?.modalSubHeadingText,
   fontSize:'15px',
   fontWeight:'400'
  };

  const handleSearch = async ({searchedText}:{searchedText:string}): Promise<void> => {
    //fix ens search ---> done
    const newChatUser = await getNewChatUser({
      searchText: searchedText,
      fetchChatProfile,
      env,
    });
    if(newChatUser){
      setFilteredUserData(newChatUser);
    }
    else{
        groupInfoToast.showMessageToast({
          toastTitle: 'Error',
          toastMessage: 'Invalid Address',
          toastType: 'ERROR',
          getToastIcon: (size) => <MdError size={size} color="red" />,
        });
    }
  };

  const clearInput = () => {
    setFilteredUserData(null);
  };

  const addMemberToList = (member: User) => {
    let errorMessage = '';

    errorMessage = addWalletValidation(
      member,
      memberList,
      groupMembers,
      account
    );

    if (errorMessage) {
      groupInfoToast.showMessageToast({
        toastTitle: 'Error',
        toastMessage: errorMessage,
        toastType: 'ERROR',
        getToastIcon: (size) => <MdError size={size} color="red" />,
      });
    } else {
      handleMemberList((prev: any) => [...prev, { ...member, isAdmin: false }]);
    }

    setFilteredUserData('');
    clearInput();
  };

  const removeMemberFromList = (member: User) => {
    const filteredMembers = memberList?.filter(
      (user: any) => user.wallets !== member.wallets
    );
    handleMemberList(filteredMembers);
  };

  return (
    <Section
      width={isMobile ? '100%' : '410px'}
      flexDirection="column"
      padding={isMobile ? '0px auto' : '0px 10px'}
    >
      <Section flex="1" flexDirection="row" justifyContent="space-between">
        <Span onClick={() => handlePrevious()}>
        <BackIcon />
        </Span>

        <Span
          textAlign="center"
          fontSize="20px"
          color={theme.modalHeadingColor}
        >
          {modalHeader}
        </Span>

        <Image
          src={CloseIcon}
          height="24px"
          maxHeight="24px"
          width={'auto'}
          onClick={() => onClose()}
          cursor="pointer"
        />
      </Section>

      <Section
        margin="50px 0 10px 0"
        flex="1"
        flexDirection="row"
        justifyContent="space-between"
      >
        <Span fontSize="18px" color={theme.modalIconColor}>
          Add Wallets
        </Span>

        <Span fontSize="14px" color={theme.modalPrimaryTextColor}>
          {groupMembers
            ? `0${memberList?.length + groupMembers?.length} / 09 Members`
            : `0${memberList?.length} / 09 Members`}
        </Span>
      </Section>

      <Section flex="1">
        {/* check the search for dark mode ----> pending */} 
      <ChatSearchInput
            handleSearch={handleSearch}
            clearInput={clearInput}
            placeholder="Search Web3 domain or 0x123..."
            customStyle={customSearchStyle}
          />
      </Section>

      {filteredUserData && (
        <MemberList>
          <MemberListContainer
            memberData={filteredUserData}
            handleMemberList={addMemberToList}
            lightIcon={<AddUserDarkIcon />}
            darkIcon={<AddUserDarkIcon />}
          />
        </MemberList>
      ) }

      <MultipleMemberList>
        {memberList?.map((member: any, index: any) => (
          <MemberListContainer
            key={index}
            memberList={memberList}
            memberData={member}
            handleMembers={handleMemberList}
            handleMemberList={removeMemberFromList}
            lightIcon={<MoreLightIcon />}
            darkIcon={<MoreDarkIcon />}
          />
        ))}
      </MultipleMemberList>

      <Section flex="1" alignSelf="center">
        {/* fix the buttom  width and fontSize font Weight ----> done */}
        <ModalConfirmButton
          onClick={() => onSubmit()}
          isLoading={isLoading}
          memberListCount={memberList?.length > 0}
          theme={theme}
        >
          {!isLoading && groupMembers ? 'Add To Group' : ''}
          {isLoading && <Spinner size="30" color="#fff" />}
        </ModalConfirmButton>
      </Section>
    </Section>
  );
};




const MemberList = styled.div`
  flex: 1;
  width: 100%;
  margin-bottom:5px;
`;

const MultipleMemberList = styled.div`
  height: fit-content;
  max-height: 216px;
  padding: 0px 2px;
  width: 100%;

  &::-webkit-scrollbar-track {
    background-color: ${(props) => props.theme.scrollBg};
  }

  &::-webkit-scrollbar {
    background-color: ${(props) => props.theme.scrollBg};
    width: 6px;
  }

  @media (max-width: 768px) {
    padding: 0px 0px 0px 0px;
    max-height: 35vh;

    &::-webkit-scrollbar-track {
      background-color: none;
      border-radius: 9px;
    }

    &::-webkit-scrollbar {
      background-color: none;
      width: 4px;
    }
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-image: -webkit-gradient(
      linear,
      left top,
      left bottom,
      color-stop(0.44, #cf1c84),
      color-stop(0.72, #cf1c84),
      color-stop(0.86, #cf1c84)
    );
  }
`;

const ModalConfirmButton = styled.button<ModalButtonProps>`
  margin: 60px 0 0 0;
  width: 197px;
  background: ${(props) =>
    props.memberListCount ? '#CF1C84' : props.theme.groupButtonBackgroundColor};
  color: ${(props) =>
    props.memberListCount ? '#fff' : props.theme.groupButtonTextColor};
  border: ${(props) =>
    props.memberListCount ? 'none' : props.theme.modalConfirmButtonBorder};
  min-width: 50%;
  box-sizing: border-box;
  cursor: pointer;
  border-radius: 15px;
  padding: 16px;
  font-size: 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: none;
  height: 48px;
`;
