import { useContext, useState } from 'react';

import styled from 'styled-components';

import { ThemeContext } from '../theme/ThemeProvider';
import { useChatData } from '../../../hooks';
import { MdError } from 'react-icons/md';

import { Spinner } from '../../supportChat/spinner/Spinner';
import { MoreDarkIcon } from '../../../icons/MoreDark';
import { Section, Span, Image } from '../../reusables/sharedStyling';
import { AddUserDarkIcon } from '../../../icons/Adddark';
import { MemberListContainer } from './MemberListContainer';
import useMediaQuery from '../../../hooks/useMediaQuery';
import useToast from '../reusables/NewToast';

import {
  getNewChatUser,
} from '../../../helpers';
import { IChatTheme, ModalButtonProps, User } from '../exportedTypes';
import { addWalletValidation } from '../helpers/helper';
import { device } from '../../../config';
import CloseIcon from '../../../icons/close.svg';
import { ChatSearchInput, CustomStyleParamsType, ModalHeader } from '../reusables';
import useGetChatProfile from '../../../hooks/useGetChatProfile';
import { BackIcon } from '../../../icons/Back';


type AddWalletContentProps = {
  onSubmit: () => void;
  onClose: () => void;
  handlePrevious: () => void;
  memberList: any;
  handleMemberList: any;
  groupMembers: any;
  isLoading?: boolean;
  modalHeader: string;
  title?: string;
  submitButtonTitle?: string;
};
export const AddWalletContent = ({
  onSubmit,
  handlePrevious,
  onClose,
  memberList,
  handleMemberList,
  groupMembers,
  isLoading,
  title,
  submitButtonTitle,
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
    //fix ens search 
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
    const isMemberAlreadyAdded = memberList?.find(
      (user: any) => user.wallets.toLowerCase() === member.wallets.toLowerCase()
    );
    console.log('member', member);

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
    } else if(!isMemberAlreadyAdded) {
      handleMemberList((prev: any) => [...prev, { ...member, isAdmin: false }]);
    }

    setFilteredUserData('');
    clearInput();
  };

  const removeMemberFromList = (member: User) => {
    const filteredMembers = memberList?.filter(
      (user: any) => user.wallets.toLowerCase() !== member.wallets.toLowerCase()
    );
    handleMemberList(filteredMembers);
  };

  return (
    <Section
      margin="auto"
      width={isMobile ? '100%' : '410px'}
      flexDirection="column"
      padding={isMobile ? '0px auto' : '0px 10px'}
    >
      <ModalHeader title={title ? title : 'Add More Wallets'} handleClose={onClose} handlePrevious={handlePrevious} />

      <Section
        margin="50px 0 10px 0"
        flex="1"
        flexDirection="row"
        justifyContent="space-between"
      >
        <Span fontSize="18px" color={theme.textColor?.modalSubHeadingText}>
          Add Wallets
        </Span>

        <Span fontSize="14px" color={theme.textColor?.modalSubHeadingText}>
          {groupMembers
            ? `0${memberList?.length + groupMembers?.length} / 5000 Members`
            : `0${memberList?.length} / 5000 Members`}
        </Span>
      </Section>

      <Section flex="1">
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
            darkIcon={<AddUserDarkIcon />}
          />
        </MemberList>
      ) }

      <MultipleMemberList>
        {memberList && memberList?.map((member: any, index: any) => (
          <MemberListContainer
            key={index}
            memberList={memberList}
            memberData={member}
            handleMembers={handleMemberList}
            handleMemberList={removeMemberFromList}
            darkIcon={<MoreDarkIcon />}
          />
        ))}
      </MultipleMemberList>

      <Section flex="1" alignSelf="center">
        <ModalConfirmButton
          onClick={() => {
            // console.log(groupMembers);
            onSubmit()
          }}
          isLoading={isLoading}
          memberListCount={memberList?.length > 0}
          theme={theme}
        >
          {!isLoading && groupMembers ? (submitButtonTitle ? submitButtonTitle : 'Add To Group'): ''}
          {isLoading && <Spinner size="30" color="#fff" />}
        </ModalConfirmButton>
      </Section>
    </Section>
  );
};




const MemberList = styled.div`
  flex: 1;
  width: 100%;
  margin-bottom:40px;
`;

const MultipleMemberList = styled.div`
  height: fit-content;
  max-height: 216px;
  padding: 0px 2px;
  width: 100%;

  &::-webkit-scrollbar-track {
    background-color: ${(props) => props.theme.scrollbarColor};
  }

  &::-webkit-scrollbar {
    background-color: ${(props) => props.theme.scrollbarColor};
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

const ModalConfirmButton = styled.button<ModalButtonProps & { theme: IChatTheme } >`
  margin: 60px 0 0 0;
  width: 197px;
  background: ${(props) =>
    props.memberListCount ? props.theme.backgroundColor!.buttonBackground : props.theme.backgroundColor!.buttonDisableBackground};
  color: ${(props) =>
    props.memberListCount ? props.theme.textColor!.buttonText : props.theme.textColor!.buttonDisableText};
  border: ${(props) =>
    props.memberListCount ? 'none' : props.theme.border!.modal};
  min-width: 50%;
  box-sizing: border-box;
  cursor: pointer;
  border-radius: 12px;
  padding: 16px;
  font-size: 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: none;
  height: 48px;
`;
