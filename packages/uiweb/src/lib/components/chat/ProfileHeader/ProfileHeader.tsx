// @typescript-eslint/no-non-null-asserted-optional-chain

import { useContext, useEffect, useRef, useState } from "react";
import { Image, Section, Span } from "../../reusables";
import styled from "styled-components";
import TokenGatedIcon from '../../../icons/Token-Gated.svg';
import PublicChatIcon from '../../../icons/Public-Chat.svg';
import VideoChatIcon from '../../../icons/VideoCallIcon.svg';
import VerticalEllipsisIcon from '../../../icons/VerticalEllipsis.svg';
import type { IUser } from '@pushprotocol/restapi';
import { useChatData, useClickAway } from "../../../hooks";
import { ThemeContext } from "../theme/ThemeProvider";
import { IChatTheme } from "../theme";
import { shortenText } from "../../../helpers";
import useGetGroupByID from "../../../hooks/chat/useGetGroupByID";
import useChatProfile from "../../../hooks/chat/useChatProfile";
import { IGroup } from "../../../types";
import { ethers } from "ethers";

export function isValidETHAddress(address: string) {
    return ethers.utils.isAddress(address);
  }

const Options = ({ options, setOptions, isGroup, chatInfo, groupInfo, theme }:{options: boolean, setOptions: React.Dispatch<React.SetStateAction<boolean>>, isGroup: boolean, chatInfo: any, groupInfo: IGroup | null , theme: IChatTheme }) => {
    const DropdownRef = useRef(null);
   
    useClickAway(DropdownRef, () => {
        setOptions(false);
    });

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
                        <Span>Group Info</Span>
                    </DropDownBar>)}
                
                </ImageItem>
            </Section>
        )
    }  else { 
        return null }
    };



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