import { useContext, useEffect, useRef, useState } from "react";
import { Image, Section, Span } from "../../reusables";
import styled from "styled-components";
import BRBIcon from '../../../icons/BRBIcon.svg';
import TokenGatedIcon from '../../../icons/Token-Gated.svg';
import PublicChatIcon from '../../../icons/Public-Chat.svg';
import VerticalEllipsisIcon from '../../../icons/VerticalEllipsis.svg';
import * as PUSHAPI from "@pushprotocol/restapi"
import { useClickAway } from "../../../hooks";
import { ThemeContext } from "../theme/ThemeProvider";
import { IChatTheme } from "../theme";
import { shortenText } from "../../../helpers";

const Options = ({ options, setOptions, isGroup, chatInfo, theme }:{options: boolean, setOptions: React.Dispatch<React.SetStateAction<boolean>>, isGroup: boolean, chatInfo: any, theme: IChatTheme }) => {
    const DropdownRef = useRef(null);
   
    useClickAway(DropdownRef, () => {
        setOptions(false);
    });

    return (
        <Section flexDirection="row" gap="10px" margin="0 20px 0 auto">
             
            {isGroup && 
             (<Image src={TokenGatedIcon} height="28px" maxHeight="32px" width={'auto'} />)}

            {isGroup && chatInfo?.isPublic && 
            (<Image src={PublicChatIcon} height="28px" maxHeight="32px" width={'auto'} />)}

            {isGroup && 
            (<ImageItem onClick={() => setOptions(true)}>
                <Image src={VerticalEllipsisIcon} height="21px" maxHeight="32px" width={'auto'} cursor="pointer"  />
               
            {options && 
                <DropDownBar theme={theme} ref={DropdownRef}>
                    <Span>Group Info</Span>
                </DropDownBar>}
            
            </ImageItem>)}
                
            
        </Section>
    )
}


export const ProfileHeader = ({ chatInfo }: {chatInfo: any}) => {
    const [isGroup, setIsGroup] = useState<boolean>(false);
    const theme = useContext(ThemeContext);

    useEffect(()=> {
        if(!chatInfo) return;

        if(chatInfo?.groupName && chatInfo?.groupDescription){
         setIsGroup(true);
        } 

        console.log(chatInfo);

    },[chatInfo])

 const [options, setOptions] = useState(false); 
 
 if(chatInfo) {
 return (
    <Container theme={theme}>
        {chatInfo?.groupImage || chatInfo?.profilePicture ? (
            <Image src={isGroup ? chatInfo?.groupImage : chatInfo?.profilePicture} height="48px" maxHeight="48px" width={'auto'} borderRadius="100%" />
        ) : <DummyImage />}
        

        <Span color="#fff" fontSize="17px" margin="0 0 0 10px">{isGroup ? chatInfo?.groupName : shortenText(chatInfo?.did?.split(':')[1], 6, true)}</Span>

        <Options options={options} setOptions={setOptions} isGroup={isGroup} chatInfo={chatInfo} theme={theme} />
    </Container>
    
  )
} else {
    return null;
}
}


const Container = styled.div`
  width: 100%;
  background: ${(props) => props.theme.bgColorPrimary};
//   border: 1px solid #3A3A4A;
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