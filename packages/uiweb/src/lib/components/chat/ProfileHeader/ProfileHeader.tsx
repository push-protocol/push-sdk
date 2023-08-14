// @typescript-eslint/no-non-null-asserted-optional-chain

import { useContext, useEffect, useRef, useState } from "react";
import { Image, Section, Span } from "../../reusables";
import styled from "styled-components";
import TokenGatedIcon from '../../../icons/Token-Gated.svg';
import PublicChatIcon from '../../../icons/Public-Chat.svg';
import VideoChatIcon from '../../../icons/VideoCallIcon.svg';
import VerticalEllipsisIcon from '../../../icons/VerticalEllipsis.svg';
import LockIcon from '../../../icons/Lock.png'
import LockSlashIcon from '../../../icons/LockSlash.png'
import type { IUser } from '@pushprotocol/restapi';
import { useChatData, useClickAway } from "../../../hooks";
import { ThemeContext } from "../theme/ThemeProvider";
import { IChatTheme } from "../theme";
import { shortenText } from "../../../helpers";
import useGetGroupByID from "../../../hooks/chat/useGetGroupByID";
import useChatProfile from "../../../hooks/chat/useChatProfile";
import { IGroup } from "../../../types";
import { ethers } from "ethers";
import { Modal } from '../../space/reusables/Modal'

export function isValidETHAddress(address: string) {
    return ethers.utils.isAddress(address);
  }

const Options = ({ options, setOptions, isGroup, chatInfo, groupInfo, theme }:{options: boolean, setOptions: React.Dispatch<React.SetStateAction<boolean>>, isGroup: boolean, chatInfo: any, groupInfo: IGroup | null , theme: IChatTheme }) => {
    const DropdownRef = useRef(null);
    const [modal, setModal] = useState(false);
   
    useClickAway(DropdownRef, () => {
        setOptions(false);
    });

    const ShowModal = () => {
        setModal(true);
    }

    if(isGroup){
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
                
                    {modal && (<GroupInfoModal theme={theme} modal={modal} setModal={setModal} groupInfo={groupInfo ?? null} />)}
                </ImageItem>
            </Section>
        )
    }  else { 
        return null }
    };

    const GroupInfoModal = ({theme, modal, setModal, groupInfo}: {theme: IChatTheme, modal: boolean, setModal: React.Dispatch<React.SetStateAction<boolean>>, groupInfo: IGroup | null }) => {
        
        const onClose = () => {
            setModal(false);
        }
        return(
        <Modal clickawayClose={onClose}>
         <Section width='410px' flexDirection='column' padding='0px 10px'>
            <Span textAlign='center' fontSize='20px'>Group Info</Span>

            <GroupHeader>
                <Image src={groupInfo?.groupImage ?? ''} height="64px" maxHeight="64px" width={'auto'} borderRadius="16px" />

                <Section flexDirection='column' alignItems='flex-start' gap='7px'>
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

                <Section flexDirection='column' alignItems='flex-start' gap='7px'>
                    <Span fontSize='18px'>Public</Span>
                    <Span fontSize='12px'>Chats are not encrypted</Span>
                </Section>
            </PublicEncrypted>


        <Section margin='15px 20px' flexDirection='column' flex='1'>
            {groupInfo?.members && groupInfo?.members?.length > 0 && groupInfo?.members.map((item) => (
                 <GroupMembers>
                        <Image src={item?.image} height="48px" maxHeight="48px" width={'auto'} borderRadius='100%' />

                        <Span margin='0 0 0 10px'>
                             {shortenText(item?.wallet?.split(':')[1] ?? '', 6, true)}
                        </Span>

                        {item.isAdmin && (
                            <AdminItem>Admin</AdminItem>
                        )}
                 </GroupMembers>
            ))}
        </Section>
        
            </Section>
        </Modal>)
    }



export const ProfileHeader = ({ chatId }: {chatId: any}) => {
    const theme = useContext(ThemeContext);
    const { account, env } = useChatData();
    const { getGroupByID } = useGetGroupByID();
    const { fetchUserChatProfile } = useChatProfile();

    const [isGroup, setIsGroup] = useState<boolean>(false);
    const [options, setOptions] = useState(false); 
    const [chatInfo, setChatInfo ] = useState<IUser | null>()
    const [groupInfo, setGroupInfo ] = useState<IGroup | null>()

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

 
    if (chatId) {
        return (
            <Container theme={theme}>
                {chatInfo || groupInfo ? (
                    <Image src={isGroup ? groupInfo?.groupImage ?? '' : chatInfo?.profile?.picture ?? ''} height="48px" maxHeight="48px" width={'auto'} borderRadius="100%" />
                ) : <DummyImage />}
                

                <Span color="#fff" fontSize="17px" margin="0 0 0 10px">{isGroup ? groupInfo?.groupName : shortenText(chatInfo?.did?.split(':')[1] ?? '', 6, true)}</Span>

                <Options options={options} setOptions={setOptions} isGroup={isGroup} chatInfo={chatInfo} groupInfo={groupInfo ?? null} theme={theme} />

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
    margin-top: 34px;
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

const AdminItem = styled.div`
    background: rgb(244, 220, 234);
    color: rgb(213, 58, 148);
    margin-left: auto;
    font-size: 10px;
    padding: 6px;
    border-radius: 8px;
`;