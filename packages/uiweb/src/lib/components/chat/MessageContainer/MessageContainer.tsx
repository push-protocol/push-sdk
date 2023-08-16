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
import {
  checkIfIntent,
  checkIfSameChat,
  getDefaultFeedObject,
  getNewChatUser,
} from '../../../helpers';
import { TickSvg } from '../../../icons/Tick';
import useApproveChatRequest from '../../../hooks/chat/useApproveChatRequest';
import { useChatData } from '../../../hooks/chat/useChatData';
import { TypeBar } from '../TypeBar';
import useGetChatProfile from '../../../hooks/useGetChatProfile';
import { ethers } from 'ethers';
import useGetGroup from '../../../hooks/chat/useGetGroup';

const ChatStatus = {
  FIRST_CHAT: `This is your first conversation with recipient.\n Start the conversation by sending a message.`,
  INVALID_CHAT: 'Invalid chatId',
};
const EncryptionMessageContent = {
  ENCRYPTED: {
    IconComponent: <EncryptionIcon size="15" />,
    text: 'Messages are end-to-end encrypted. Only users in this chat can view or listen to them. Click to learn more.',
  },
  NO_ENCRYPTED: {
    IconComponent: <NoEncryptionIcon size="15" />,
    text: `Messages are not encrypted`,
  },
};
const EncryptionMessage = ({ id }: { id: 'ENCRYPTED' | 'NO_ENCRYPTED' }) => {
  const theme = useContext(ThemeContext);
  const isMobile = useDeviceWidthCheck(771);
  return (
    <Section
      padding="10px"
      alignSelf="center"
      borderRadius="12px"
      background={theme.bgColorPrimary}
      margin="10px 10px 0px"
      width={isMobile ? '80%' : 'fit-content'}
    >
      <EncryptionMessageDiv textAlign="center">
        {EncryptionMessageContent[id].IconComponent}

        <Span
          fontSize="13px"
          margin="0 0 0 5px"
          color={theme.textColorSecondary}
          fontWeight="400"
          textAlign="left"
        >
          {EncryptionMessageContent[id].text}
        </Span>
      </EncryptionMessageDiv>
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
    emoji = true,
    file = true,
    gif = true,
    isConnected = true,
  } = options || {};

  const { account, pgpPrivateKey, env } = useChatData();

  console.log(env);
  const [chatFeed, setChatFeed] = useState<IFeeds>({} as IFeeds);
  const [chatStatusText, setChatStatusText] = useState<string>('');
  // const [conversationHash, setConversationHash] = useState<string>();
  const { fetchChat } = useFetchChat();
  const { fetchChatProfile } = useGetChatProfile();
  // const { fetchConversationHash } = useFetchConversationHash();
  const { getGroup } = useGetGroup();

  const { approveChatRequest, loading: approveLoading } =
    useApproveChatRequest();
  const theme = useContext(ThemeContext);
  const { groupInformationSinceLastConnection, messagesSinceLastConnection } =
    usePushChatSocket();
  const ApproveRequestText = {
    GROUP: `You were invited to the group ${chatFeed?.groupInformation?.groupName}. Please accept to continue messaging in this group.`,
    W2W: ` Please accept to enable push chat from this wallet`,
  };

  useEffect(() => {
    setChatStatusText('');
  }, [chatId,account,env]);

  useEffect(() => {
    (async () => {
      const chat = await fetchChat({ chatId });
      if (Object.keys(chat || {}).length) setChatFeed(chat as IFeeds);
      else {
        let newChatFeed;
        let group;
        const result = await getNewChatUser({
          searchText: chatId,
          fetchChatProfile,
          env,
        });
        if (result) {
          newChatFeed = getDefaultFeedObject({ user: result });
        } else {
          group = await getGroup({ searchText: chatId });
          if (group) {
            newChatFeed = getDefaultFeedObject({ groupInformation: group });
          }
        }
        if (newChatFeed) {
          if (!newChatFeed?.groupInformation) {
            setChatStatusText(ChatStatus.FIRST_CHAT);
          }
          setChatFeed(newChatFeed);
        } else {
          setChatStatusText(ChatStatus.INVALID_CHAT);
        }
      }
    })();
  }, [chatId, pgpPrivateKey, account, env]);

  useEffect(() => {
    if (Object.keys(groupInformationSinceLastConnection || {}).length) {
      if (
        chatFeed?.groupInformation?.chatId.toLowerCase() ===
        groupInformationSinceLastConnection.chatId.toLowerCase()
      ) {
        const updateChatFeed = chatFeed;
        updateChatFeed.groupInformation = groupInformationSinceLastConnection;
        setChatFeed(updateChatFeed);
      }
    }
  }, [groupInformationSinceLastConnection]);

  useEffect(() => {
    if (
      Object.keys(messagesSinceLastConnection || {}).length &&
      Object.keys(chatFeed || {}).length &&
      checkIfSameChat(messagesSinceLastConnection, account!, chatId)
      // ((chatFeed.did?.toLowerCase() ===
      //   messagesSinceLastConnection.fromCAIP10?.toLowerCase()) ||
      //   (chatFeed?.groupInformation?.chatId.toLowerCase() ===
      //     messagesSinceLastConnection.toCAIP10.toLowerCase()))
    ) {
      const updatedChatFeed = chatFeed;
      updatedChatFeed.msg = messagesSinceLastConnection;
      // if (chatStatusText) {
      //   setChatStatusText('');
      // }
      setChatStatusText('');
      setChatFeed(updatedChatFeed);
    }
  }, [messagesSinceLastConnection]);

  const handleApproveChatRequest = async () => {
    try {
      if (!pgpPrivateKey) {
        return;
      }
      const response = await approveChatRequest({
        chatId,
      });
      if (response) {
        const updatedChatFeed = { ...(chatFeed as IFeeds) };
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
      padding="13px"
    >
      {/* {profile && (
        <Section
          borderRadius={theme.borderRadius}
          flex="0 1 auto"
          background="grey"
        >
          Profile
        </Section>
      )} */}
      <Section
        flex="1 1 auto"
        overflow="hidden scroll"
        padding="0 20px"
        margin="0 0px 10px 0px"
        flexDirection="column"
        // height='80%'
        justifyContent="start"
      >
        {chatFeed && !chatFeed.publicKey ? (
          <EncryptionMessage id={'NO_ENCRYPTED'} />
        ) : (
          <EncryptionMessage id={'ENCRYPTED'} />
        )}

      {chatStatusText &&  <Section margin="20px 0 0 0">
          <Span
            fontSize="13px"
            color={theme.textColorSecondary}
            fontWeight="400"
          >
            {chatStatusText}
          </Span>
        </Section>}

        {chatId && messageList && <MessageList limit={limit} chatId={chatId} />}
        {checkIfIntent({ chat: chatFeed as IFeeds, account: account! }) && (
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
              {chatFeed?.groupInformation
                ? ApproveRequestText.GROUP
                : ApproveRequestText.W2W}
            </Span>
            <Div
              width="auto"
              cursor="pointer"
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

      {typebar && (
        <Section flex="0 1 auto">
          <TypeBar chatId={chatId} File={file} Emoji={emoji} GIF={gif} isConnected={isConnected} />
        </Section>
      )}
    </Section>
  );
};

//styles

const EncryptionMessageDiv = styled(Div)`
  text-align: center;
  svg {
    vertical-align: middle;
  }
`;
