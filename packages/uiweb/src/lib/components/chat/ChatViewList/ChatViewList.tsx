import React, { useContext, useEffect, useRef, useState } from 'react';
import { ChatDataContext } from '../../../context';
import { IChatViewListProps } from '../exportedTypes';
import { chatLimit } from '../../../config';
import {
  IFeeds,
  IMessageIPFS,
  IMessageIPFSWithCID,
} from '@pushprotocol/restapi';
import useFetchHistoryMessages from '../../../hooks/chat/useFetchHistoryMessages';
import styled from 'styled-components';
import { Div, Section, Span, Spinner } from '../../reusables';
import moment from 'moment';
import { ChatViewBubble } from '../ChatViewBubble';
import {
  appendUniqueMessages,
  checkIfIntent,
  checkIfSameChat,
  dateToFromNowDaily,
  getDefaultFeedObject,
  getNewChatUser,
  pCAIP10ToWallet,
} from '../../../helpers';
import { useChatData, usePushChatSocket } from '../../../hooks';
import { Messagetype } from '../../../types';
import { ThemeContext } from '../theme/ThemeProvider';
import { IChatTheme } from '../theme';
import useFetchConversationHash from '../../../hooks/chat/useFetchConversationHash';

import { ENCRYPTION_KEYS, EncryptionMessage } from './MessageEncryption';
import useGetGroup from '../../../hooks/chat/useGetGroup';
import useGetChatProfile from '../../../hooks/useGetChatProfile';
import useFetchChat from '../../../hooks/chat/useFetchChat';
import { ApproveRequestBubble } from './ApproveRequestBubble';

/**
 * @interface IThemeProps
 * this interface is used for defining the props for styled components
 */
interface IThemeProps {
  theme?: IChatTheme;
  blur: boolean;
}
const ChatStatus = {
  FIRST_CHAT: `This is your first conversation with recipient.\n Start the conversation by sending a message.`,
  INVALID_CHAT: 'Invalid chatId',
};

