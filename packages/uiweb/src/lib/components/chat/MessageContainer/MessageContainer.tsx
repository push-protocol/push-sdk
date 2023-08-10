import React, { useContext, useEffect, useState } from 'react';
import { IMessageContainerProps } from '../exportedTypes';

import styled from 'styled-components';
import { Div, Section, Span, Spinner } from '../../reusables';
import { MessageList } from '../MessageList';
import { chatLimit } from '../../../config';
import { useDeviceWidthCheck, usePushChatSocket } from '../../../hooks';
import useFetchChat from '../../../hooks/chat/useFetchChat';
import { IFeeds, IMessageIPFS } from '@pushprotocol/restapi';
import useFetchConversationHash from '../../../hooks/chat/useFetchConversationHash';
import { ThemeContext } from '../theme/ThemeProvider';
import { EncryptionIcon } from '../../../icons/Encryption';
import { NoEncryptionIcon } from '../../../icons/NoEncryption';
import { checkIfIntent } from '../../../helpers';
import { TickSvg } from '../../../icons/Tick';
import useApproveChatRequest from '../../../hooks/chat/useApproveChatRequest';
import { useChatData } from '../../../hooks/chat/useChatData';



const EncryptionMessageContent = {
  ENCRYPTED: {
    IconComponent: <EncryptionIcon size="15" />,
    text: 'Messages are end-to-end encrypted. Only users in this chat can view or listen to them.',
  },
  NO_ENCRYPTED: {
    IconComponent: <NoEncryptionIcon size="15" />,
    text: 'Messages are not encrypted until chat request is accepted.',
  },
};
const EncryptionMessage = ({ id }: { id: 'ENCRYPTED' | 'NO_ENCRYPTED' }) => {
  const theme = useContext(ThemeContext);
  const isMobile = useDeviceWidthCheck(771);
  return (
    <Section
      padding="10px"
      gap="3px"
      alignSelf="center"
      borderRadius="12px"
      background={theme.bgColorPrimary}
      margin="10px 10px 0px"
      width={isMobile?'80%':'70%'}
    >
      {EncryptionMessageContent[id].IconComponent}

      <Span
        fontSize="13px"
        color={theme.textColorSecondary}
        fontWeight="400"
        textAlign="left"
      >
        {EncryptionMessageContent[id].text}
      </Span>
    </Section>
  );
};

export const MessageContainer: React.FC<IMessageContainerProps> = (
  options: IMessageContainerProps
) => {
  const {
    chatId,
    typebar = true,
    messageList = true,
    profile = true,
    limit = chatLimit,
  } = options || {};

  const { account, pgpPrivateKey } = useChatData();
  const [chatFeed, setChatFeed] = useState<IFeeds>({} as IFeeds);
  const [conversationHash, setConversationHash] = useState<string>();
  const { fetchChat } = useFetchChat();
  const { fetchConversationHash } = useFetchConversationHash();

  const { approveChatRequest, loading: approveLoading } =
    useApproveChatRequest();
  const theme = useContext(ThemeContext);
  const { groupInformationSinceLastConnection } = usePushChatSocket();
  const ApproveRequestText = {
    GROUP: `You were invited to the group ${chatFeed?.groupInformation?.groupName}. Please accept to continue messaging in this group.`,
    W2W: ` Please accept to enable push chat from this wallet`
  }

  useEffect(() => {
    (async () => {
      console.log(chatId);
      const chat = await fetchChat({ chatId });
      const hash = await fetchConversationHash({ conversationId: chatId });
      setConversationHash(hash?.threadHash);
      if(chat)
      setChatFeed(chat);
      // else{
       
      // }
    })();
  }, [chatId, pgpPrivateKey, account]);
 

 
  useEffect(() => {
    if (
      Object.keys(groupInformationSinceLastConnection || {}).length 
    )
    {
      if(chatFeed?.groupInformation?.chatId === groupInformationSinceLastConnection.chatId){
        const updateChatFeed = chatFeed;
        updateChatFeed.groupInformation = groupInformationSinceLastConnection;
        setChatFeed(updateChatFeed);
      }
    }
  }, [groupInformationSinceLastConnection]);

  const handleApproveChatRequest = async () => {
    try {
      if (!pgpPrivateKey) {
        return;
      }
      const response = await approveChatRequest({
        chatId,
      });
      if (response) {
        console.log(response);
          const updatedChatFeed = { ...chatFeed as IFeeds};
          updatedChatFeed.intent = response;
     
          setChatFeed(updatedChatFeed);
  
      }
    } catch (error_: Error | any) {
      console.log(error_.message);
    }
  };

 

  return (
    <Section
      width="100%"
      height="inherit"
      flexDirection="column"
      justifyContent="space-between"
      overflow="hidden"
      background={theme.bgColorSecondary}
      borderRadius={theme.borderRadius}
      padding="10px"
    >
      <Section
        borderRadius={theme.borderRadius}
        flex="0 1 auto"
        background="grey"
      >
        Profile
      </Section>
      <Section
            flex="1 1 auto"
            overflow="hidden scroll"
            padding="0 20px"
            margin="0 0px 10px 0px"
            flexDirection="column"
            justifyContent='start'
          >
   
          {chatFeed && !chatFeed.publicKey ? (
            <EncryptionMessage id={'NO_ENCRYPTED'} />
          ) : (
            <EncryptionMessage id={'ENCRYPTED'} />
          )}
       
     
           {conversationHash && (  <MessageList limit={limit} conversationHash={conversationHash} />  )}
            {!checkIfIntent({ chat: chatFeed as IFeeds, account: account! }) && (
              <Section
                color={theme.textColorPrimary}
                gap="20px"
                background={theme.chatBubblePrimaryBgColor}
                padding="8px 12px"
                margin="7px 0"
                borderRadius=" 0px 12px 12px 12px"
                alignSelf="start"
                justifyContent="start"
                maxWidth="68%"
                minWidth="15%"
                position="relative"
                flexDirection="row"
              >
                <Span
                  alignSelf="center"
                  textAlign="left"
                  fontSize="16px"
                  fontWeight="400"
                  color="#000"
                  lineHeight="24px"
                >
                 {chatFeed?.groupInformation?
                 ApproveRequestText.GROUP:ApproveRequestText.W2W
                 }
                </Span>
                <Div
                width='auto'
                cursor='pointer'
                  onClick={() =>
                    !approveLoading ? handleApproveChatRequest() : null
                  }
                >
                  {approveLoading ? <Spinner /> : <TickSvg />}
                </Div>
              </Section>
            )}
          </Section>
      
      {/* )} */}

      <Section
        borderRadius={theme.borderRadius}
        flex="0 1 auto"
        background="grey"
      >
        Typebar
      </Section>
    </Section>
  );
};

//styles
const MessageContainerCard = styled(Section)``;

//change theme colours(done)
//check height(done)
//css
//message encrypted flag(done in ui but do it in socket too)
//typebar and profile
//check for group private public
//socket (w2w working)

//newChat window when not chat is there
