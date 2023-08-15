// @typescript-eslint/no-non-null-asserted-optional-chain

import { useContext, useEffect, useRef, useState } from "react";
import { Image, Section, Span } from "../../reusables";
import styled from "styled-components";
import TokenGatedIcon from '../../../icons/Token-Gated.svg';
import PublicChatIcon from '../../../icons/Public-Chat.svg';
import VideoChatIcon from '../../../icons/VideoCallIcon.svg';
import addIcon from '../../../icons/addicon.svg';
import VerticalEllipsisIcon from '../../../icons/VerticalEllipsis.svg';
import LockIcon from '../../../icons/Lock.png'
import LockSlashIcon from '../../../icons/LockSlash.png'
import ArrowIcon from '../../../icons/CaretDown.svg'
import ArrowGreyIcon from '../../../icons/CaretDownGrey.svg'
import ArrowLeftIcon from '../../../icons/ArrowLeft.svg';
import CloseIcon from '../../../icons/close.svg';
import { ReactComponent as SearchIcon } from '../../../icons/search.svg';
import { ReactComponent as AddUserLightIcon } from '../../../icons/addlight.svg';
import { ReactComponent as AddUserDarkIcon } from '../../../icons/adddark.svg';
import { ReactComponent as MoreLight } from '../../../icons/more.svg';
import { ReactComponent as MoreDark } from '../../../icons/moredark.svg';
import DismissAdmin from '../../../icons/dismissadmin.svg';
import AddAdmin from '../../../icons/addadmin.svg';
import Remove from '../../../icons/remove.svg';
import type { IUser } from '@pushprotocol/restapi';
import { useChatData, useClickAway, useDeviceWidthCheck } from "../../../hooks";
import { ThemeContext } from "../theme/ThemeProvider";
import { IChatTheme } from "../theme";
import { shortenText } from "../../../helpers";
import useGetGroupByID from "../../../hooks/chat/useGetGroupByID";
import useChatProfile from "../../../hooks/chat/useChatProfile";
import { IGroup } from "../../../types";
import { ethers } from "ethers";
import { Modal } from '../../space/reusables/Modal'
import { pCAIP10ToWallet, walletToPCAIP10, getAddress } from '../../../helpers';
import { device } from "../../../config";
import { DropdownValueType} from './DropDown'
import Dropdown from './DropDown'
import { ProfileCard } from './ProfileCard'
import * as PushAPI from '@pushprotocol/restapi';
import { Spinner } from '../../supportChat/spinner/Spinner';
import {UpdateGroupType, MemberListContainerType, WalletProfileContainerProps, MessageIPFS, Feeds, User, ShadowedProps, ModalButtonProps} from '../exportedTypes';



const getAdminList = (groupInformation: IGroup): Array<string> => {
    const adminsFromMembers = convertToWalletAddressList(groupInformation?.members.filter((admin) => admin.isAdmin == true));
      const adminsFromPendingMembers = convertToWalletAddressList(groupInformation?.pendingMembers.filter((admin) => admin.isAdmin == true));
      const adminList = [...adminsFromMembers,...adminsFromPendingMembers];
      return adminList
  };

const convertToWalletAddressList = (
    memberList: { wallet: string }[]
  ): string[] => {
    return memberList ? memberList.map((member) => member.wallet) : [];
  }

const getUpdatedMemberList = (groupInfo: IGroup ,walletAddress:string): Array<string> =>{
    const members = groupInfo?.members?.filter((i) => i.wallet?.toLowerCase() !== walletAddress?.toLowerCase());
    return convertToWalletAddressList([...members,...groupInfo.pendingMembers]);
}

export const getUpdatedAdminList = (groupInfo: IGroup, walletAddress: string | null, toRemove: boolean): Array<string> => {
    const groupAdminList: any = getAdminList(groupInfo);
    if (!toRemove) {
      return [...groupAdminList, walletAddress];
    } else {
      const newAdminList = groupAdminList.filter((wallet: any) => wallet !== walletAddress);
      return newAdminList;
    }
  };