export const ChatViewList: React.FC<IChatViewListProps> = (
  options: IChatViewListProps
) => {
  const { chatId, limit = chatLimit, chatFilterList = [] } = options || {};
  const { pgpPrivateKey, account } = useChatData();
  const [chatFeed, setChatFeed] = useState<IFeeds>({} as IFeeds);
  const [chatStatusText, setChatStatusText] = useState<string>('');
  const [messages, setMessages] = useState<Messagetype>();
  const [loading, setLoading] = useState<boolean>(true);
  const [conversationHash, setConversationHash] = useState<string>();
  const { historyMessages, loading: messageLoading } =
    useFetchHistoryMessages();
  const listInnerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { fetchChat } = useFetchChat();
  const { fetchChatProfile } = useGetChatProfile();
  const { getGroup } = useGetGroup();

  const { messagesSinceLastConnection, groupInformationSinceLastConnection } =
    usePushChatSocket();
  const { fetchConversationHash } = useFetchConversationHash();
  const theme = useContext(ThemeContext);
  const dates = new Set();
  const { env } = useChatData();

  useEffect(() => {
    setChatStatusText('');
  }, [chatId, account, env]);

  useEffect(() => {
    setMessages(undefined);
    setConversationHash(undefined);
  }, [chatId, account, pgpPrivateKey, env]);

  useEffect(() => {
    (async () => {
      if (!account && !env) return;
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
      setLoading(false);
    })();
  }, [chatId, pgpPrivateKey, account, env]);

  useEffect(() => {
    if (checkIfSameChat(messagesSinceLastConnection, account!, chatId)) {
      if (!Object.keys(messages || {}).length) {
        setFilteredMessages([
          messagesSinceLastConnection,
        ] as IMessageIPFSWithCID[]);
        // setMessages({
        //   messages: [messagesSinceLastConnection],
        //   lastThreadHash: messagesSinceLastConnection.cid,
        // });
        setConversationHash(messagesSinceLastConnection.cid);
      } else {
        const newChatViewList = appendUniqueMessages(
          messages as Messagetype,
          [messagesSinceLastConnection],
          false
        );
        setFilteredMessages(newChatViewList as IMessageIPFSWithCID[]);
        // setMessages({
        //   messages: newChatViewList,
        //   lastThreadHash: messages!.lastThreadHash,
        // });
      }
      scrollToBottom(null);
    }
  }, [messagesSinceLastConnection]);

  useEffect(() => {
    (async function () {
      if (!account && !env && !chatId) return;
      const hash = await fetchConversationHash({ conversationId: chatId });
      setConversationHash(hash?.threadHash);
    })();
  }, [chatId, account, env, pgpPrivateKey]);

  useEffect(() => {
    if (conversationHash) {
      (async function () {
        await getMessagesCall();
      })();
    }
  }, [conversationHash, pgpPrivateKey, account, env]);

  useEffect(() => {
    scrollToBottom(null);
  }, [conversationHash]);

  useEffect(() => {
    if (
      conversationHash &&
      Object.keys(messages || {}).length &&
      messages?.messages.length &&
      messages?.messages.length <= limit
    ) {
      setChatStatusText('');
      scrollToBottom(null);
    }
  }, [messages]);

  useEffect(() => {
    if (
      Object.keys(messagesSinceLastConnection || {}).length &&
      Object.keys(chatFeed || {}).length &&
      checkIfSameChat(messagesSinceLastConnection, account!, chatId)
    ) {
      const updatedChatFeed = chatFeed;
      updatedChatFeed.msg = messagesSinceLastConnection;

      setChatStatusText('');
      setChatFeed(updatedChatFeed);
    }
  }, [messagesSinceLastConnection]);

  const scrollToBottom = (behavior?: string | null) => {
    bottomRef?.current?.scrollIntoView(
      !behavior ? true : { behavior: 'smooth' }
    );
  };

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

  const onScroll = async () => {
    if (listInnerRef.current) {
      const { scrollTop } = listInnerRef.current;
      if (scrollTop === 0) {
        const content = listInnerRef.current;
        const curScrollPos = content.scrollTop;
        const oldScroll = content.scrollHeight - content.clientHeight;

        await getMessagesCall();

        const newScroll = content.scrollHeight - content.clientHeight;
        content.scrollTop = curScrollPos + (newScroll - oldScroll);
      }
    }
  };

  const getMessagesCall = async () => {
    let threadHash = null;
    if (!messages) {
      threadHash = conversationHash;
    } else {
      threadHash = messages?.lastThreadHash;
    }
    if (threadHash && account) {
      const chatHistory = await historyMessages({
        limit: limit,
        threadHash,
      });
      if (chatHistory?.length) {
        if (Object.keys(messages || {}) && messages?.messages.length) {
          const newChatViewList = appendUniqueMessages(
            messages,
            chatHistory,
            true
          );

          setFilteredMessages(newChatViewList as IMessageIPFSWithCID[]);
        } else {
          setFilteredMessages(chatHistory as IMessageIPFSWithCID[]);
        }
      }
    }
  };

  type RenderDataType = {
    chat: IMessageIPFS;
    dateNum: string;
  };

  const setFilteredMessages = (messageList: Array<IMessageIPFSWithCID>) => {
    const updatedMessageList = messageList.filter(
      (msg) => !chatFilterList.includes(msg.cid)
    );

    if (updatedMessageList && updatedMessageList.length) {
      setMessages({
        messages: updatedMessageList,
        lastThreadHash: updatedMessageList[0].link,
      });
    }
  };
  const renderDate = ({ chat, dateNum }: RenderDataType) => {
    const timestampDate = dateToFromNowDaily(chat.timestamp as number);
    dates.add(dateNum);
    return (
      <Span
        margin="15px 0"
        fontSize={theme.fontSize?.timestamp}
        fontWeight={theme.fontWeight?.timestamp}
        color={theme.textColor?.timestamp}
        textAlign="center"
      >
        {timestampDate}
      </Span>
    );
  };
  return (
    <ChatViewListCard
      overflow="hidden scroll"
      flexDirection="column"
      ref={listInnerRef}
      width="100%"
      justifyContent="start"
      padding="0 2px"
      theme={theme}
      blur={
        !!(
          chatFeed &&
          chatFeed?.groupInformation &&
          !chatFeed?.groupInformation?.isPublic &&
          !pgpPrivateKey
        )
      }
      onScroll={() => onScroll()}
    >
      {loading ? <Spinner color={theme.spinnerColor} /> : ''}
      {!loading && (
        <>
          {chatFeed &&
          (chatFeed.publicKey ||
            (chatFeed?.groupInformation &&
              !chatFeed?.groupInformation?.isPublic)) ? (
                <EncryptionMessage id={ENCRYPTION_KEYS.ENCRYPTED} />
          ) : (
            <EncryptionMessage id={chatFeed?.groupInformation?ENCRYPTION_KEYS.NO_ENCRYPTED_GROUP:ENCRYPTION_KEYS.NO_ENCRYPTED} />
          )}

          {chatStatusText && (
            <Section margin="20px 0 0 0">
              <Span
                fontSize="13px"
                color={theme.textColor?.encryptionMessageText}
                fontWeight="400"
              >
                {chatStatusText}
              </Span>
            </Section>
          )}
          {messageLoading ? <Spinner color={theme.spinnerColor} /> : ''}

          {!messageLoading && (
            <>
              <Section
                flexDirection="column"
                justifyContent="start"
                width="100%"
              >
                {messages?.messages &&
                  messages?.messages?.map(
                    (chat: IMessageIPFS, index: number) => {
                      const dateNum = moment(chat.timestamp).format('L');
                      const position =
                        pCAIP10ToWallet(chat.fromDID).toLowerCase() !==
                        account?.toLowerCase()
                          ? 0
                          : 1;
                      return (
                        <>
                          {dates.has(dateNum)
                            ? null
                            : renderDate({ chat, dateNum })}
                          <Section justifyContent={position ? 'end' : 'start'} margin='7px'>
                            <ChatViewBubble chat={chat} key={index} />
                          </Section>
                        </>
                      );
                    }
                  )}
                <div ref={bottomRef} />
              </Section>
              {chatFeed &&
                account &&
                checkIfIntent({
                  chat: chatFeed as IFeeds,
                  account: account!,
                }) && (
                  <ApproveRequestBubble
                    chatFeed={chatFeed}
                    chatId={chatId}
                    setChatFeed={setChatFeed}
                  />
                )}
            </>
          )}
        </>
      )}
    </ChatViewListCard>
  );
};

//styles
const ChatViewListCard = styled(Section)<IThemeProps>`
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
`;

const Overlay = styled.div``;
