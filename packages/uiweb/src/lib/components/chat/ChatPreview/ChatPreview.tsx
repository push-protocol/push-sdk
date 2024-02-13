import React, { useContext, useEffect, useRef, useState } from 'react';

import styled from 'styled-components';

import { useChatData } from '../../../hooks';
import { Button, Image, Section } from '../../reusables';

import { IChatPreviewProps } from '../exportedTypes';
import { IChatTheme } from '../theme';
import { ThemeContext } from '../theme/ThemeProvider';
import { formatAddress, formatDate } from '../helpers';
import { resolveNewEns, shortenText } from '../../../helpers';
import { CoreContractChainId, InfuraAPIKey } from '../../../config';
import { ethers } from 'ethers';
import { FaFile } from "react-icons/fa";
import { CiImageOn } from "react-icons/ci";
/**
 * @interface IThemeProps
 * this interface is used for defining the props for styled components
 */
interface IThemeProps {
  theme?: IChatTheme;
  blur?: boolean;
}

export const ChatPreview: React.FC<IChatPreviewProps> = (
  options: IChatPreviewProps
) => {
  const theme = useContext(ThemeContext);
  const {env} = useChatData();
  const provider = new ethers.providers.InfuraProvider(CoreContractChainId[env], InfuraAPIKey);
  const [formattedAddress,setFormattedAddress] = useState<string>('');
  const [web3Name, setWeb3Name] = useState<string | null>(null);

  useEffect(()=>{
    (async()=>{
    const address = await formatAddress(options.chatPreviewPayload,env);
    setFormattedAddress(address);
    if(!options.chatPreviewPayload?.chatGroup){
      const result = await resolveNewEns(address, provider,env);
      setWeb3Name(result);
    }
    })();


  },[])

  const getProfileName = (formattedAddress:string) => {
    return options.chatPreviewPayload?.chatGroup
      ? formattedAddress
      : web3Name
      ? web3Name
      : formattedAddress
      
  };


  return (
    <ChatPreviewContainer>
      <Button
        display="flex"
        width="100%"
        height="70px"
        minHeight="70px"
        margin="5px 5px"
        padding="5px 5px"
        borderRadius={theme.borderRadius?.chatPreview}
        border={theme.border?.chatPreview}
        flexDirection="row"
        background={
          options.selected
            ? theme.backgroundColor?.chatPreviewSelectedBackground
            : theme.backgroundColor?.chatPreviewBackground
        }
        hoverBackground={theme.backgroundColor?.chatPreviewHoverBackground}
        onClick={() => {
          // set chatid as selected
          if (options?.setSelected)
            options.setSelected(options?.chatPreviewPayload?.chatId || '',options?.chatPreviewPayload?.chatParticipant);
        }}
      >
        <Section
          justifyContent="start"
          flexDirection="row"
          alignItems="center"
          alignSelf="center"
          borderRadius="50%"
          overflow="hidden"
          width="48px"
          height="48px"
        >
          <Image
            src={options.chatPreviewPayload?.chatPic || undefined}
            height="48px"
            width="48px"
          />
        </Section>
        <Section
          justifyContent="flex-start"
          flexDirection="column"
          alignItems="center"
          alignSelf="stretch"
          overflow="hidden"
          margin="0 5px"
          flex="1"
        >
          <Section
            justifyContent="flex-start"
            flexDirection="row"
            alignItems="flex-start"
            alignSelf="stretch"
            overflow="hidden"
            flex="1"
          >
            <Account theme={theme}>{ shortenText(getProfileName(formattedAddress),8,true) ||  shortenText(formattedAddress,8,true)}</Account>
            <Dated theme={theme}>{formatDate(options.chatPreviewPayload)}</Dated>
          </Section>
          <Section
            justifyContent="flex-start"
            flexDirection="row"
            alignItems="flex-start"
            alignSelf="stretch"
            overflow="hidden"
            flex="1"
          >
            <Message theme={theme}>
            {
                (options?.chatPreviewPayload?.chatMsg?.messageType === "Image" || options?.chatPreviewPayload?.chatMsg?.messageType === "GIF" || options?.chatPreviewPayload?.chatMsg?.messageType === "MediaEmbed" )
                ? 
               ( 
                <Section
                justifyContent="flex-start"
                flexDirection="row"
                alignItems="center"
                alignSelf="stretch"
                overflow="hidden"
                flex="1"
                gap="4px"
                >
                  <CiImageOn />
                  Media
                </Section>
              ) : (options?.chatPreviewPayload?.chatMsg?.messageType === "File" ?
                <Section
                  justifyContent="flex-start"
                  flexDirection="row"
                  alignItems="center"
                  alignSelf="stretch"
                  overflow="hidden"
                  flex="1"
                  gap="4px"
                  >
                    <FaFile/>
                    File
                </Section>
               
               : options?.chatPreviewPayload?.chatMsg?.messageContent )

              }
            </Message>
            {!!options?.badge?.count && <Badge theme={theme}>{options.badge.count}</Badge>}
          </Section>
        </Section>
      </Button>
    </ChatPreviewContainer>
  );
};

//styles
const ChatPreviewContainer = styled(Section)<IThemeProps>`
  &::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.scrollbarColor};
    border-radius: 10px;
  }

  &::-webkit-scrollbar {
    width: 5px;
  }
  ${({ blur }) =>
    blur &&
    `
  filter: blur(12px);
  `}
  overscroll-behavior: contain;
  scroll-behavior: smooth;
`;

// Styled component for the name of the person in the inbox
const Account = styled.div<IThemeProps>`
  font-weight: ${(props) => props.theme.fontWeight?.chatPreviewParticipantText};
  font-size: ${(props) => props.theme.fontSize?.chatPreviewParticipantText};
  color: ${(props) => props.theme.textColor?.chatPreviewParticipantText};
  flex: 1;
  align-self: stretch;
  text-align: start;
  // text-overflow: ellipsis ellipsis;
  white-space: nowrap;
  overflow: hidden;
  margin-right: 10px;

`;

const Dated = styled.div<IThemeProps>`
  font-weight: ${(props) => props.theme.fontWeight?.chatPreviewDateText};
  font-size: ${(props) => props.theme.fontSize?.chatPreviewDateText};
  color: ${(props) => props.theme.textColor?.chatPreviewDateText};
`;

// Styled component for the last message in the inbox
const Message = styled.div<IThemeProps>`
  font-weight: ${(props) => props.theme.fontWeight?.chatPreviewMessageText};
  font-size: ${(props) => props.theme.fontSize?.chatPreviewMessageText};
  color: ${(props) => props.theme.textColor?.chatPreviewMessageText};
  flex: 1;
  align-self: stretch;
  text-align: start;
  // text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  margin-right: 10px;
`;

const Badge = styled.div<IThemeProps>`
  background: ${(props) => props.theme.backgroundColor?.chatPreviewBadgeBackground};
  font-weight: ${(props) => props.theme.fontWeight?.chatPreviewBadgeText};
  font-size: ${(props) => props.theme.fontSize?.chatPreviewBadgeText};
  color: ${(props) => props.theme.textColor?.chatPreviewBadgeText};
  padding: 0px 8px;
  min-height: 24px;
  border-radius: 24px;
  align-self: center;

`;