export const profilePicture = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAvklEQVR4AcXBsW2FMBiF0Y8r3GQb6jeBxRauYRpo4yGQkMd4A7kg7Z/GUfSKe8703fKDkTATZsJsrr0RlZSJ9r4RLayMvLmJjnQS1d6IhJkwE2bT13U/DBzp5BN73xgRZsJMmM1HOolqb/yWiWpvjJSUiRZWopIykTATZsJs5g+1N6KSMiO1N/5DmAkzYTa9Lh6MhJkwE2ZzSZlo7xvRwson3txERzqJhJkwE2bT6+JhoKTMJ2pvjAgzYSbMfgDlXixqjH6gRgAAAABJRU5ErkJggg==`;


const displayDefaultUser = ({ caip10 }: { caip10: string }): User => {
    const userCreated: User = {
      did: caip10,
      wallets: caip10,
      publicKey: 'temp',
      profilePicture: profilePicture,
      encryptedPrivateKey: 'temp',
      encryptionType: 'temp',
      signature: 'temp',
      sigType: 'temp',
      about: null,
      name: null,
      numMsg: 1,
      allowedNumMsg: 100,
      linkedListHash: null,
    };
    return userCreated;
  };

const findObject = (data: any,parentArray: any[],property: string ): boolean => {
    let isPresent = false;
    if(data) {
    parentArray.map((value) => {
      if (value[property] == data[property]) {
        isPresent = true;
      }
    });
    }
    return isPresent;
  }

const MemberAlreadyPresent = (member: any, groupMembers: any )=>{
    const memberCheck = groupMembers?.find((x: any)=>x.wallet?.toLowerCase() == member.wallets?.toLowerCase());
    if(memberCheck){
      return true;
    }
    return false;
  }

const addWalletValidation = (member:User,memberList:any,groupMembers:any,account: any) =>{
    const checkIfMemberisAlreadyPresent = MemberAlreadyPresent(member, groupMembers);
  
    let errorMessage = '';
  
      if (checkIfMemberisAlreadyPresent) {
        errorMessage = "This Member is Already present in the group"
      }
  
      if (memberList?.length + groupMembers?.length >= 9) {
        errorMessage = 'No More Addresses can be added'
      }
  
      if (memberList?.length >= 9) {
        errorMessage = 'No More Addresses can be added'
      }
  
      if (findObject(member, memberList, 'wallets')) {
        errorMessage = 'Address is already added'
      }
  
      if (member?.wallets?.toLowerCase() === walletToPCAIP10(account)?.toLowerCase()) {
        errorMessage = 'Group Creator cannot be added as Member'
      }
  
      return errorMessage;
  }

export function isValidETHAddress(address: string) {
    return ethers.utils.isAddress(address);
  }

const Options = ({ options, setOptions, isGroup, chatInfo, groupInfo, theme }:{options: boolean, setOptions: React.Dispatch<React.SetStateAction<boolean>>, isGroup: boolean, chatInfo: any, groupInfo?: IGroup | null , theme: IChatTheme }) => {
    const DropdownRef = useRef(null);
    const [modal, setModal] = useState(false);
   
    useClickAway(DropdownRef, () => {
        setOptions(false);
    });

    const ShowModal = () => {
        setModal(true);
    }

    if (groupInfo && isGroup){
        return (
            <Section flexDirection="row" gap="10px" margin="0 20px 0 auto">
                <Image src={TokenGatedIcon} height="28px" maxHeight="32px" width={'auto'} />

                {groupInfo?.isPublic && 
                (<Image src={PublicChatIcon} height="28px" maxHeight="32px" width={'auto'} />)}

                <ImageItem onClick={() => setOptions(true)}>
                    <Image src={VerticalEllipsisIcon} height="21px" maxHeight="32px" width={'auto'} cursor="pointer"  />
                
                {options && 
                    (<DropDownBar theme={theme} ref={DropdownRef}>
                        <Span cursor='pointer' onClick={ShowModal}>Group Info</Span>
                    </DropDownBar>)}
                
                    {modal && (<GroupInfoModal theme={theme} modal={modal} setModal={setModal} groupInfo={groupInfo} />)}
                </ImageItem>
            </Section>
        )
    }  else { 
        return null }
    };

    const GroupInfoModal = ({theme, modal, setModal, groupInfo}: {theme: IChatTheme, modal: boolean, setModal: React.Dispatch<React.SetStateAction<boolean>>, groupInfo: IGroup }) => {
        const { account, env, pgpPrivateKey } = useChatData();
        const [showAddMoreWalletModal, setShowAddMoreWalletModal] = useState<boolean>(false);
        const [showPendingRequests, setShowPendingRequests] = useState<boolean>(false);
        const [memberList, setMemberList] = useState<any>([]);
        const [isLoading, setIsLoading] = useState<boolean>(false);
        const [selectedMemberAddress, setSelectedMemberAddress] = useState<string | null>(null);

        const handleClose = () => onClose();
        const dropdownRef = useRef<any>(null);
         useClickAway(dropdownRef, () => setSelectedMemberAddress(null));


        const groupCreator = groupInfo?.groupCreator;
        const membersExceptGroupCreator = groupInfo?.members?.filter((x) => x.wallet?.toLowerCase() !== groupCreator?.toLowerCase());
        const groupMembers = [...membersExceptGroupCreator, ...groupInfo.pendingMembers];


        const updateGroup = async(options:UpdateGroupType) => {
            const { groupInfo, connectedUser,adminList,memberList } = options;
            const updateResponse = await PushAPI.chat.updateGroup({
                chatId: groupInfo?.chatId,
                groupName: groupInfo?.groupName,
                groupDescription: groupInfo?.groupDescription ?? '',
                groupImage: groupInfo?.groupImage,
                members: memberList,
                admins: adminList,
                account: connectedUser?.wallets,
                pgpPrivateKey: pgpPrivateKey,
                env: env,
            });
            let updatedCurrentChat = null;
            if(typeof updateResponse !== 'string')
            {
                updatedCurrentChat = groupInfo;
                updatedCurrentChat = updateResponse;
            }
                return {updateResponse,updatedCurrentChat};
        }

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
            
        
            try {
              setIsLoading(true);
              const connectedUser = await PushAPI.user.get({ account: account as string, env });
              const { updateResponse, updatedCurrentChat } = await updateGroup({
                groupInfo,
                connectedUser,
                adminList,
                memberList: members,
              });
        
                if (typeof updateResponse !== 'string') {
                setSelectedMemberAddress(null);
                // if (updatedCurrentChat) setChat(updatedCurrentChat);
              } else {
                // groupInfoToast.showMessageToast({
                //   toastTitle: 'Error',
                //   toastMessage: updateResponse,
                //   toastType: 'ERROR',
                //   getToastIcon: (size) => (
                //     <MdError
                //       size={size}
                //       color="red"
                //     />
                //   ),
                // });
                alert(updateResponse);
                setSelectedMemberAddress(null);
              }
              setIsLoading(false);
            //   groupInfoToast.showMessageToast({
            //     toastTitle: 'Success',
            //     toastMessage: 'Group Invitation sent',
            //     toastType: 'SUCCESS',
            //     getToastIcon: (size) => (
            //       <MdCheckCircle
            //         size={size}
            //         color="green"
            //       />
            //     ),
            //   });
            alert('Group Invitation sent')
              handleClose();
            } catch (error) {
              setIsLoading(false);
              console.log('Error', error);
              alert(error);
            //   groupInfoToast.showMessageToast({
            //     toastTitle: 'Error',
            //     toastMessage: error.message,
            //     toastType: 'ERROR',
            //     getToastIcon: (size) => (
            //       <MdError
            //         size={size}
            //         color="red"
            //       />
            //     ),
            //   });
            }
          };
        
     
        const makeGroupAdmin = async () => {
            const groupMemberList = convertToWalletAddressList([
              ...groupInfo.members,
              ...groupInfo.pendingMembers,
            ]);
            const newAdminList = getUpdatedAdminList(groupInfo, selectedMemberAddress, false);
            try {
              const connectedUser = await PushAPI.user.get({ account: account as string, env });
              const { updateResponse, updatedCurrentChat } = await updateGroup({
                groupInfo,
                connectedUser,
                adminList: newAdminList,
                memberList: groupMemberList,
              });
              if (typeof updateResponse !== 'string') {
                setSelectedMemberAddress(null);
                // if (updatedCurrentChat) setChat(updatedCurrentChat);
              } else {
                // groupInfoToast.showMessageToast({
                //   toastTitle: 'Error',
                //   toastMessage: updateResponse,
                //   toastType: 'ERROR',
                //   getToastIcon: (size) => (
                //     <MdError
                //       size={size}
                //       color="red"
                //     />
                //   ),
                // });
                alert(updateResponse);
                setSelectedMemberAddress(null);
              }
            } catch (e) {
              console.error('Error while adding admin', e);
            //   groupInfoToast.showMessageToast({
            //     toastTitle: 'Error',
            //     toastMessage: e.message,
            //     toastType: 'ERROR',
            //     getToastIcon: (size) => (
            //       <MdError
            //         size={size}
            //         color="red"
            //       />
            //     ),
            //   });
             alert(e);
            }
            setSelectedMemberAddress(null);
          };
        
          const dismissGroupAdmin = async () => {
            const groupMemberList = convertToWalletAddressList([
              ...groupInfo.members,
              ...groupInfo.pendingMembers,
            ]);
            const newAdminList = getUpdatedAdminList(groupInfo, selectedMemberAddress, true);
            try {
              const connectedUser = await PushAPI.user.get({ account: account as string, env });
              const { updateResponse, updatedCurrentChat } = await updateGroup({
                groupInfo,
                connectedUser,
                adminList: newAdminList,
                memberList: groupMemberList,
              });
              if (typeof updateResponse !== 'string') {
                setSelectedMemberAddress(null);
                // if (updatedCurrentChat) setChat(updatedCurrentChat);
              } else {
                // groupInfoToast.showMessageToast({
                //   toastTitle: 'Error',
                //   toastMessage: updateResponse,
                //   toastType: 'ERROR',
                //   getToastIcon: (size) => (
                //     <MdError
                //       size={size}
                //       color="red"
                //     />
                //   ),
                // });
                alert(updateResponse);
                setSelectedMemberAddress(null);
              }
            } catch (e) {
              console.error('Error while dismissing admin', e);
            //   groupInfoToast.showMessageToast({
            //     toastTitle: 'Error',
            //     toastMessage: e.message,
            //     toastType: 'ERROR',
            //     getToastIcon: (size) => (
            //       <MdError
            //         size={size}
            //         color="red"
            //       />
            //     ),
            //   });
            alert(e);
            }
            setSelectedMemberAddress(null);
          };
        
          const removeMember = async () => {
            const updatedMemberList = getUpdatedMemberList(groupInfo, selectedMemberAddress!);
            const adminList = getUpdatedAdminList(groupInfo, selectedMemberAddress, true);
            try {
              const connectedUser = await PushAPI.user.get({ account: account as string, env });
              const { updateResponse, updatedCurrentChat } = await updateGroup({
                groupInfo,
                connectedUser,
                adminList,
                memberList: updatedMemberList,
              });
        
              if (typeof updateResponse !== 'string') {
                setSelectedMemberAddress(null);
                // if (updatedCurrentChat) setChat(updatedCurrentChat);
              } else {
                // groupInfoToast.showMessageToast({
                //   toastTitle: 'Error',
                //   toastMessage: updateResponse,
                //   toastType: 'ERROR',
                //   getToastIcon: (size) => (
                //     <MdError
                //       size={size}
                //       color="red"
                //     />
                //   ),
                // });
                alert(updateResponse);
                setSelectedMemberAddress(null);
              }
            } catch (error) {
              console.error('Error in removing member', error);
              alert(error);
            //   groupInfoToast.showMessageToast({
            //     toastTitle: 'Error',
            //     toastMessage: error.message,
            //     toastType: 'ERROR',
            //     getToastIcon: (size) => (
            //       <MdError
            //         size={size}
            //         color="red"
            //       />
            //     ),
            //   });
            }
            setSelectedMemberAddress(null);
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
            function: () => dismissGroupAdmin(),
          };
          const addAdminDropdown: DropdownValueType = {
            id: 'dismiss_admin',
            title: 'Make group admin',
            icon: AddAdmin,
            function: () => makeGroupAdmin(),
          };
          const removeMemberDropdown: DropdownValueType = {
            id: 'remove_member',
            title: 'Remove',
            icon: Remove,
            function: () => removeMember(),
            textColor: '#ED5858',
          };


        
        const isAccountOwnerAdmin = groupInfo?.members?.some(
            (member) => pCAIP10ToWallet(member?.wallet)?.toLowerCase() === account?.toLowerCase() && member?.isAdmin
          );

        const handlePrevious = () => {
            setShowAddMoreWalletModal(false);
        };

        const handleCloseAddWalletModal = () => {
            setShowAddMoreWalletModal(false);
          };
        
        const onClose = () => {
            setModal(false);
        }
        if(groupInfo){
        return(
        <Modal clickawayClose={onClose}>
         {!showAddMoreWalletModal && (<Section width='410px' flexDirection='column' padding='0px 10px'>
            <Section flex='1' flexDirection='row' justifyContent='space-between'>

            <div></div>

            <Span textAlign='center' fontSize='20px'>Group Info</Span>

            <Image src={CloseIcon} height="24px" maxHeight="24px" width={'auto'}  onClick={()=>onClose()} cursor='pointer' />
            </Section>

            <GroupHeader>
                <Image src={groupInfo?.groupImage ?? ''} height="64px" maxHeight="64px" width={'auto'} borderRadius="16px" />

                <Section flexDirection='column' alignItems='flex-start' gap='5px'>
                    <Span fontSize='20px'>{groupInfo?.groupName}</Span>
                    <Span fontSize='16px'>{groupInfo?.members?.length} Members</Span>
                </Section>
            </GroupHeader>

            <GroupDescription>
                <Span fontSize='18px'>Group Description</Span>
                <Span fontSize='18px'>{groupInfo?.groupDescription}</Span>
            </GroupDescription>

            <PublicEncrypted theme={theme}>
                <Image src={groupInfo?.isPublic ? LockIcon : LockSlashIcon} height="24px" maxHeight="24px" width={'auto'} />

                <Section flexDirection='column' alignItems='flex-start' gap='5px'>
                    <Span fontSize='18px'>{groupInfo?.isPublic ? 'Public' : 'Private'}</Span>
                    <Span fontSize='12px'>{groupInfo?.isPublic ? 'Chats are not encrypted' : 'Chats are encrypted'}</Span>
                </Section>
            </PublicEncrypted>

            {isAccountOwnerAdmin && groupInfo?.members && groupInfo?.members?.length < 10 && (
            <AddWalletContainer theme={theme}
            onClick={() => setShowAddMoreWalletModal(true)}
            >
                  <Image src={addIcon} height="18px" maxHeight="18px" width={'auto'} />

                  <Span
                    color={theme.textColorSecondary}
                    margin="0px 14px"
                    fontSize="16px"
                    fontWeight="400"
                  >
                    Add more wallets
                  </Span>
            </AddWalletContainer>)}

        <Section>
            {groupInfo?.pendingMembers?.length > 0 && (
                <PendingMembers
                  groupInfo={groupInfo}
                  setShowPendingRequests={setShowPendingRequests}
                  showPendingRequests={showPendingRequests}
                  theme={theme}
                />
              )}
        </Section>

        <Section margin='15px 10px' flexDirection='column' flex='1'>
            {groupInfo?.members && groupInfo?.members?.length > 0 && groupInfo?.members.map((item, index) => (
                //  <GroupMembers theme={theme}>
                //         <Image src={item?.image} height="48px" maxHeight="48px" width={'auto'} borderRadius='100%' />

                //         <Span margin='0 0 0 10px'>
                //              {shortenText(item?.wallet?.split(':')[1] ?? '', 6, true)}
                //         </Span>

                //         {item.isAdmin && (
                //             <AdminItem>Admin</AdminItem>
                //         )}
                //  </GroupMembers>
                <ProfileCard
                        key={index}
                        member={item}
                        dropdownValues={
                          item?.isAdmin && isAccountOwnerAdmin
                            ? [removeAdminDropdown, removeMemberDropdown]
                            : isAccountOwnerAdmin
                            ? [addAdminDropdown, removeMemberDropdown]
                            : []
                        }
                        selectedMemberAddress={selectedMemberAddress}
                        setSelectedMemberAddress={setSelectedMemberAddress}
                        dropdownRef={dropdownRef}
                      />
            ))}
        </Section>
        
     </Section>)} 

     {showAddMoreWalletModal && (
        <AddWalletContent 
            onSubmit={addMembers}
            handlePrevious={handlePrevious}
            onClose={onClose}
            memberList={memberList}
            handleMemberList={setMemberList}
            // handleClose={handleCloseAddWalletModal}
            title={'Add More Wallets'}
            groupMembers={groupMembers}
            isLoading={isLoading}
        />
     )}
        </Modal>)
    } else { return null }

}

const AddWalletContent = ({ onSubmit, handlePrevious, onClose, memberList, handleMemberList, title, groupMembers, isLoading }: {onSubmit: ()=> void ,onClose: ()=> void, handlePrevious: ()=> void, memberList: any, handleMemberList: any, title: string, groupMembers: any, isLoading?: boolean }) => {
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

const MemberListContainer = ({ key, memberData, handleMembers, handleMemberList, lightIcon, darkIcon, memberList }: MemberListContainerType) => {
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
    console.log("height", containerHeight);
    setDropdownHeight(containerHeight?.top);
    console.log("height", dropdownHeight);
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



    const PendingMembers = ({ groupInfo , setShowPendingRequests, showPendingRequests, theme }: {groupInfo?: IGroup | null, setShowPendingRequests: React.Dispatch<React.SetStateAction<boolean>>, showPendingRequests: boolean, theme: IChatTheme }) => {
        if(groupInfo){
        return (
            <PendingRequestWrapper
            theme={theme}
            >
            <PendingSection onClick={() => setShowPendingRequests(!showPendingRequests)}>
                <Span fontSize='18px'>Pending Requests</Span>
                <Badge>{groupInfo?.pendingMembers?.length}</Badge>

                    <ArrowImage src={ArrowIcon} height="20px" maxHeight="20px" width={'auto'} setPosition={showPendingRequests} borderRadius='100%' />
                    {/* <ArrowImage src={theme === 'light' ? ArrowGreyIcon : ArrowIcon} height="20px" maxHeight="20px" width={'auto'} setPosition={showPendingRequests} borderRadius='100%' /> */}
            </PendingSection>

        {showPendingRequests && (
            <Section margin='0px 15px 15px 15px' flexDirection='column' flex='1'>
            {groupInfo?.pendingMembers && groupInfo?.pendingMembers?.length > 0 && groupInfo?.pendingMembers.map((item) => (
                 <GroupPendingMembers>
                        <Image src={item?.image} height="36px" maxHeight="36px" width={'auto'} borderRadius='100%' />

                        <Span margin='0 0 0 10px'>
                             {shortenText(item?.wallet?.split(':')[1] ?? '', 6, true)}
                        </Span>

                 </GroupPendingMembers>
            ))}
        </Section>
        )}
        </PendingRequestWrapper>
        )
    } else {return null }
}


export const ProfileHeader = ({ chatId }: {chatId: any}) => {
    const theme = useContext(ThemeContext);
    const { account, env } = useChatData();
    const { getGroupByID } = useGetGroupByID();
    const { fetchUserChatProfile } = useChatProfile();

    const [isGroup, setIsGroup] = useState<boolean>(false);
    const [options, setOptions] = useState(false); 
    const [chatInfo, setChatInfo ] = useState<IUser | null>();
    const [groupInfo, setGroupInfo ] = useState<IGroup | null>();
    const isMobile = useDeviceWidthCheck(425);


    const fetchProfileData = async () => {
        if(isValidETHAddress(chatId)){
            const ChatProfile = await fetchUserChatProfile({ profileId: chatId });
            setChatInfo(ChatProfile);
            setGroupInfo(null);
            setIsGroup(false);
        } else {
            const GroupProfile = await getGroupByID({ groupId : chatId})
            setGroupInfo(GroupProfile);
            setChatInfo(null);
            setIsGroup(true);
        }
    }


    useEffect(()=> {
        if(!chatId) return;
        fetchProfileData();
    },[chatId])

    console.log(groupInfo);

 
    if (chatId && (chatInfo || groupInfo)) {
        return (
            <Container theme={theme}>
                {chatInfo || groupInfo ? (
                    <Image src={isGroup ? groupInfo?.groupImage ?? '' : chatInfo?.profile?.picture ?? ''} height="48px" maxHeight="48px" width={'auto'} borderRadius="100%" />
                ) : <DummyImage />}
                

                <Span color="#fff" fontSize="17px" margin="0 0 0 10px">{isGroup ? groupInfo?.groupName : shortenText(chatInfo?.did?.split(':')[1] ?? '', 6, true)}</Span>

                <Options options={options} setOptions={setOptions} isGroup={isGroup} chatInfo={chatInfo} groupInfo={groupInfo} theme={theme} />

                {!isGroup && 
                    <VideoChatSection>
                        <Image src={VideoChatIcon} height="18px" maxHeight="18px" width={'auto'} />
                    </VideoChatSection>
                    }

            </Container>
        )
    } else {
        return null;
    }
}


const Container = styled.div`
  width: 100%;
  background: ${(props) => props.theme.bgColorPrimary};
  border-radius: 32px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 6px;
  box-sizing: border-box;
  position: relative;
