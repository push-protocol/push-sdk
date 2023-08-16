import React, { useContext, useEffect, useRef, useState } from 'react';
import { ChatDataContext } from '../../../context';
import { IMessageListProps } from '../exportedTypes';
import { chatLimit } from '../../../config';
import { IMessageIPFS } from '@pushprotocol/restapi';
import useFetchHistoryMessages from '../../../hooks/chat/useFetchHistoryMessages';
import styled from 'styled-components';
import { Section, Span, Spinner } from '../../reusables';
import moment from 'moment';
import { MessageBubble } from '../MessageBubble';
import {
  appendUniqueMessages,
  checkIfSameChat,
  dateToFromNowDaily,
  pCAIP10ToWallet,
  walletToPCAIP10,
} from '../../../helpers';
import { useChatData, usePushChatSocket } from '../../../hooks';
import { Messagetype } from '../../../types';
import { ThemeContext } from '../theme/ThemeProvider';
import { IChatTheme } from '../theme';
import useFetchConversationHash from '../../../hooks/chat/useFetchConversationHash';

/**
 * @interface IThemeProps
 * this interface is used for defining the props for styled components
 */
interface IThemeProps {
  theme?: IChatTheme;
}



export const MessageList: React.FC<IMessageListProps> = (
  options: IMessageListProps
) => {
  const { chatId, limit = chatLimit } = options || {};
  const { pgpPrivateKey, account } = useChatData();
  const [conversationHash, setConversationHash] = useState<string>();
  const [messages, setMessages] = useState<Messagetype>();
  const { historyMessages, loading } = useFetchHistoryMessages();
  const listInnerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { messagesSinceLastConnection } = usePushChatSocket();
  const { fetchConversationHash } = useFetchConversationHash();
  const theme = useContext(ThemeContext);
  const dates = new Set();
  const {env} = useChatData();

  useEffect(() => {
    setMessages(undefined);
    setConversationHash(undefined);
  }, [chatId]);

  useEffect(() => {
    if (checkIfSameChat(messagesSinceLastConnection, account!, chatId)) {
      if (!Object.keys(messages || {}).length) {
        setMessages({
          messages: [messagesSinceLastConnection],
          lastThreadHash: messagesSinceLastConnection.cid,
        });
        setConversationHash(messagesSinceLastConnection.cid)
      } else {
        const newMessageList = appendUniqueMessages(
          messages as Messagetype,
          [messagesSinceLastConnection],
          false
        );
        setMessages({
          messages: newMessageList,
          lastThreadHash: messages!.lastThreadHash,
        });
      }
      scrollToBottom(null);
    }
  }, [messagesSinceLastConnection]);

  useEffect(() => {
    (async function () {
      const hash = await fetchConversationHash({ conversationId: chatId });
      setConversationHash(hash?.threadHash);
    })();
  }, [chatId, pgpPrivateKey, account, env]);

  useEffect(() => {
    if (conversationHash) {
      (async function () {
        await getMessagesCall();
      })();
    }
  }, [conversationHash]);

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
      scrollToBottom(null);
    }
  }, [messages]);

  const scrollToBottom = (behavior?: string | null) => {
    bottomRef?.current?.scrollIntoView(
      !behavior ? true : { behavior: 'smooth' }
    );
  };

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
    if (threadHash) {
      const chatHistory = await historyMessages({
        limit: limit,
        threadHash,
      });
      if (chatHistory?.length) {
        if (Object.keys(messages || {}) && messages?.messages.length) {
          const newMessageList = appendUniqueMessages(
            messages,
            chatHistory,
            true
          );
          setMessages({
            messages: newMessageList,
            lastThreadHash: chatHistory[0].link,
          });
        } else {
          setMessages({
            messages: chatHistory,
            lastThreadHash: chatHistory[0].link,
          });
        }
      }
    }
  };

  type RenderDataType = {
    chat: IMessageIPFS;
    dateNum: string;
  };

  const renderDate = ({ chat, dateNum }: RenderDataType) => {
    const timestampDate = dateToFromNowDaily(chat.timestamp as number);
    dates.add(dateNum);
    return (
      <Span
        margin="15px 0"
        fontSize="14px"
        fontWeight="600"
        color={theme.textColorSecondary}
        textAlign="center"
      >
        {timestampDate}
      </Span>
    );
  };

  return (
    <MessageListCard
      overflow="hidden scroll"
      flexDirection="column"
      ref={listInnerRef}
      width="100%"
      justifyContent="start"
      padding="0 2px"
      theme={theme}
      //   background={theme.bgColorSecondary}
      onScroll={() => onScroll()}
    >
      {loading ? <Spinner color={theme.accentBgColor}/> : ''}

      <Section flexDirection="column" justifyContent="start" width="100%">
        {messages?.messages && messages?.messages?.map((chat: IMessageIPFS, index: number) => {
          const dateNum = moment(chat.timestamp).format('L');
          const position =
            pCAIP10ToWallet(chat.fromDID).toLowerCase() !==
            account?.toLowerCase()
              ? 0
              : 1;
          return (
            <>
              {dates.has(dateNum) ? null : renderDate({ chat, dateNum })}
              <Section justifyContent={position ? 'end' : 'start'}>
                <MessageBubble chat={chat} key={index} />
              </Section>
            </>
          );
        })}
        <div ref={bottomRef} />
      </Section>
    </MessageListCard>
  );
};

//styles
const MessageListCard = styled(Section)<IThemeProps>`
  &::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.accentBgColor};
    border-radius: 10px;
  }

  &::-webkit-scrollbar {
    width: 5px;
  }
`;
