import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { ThemeContext } from "../theme/ThemeProvider";
import { useChatData } from "../../../hooks";
import { displayDefaultUser, getAddress, walletToPCAIP10 } from "../../../helpers";
import { ModalButtonProps, User } from "../exportedTypes";
import * as PushAPI from '@pushprotocol/restapi';
import { ethers } from "ethers";
import { addWalletValidation } from "../helpers/helper";
import ArrowGreyIcon from '../../../icons/CaretDownGrey.svg'
import ArrowLeftIcon from '../../../icons/ArrowLeft.svg';
import CloseIcon from '../../../icons/close.svg';
import { Spinner } from "../../supportChat/spinner/Spinner";
import { ReactComponent as MoreLight } from '../../../icons/more.svg';
import { ReactComponent as MoreDark } from '../../../icons/moredark.svg';
import { ReactComponent as SearchIcon } from '../../../icons/search.svg';
import { Section, Span, Image } from "../../reusables/sharedStyling";
import { ReactComponent as AddUserLightIcon } from '../../../icons/addlight.svg';
import { ReactComponent as AddUserDarkIcon } from '../../../icons/adddark.svg';
import { device } from "../../../config";
import { MemberListContainer } from "./MemberListContainer";

export const AddWalletContent = ({ onSubmit, handlePrevious, onClose, memberList, handleMemberList, title, groupMembers, isLoading }: {onSubmit: ()=> void ,onClose: ()=> void, handlePrevious: ()=> void, memberList: any, handleMemberList: any, title: string, groupMembers: any, isLoading?: boolean }) => {
    const theme = useContext(ThemeContext);

    const [searchedUser, setSearchedUser] = useState<string>('');
    const [filteredUserData, setFilteredUserData] = useState<any>(null);
    const [isInValidAddress, setIsInvalidAddress] = useState<boolean>(false);
    const [isLoadingSearch, setIsLoadingSearch] = useState<boolean>(false);
    const { account, env } = useChatData();


    useEffect(() => {
        if (isInValidAddress) {
        //   searchFeedToast.showMessageToast({
        //     toastTitle: 'Error',
        //     toastMessage: 'Invalid Address',
        //     toastType: 'ERROR',
        //     getToastIcon: (size) => (
        //       <MdError
        //         size={size}
        //         color="red"
        //       />
        //     ),
        //   });
        alert('Invalid Address')
        }
      }, [isInValidAddress]);
    
      const onChangeSearchBox = (e: any) => {
        setSearchedUser(e.target.value);
      };

      const handleUserSearch = async (userSearchData: string): Promise<void> => {
        try{
          const caip10 = walletToPCAIP10(userSearchData);
          let filteredData: User;
    
        if (userSearchData.length) {
          filteredData = await PushAPI.user.get({ 
            account: caip10,
            env: env
          });
    
          if (filteredData !== null) {  
            setFilteredUserData(filteredData);
          }
          // User is not in the protocol. Create new user
          else {
            if (ethers.utils.isAddress(userSearchData)) {
              const displayUser = displayDefaultUser({ caip10 });
              setFilteredUserData(displayUser);
            } else {
              setIsInvalidAddress(true);
              setFilteredUserData(null);
            }
          }
        } else {
          setFilteredUserData(null);
        }
        setIsLoadingSearch(false);
        }
        catch(error){
            alert('Unsuccessful search')
        //   searchFeedToast.showMessageToast({
        //     toastTitle: 'Error',
        //     toastMessage: 'Unsuccesful search, Try again',
        //     toastType: 'ERROR',
        //     getToastIcon: (size) => (
        //       <MdError
        //         size={size}
        //         color="red"
        //       />
        //     ),
        //   });
        //   setIsLoadingSearch(false);
        }
      };

      const handleSearch = async (e: any): Promise<void> => {
        setIsLoadingSearch(true);
        setIsInvalidAddress(false);
        e.preventDefault();
        if (!ethers.utils.isAddress(searchedUser)) {
          let address: string;
          try {
            address = await getAddress(searchedUser, env) as string;
            // if (!address) {
            //   address = await library.resolveName(searchedUser);
            // }
            // this ensures address are checksummed
            address = ethers.utils.getAddress(address?.toLowerCase());
            if (address) {
              handleUserSearch(address);
            } else {
              setIsInvalidAddress(true);
              setFilteredUserData(null);
            }
          } catch (err) {
            setIsInvalidAddress(true);
            setFilteredUserData(null);
          } finally {
            setIsLoadingSearch(false);
          }
        } else {
          handleUserSearch(searchedUser);
        }
      };

    const clearInput = () => {
        setSearchedUser('');
        setFilteredUserData(null);
        setIsLoadingSearch(false);
      };

  const addMemberToList = (member: User) => {
    let errorMessage = '';

    errorMessage = addWalletValidation(member, memberList, groupMembers, account);

    if (errorMessage) {

        // searchFeedToast.showMessageToast({
        //   toastTitle: 'Error',
        //   toastMessage: `${errorMessage}`,
        //   toastType: 'ERROR',
        //   getToastIcon: (size) => (
        //     <MdError
        //       size={size}
        //       color="red"
        //     />
        //   ),
        // });
        alert(errorMessage);
      } else {
        handleMemberList((prev: any) => [...prev, { ...member, isAdmin: false }]);
      }
  
      setFilteredUserData('');
      clearInput();
    };

    const removeMemberFromList = (member: User) => {
        const filteredMembers = memberList?.filter((user: any) => user.wallets !== member.wallets);
        handleMemberList(filteredMembers);
      };
  
    return (
        <Section width='410px' flexDirection='column' padding='0px 10px'>
            <Section flex='1' flexDirection='row' justifyContent='space-between'>

                 <Image src={ArrowLeftIcon} height="24px" maxHeight="24px" width={'auto'} onClick={()=>handlePrevious()} cursor='pointer' />

                 <Span textAlign='center' fontSize='20px'>Add Wallets</Span>

                 <Image src={CloseIcon} height="24px" maxHeight="24px" width={'auto'}  onClick={()=>onClose()} cursor='pointer' />
            </Section>

            <Section margin='50px 0 10px 0' flex='1' flexDirection='row' justifyContent='space-between'>
                <Span fontSize='18px'>Add Wallets</Span>

                <Span fontSize='14px'>
                    {groupMembers
                    ? `0${memberList?.length + groupMembers?.length} / 09 Members`
                  : `0${memberList?.length} / 09 Members`}
                </Span>
            </Section>

            <Section flex='1'>
                <SearchBarContent onSubmit={handleSearch}>
                    <Input
                        type="text"
                        value={searchedUser}
                        onChange={onChangeSearchBox}
                        placeholder="Search Web3 domain or 0x123..."
                        color={theme.modalPrimaryTextColor}
                        theme={theme}
                    />
                    <Section
                        position="absolute"
                        alignItems="flex-end"
                        width="40px"
                        height="24px"
                        top="22px"
                        right="16px"
                    >
                        {searchedUser.length > 0 && (
                            <Image src={CloseIcon} height="20px" maxHeight="20px" width={'auto'}  onClick={()=>clearInput()} cursor='pointer' />
                        )}
                        {searchedUser.length == 0 && !filteredUserData && <SearchIcon style={{ cursor: 'pointer' }} />}
                    </Section>
                </SearchBarContent>
            </Section>

            {filteredUserData ? (
            <MemberList>
                <MemberListContainer
                memberData={filteredUserData}
                handleMemberList={addMemberToList}
                lightIcon={<AddUserDarkIcon />}
                darkIcon={<AddUserDarkIcon />}
                />
            </MemberList>
            ) : isLoadingSearch ? (
            <Section margin="10px 0px 34px 0px">
                <Spinner size={'35'} color='#cf1c84' />
            </Section>
            ) : null}

            <MultipleMemberList>
            {memberList?.map((member: any, index: any) => (
                <MemberListContainer
                key={index}
                memberList={memberList}
                memberData={member}
                handleMembers={handleMemberList}
                handleMemberList={removeMemberFromList}
                lightIcon={<MoreLight />}
                darkIcon={<MoreDark />}
                />
            ))}
            </MultipleMemberList>

            <Section flex='1'>
                <ModalConfirmButton
                    onClick={() => onSubmit()}
                    isLoading={isLoading}
                    // loaderTitle={groupMembers ? 'Adding Members' : 'Creating group'}
                    memberListCount={memberList?.length > 0}
                    theme={theme}
                >
                  {groupMembers ? 'Add To Group' : 'Create Group'}
                  {isLoading && <Spinner size='30' color='#fff' /> }
                </ ModalConfirmButton>
            </Section>

        </Section>
    )
}