`;

const ImageItem = styled.div`
  position: relative;
`;

const DummyImage = styled.div`
    height: 48px;
    width: 48px;
    border-radius: 100%;
    background: #ccc;
`;

const DropDownBar = styled.div`
    position: absolute;
    top: 30px;
    left: -110px;
    display: block;
    min-width: 100px;
    color: rgb(101, 119, 149);
    border: 1px solid rgb(74, 79, 103);
    border: ${(props) => props.theme.dropdownBorderColor};
    background: ${(props) => props.theme.bgColorPrimary};
    padding: 12px 16px;
    z-index: 10;
    border-radius: 4px;
`;

const VideoChatSection = styled.div`
    margin: 0 25px 0 auto; 
`;

const GroupHeader = styled.div`
    margin-top: 34px;
    display: flex;
    flex-direction: row;
    width: 100%;
    gap: 19px;   
`;

const GroupDescription = styled.div`
    margin-top: 34px;
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
    gap: 19px;  
    align-items: center;
    border: ${(props) => props.theme.dropdownBorderColor};
    border-radius: 16px;
    padding: 16px;
    box-sizing: border-box;
`;

const GroupMembers = styled.div`
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    width: 100%;
    align-items: center;
`;

const GroupPendingMembers = styled.div`
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    width: 100%;
    align-items: center;
`;

const AdminItem = styled.div`
    background: rgb(244, 220, 234);
    color: rgb(213, 58, 148);
    margin-left: auto;
    font-size: 10px;
    padding: 6px;
    border-radius: 8px;
`;

const AddWalletContainer = styled.div`
    margin-top: 20px;
    border: ${(props) => props.theme.dropdownBorderColor};
    border-radius: 16px;
    width: 100%;
    padding: 20px 16px;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: center;
    cursor: pointer;
    align-items: center;
`;

const PendingRequestWrapper = styled.div`
    width: 100%;
    margin-top: 20px;
    border: ${(props) => props.theme.dropdownBorderColor};
    border-radius: 16px;
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
    transform: ${(props) => props?.setPosition ? 'rotate(0)' : 'rotate(180deg)'};
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

// const Dropdown = styled.div<{ dropdownValues?: any}>`
//   position: absolute;
//   top: 48px;
//   right: 5px;

//   display: flex;
//   flex-direction: column;

//   justify-content: center;
//   align-items: start;

//   padding: 12px 6px;

// //   animation: ${({ isDDOpen }) => (isDDOpen ? fadeIn : fadeOut)} 0.2s ease-in-out;
//   background: ${(props) => props.theme.bgColorPrimary};
//   color: ${(props) => props.theme.textColorPrimary};
//   border-radius: 16px;

//   border: 1px solid ${(props) => props.theme.borderColor};

//   &. hover {
//     background: ${(props) => props.theme.snapFocusBg}
//   }
// `;