const SearchBarContent = styled.form`
  position: relative;
  display: flex;
  flex: 1;
`;

const Input = styled.input`
  box-sizing: border-box;
  display: flex;
  flex: 1;
//   min-width: 445px;
  height: 48px;
  padding: 0px 50px 0px 16px;
  margin: 10px 0px 0px;
  border-radius: 99px;
  border: 1px solid;
  border-color: ${(props) => props.theme.modalSearchBarBorderColor};
  background: ${(props) => props.theme.modalSearchBarBackground};
  color: ${(props) => props.color || '#000'};
  &:focus {
    outline: none;
    background-image: linear-gradient(
        ${(props) => props.theme.snapFocusBg},
        ${(props) => props.theme.snapFocusBg}
      ),
      linear-gradient(
        to right,
        rgba(182, 160, 245, 1),
        rgba(244, 110, 246, 1),
        rgba(255, 222, 211, 1),
        rgba(255, 207, 197, 1)
      );
    background-origin: border;
    border: 1px solid transparent !important;
    background-clip: padding-box, border-box;
  }
  &::placeholder {
    color: #657795;
  }
  @media ${device.mobileL} {
    min-width: 300px;
  }
`;

const MemberList = styled.div`
    // justify-content: flex-start;
    // padding: 0px 2px;
    // margin: 0 0 34px 0;
    flex: 1;
    // background: red;
    width: 100%;
`;

const MultipleMemberList = styled.div`
  overflow-y: auto;
  height: fit-content;
  max-height: 216px;
  padding: 0px 2px;
  overflow-x: hidden;
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
    background: ${(props) => props.memberListCount ? '#CF1C84' : props.theme.groupButtonBackgroundColor};
    color: ${(props) => props.memberListCount ? '#fff' : props.theme.groupButtonTextColor};
    border: ${(props) => props.memberListCount ? 'none' : props.theme.modalConfirmButtonBorder};
    min-width: 50%;
    box-sizing: border-box;
    cursor: pointer;
    border-radius: 15px;
    padding: 16px;
    font-size: 1.125rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: ${(props) => props.isLoading ? 'space-between' : 'center'};
    box-shadow: none;
`;