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
import { dateToFromNowDaily, pCAIP10ToWallet } from '../../../helpers';
import { useChatData, usePushChatSocket } from '../../../hooks';

type Messagetype = { messages: IMessageIPFS[]; lastThreadHash: string | null };

export const MessageList: React.FC<IMessageListProps> = (
  options: IMessageListProps
) => {
  const { conversationHash, limit = chatLimit } = options || {};
  const { decryptedPgpPvtKey, account } = useChatData();
  const [messages, setMessages] = useState<Messagetype>();
  const { historyMessages, loading } = useFetchHistoryMessages();
  const listInnerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { messagesSinceLastConnection } = usePushChatSocket();
  const dates = new Set();

  useEffect(() => {
    if (
      Object.keys(messagesSinceLastConnection || {}).length 
    ) {
      if (!Object.keys(messages || {}).length) {
        setMessages({
          messages: messagesSinceLastConnection,
          lastThreadHash: messages!.lastThreadHash,
        });
      } else {
        setMessages((prevMessages) => {
          return {
            messages: [...prevMessages!.messages, messagesSinceLastConnection],
            lastThreadHash: prevMessages!.lastThreadHash,
          };
        });
      }
    }
  }, [messagesSinceLastConnection]);

  useEffect(() => {
    if (conversationHash) {
      (async function () {
        await getMessagesCall();
      })();
    }
  }, [conversationHash, decryptedPgpPvtKey, account]);

  useEffect(() => {
    scrollToBottom(null);
  }, [conversationHash]);

  useEffect(() => {
    if (
      conversationHash &&
      Object.keys(messages || {}).length &&
      messages?.messages.length
      // selectedMessages?.messages.length <= CHATS_FETCH_LIMIT
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
          const uniqueMap: { [timestamp: number]: IMessageIPFS } = {};
          const newMessageList = Object.values(
            [...chatHistory, ...messages.messages].reduce(
              (uniqueMap, message) => {
                if (message.timestamp && !uniqueMap[message.timestamp]) {
                  uniqueMap[message.timestamp] = message;
                }
                return uniqueMap;
              },
              uniqueMap
            )
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
        color="#AFAFB6"
        textAlign="center"
      >
        {timestampDate}
      </Span>
    );
  };

  return (
    <Section
      overflow="hidden scroll"
      flexDirection="column"
      ref={listInnerRef}
      justifyContent="start"
      onScroll={() => onScroll()}
    >
      {loading ? <Spinner /> : ''}

      <MessageListCard
        flexDirection="column"
        justifyContent="start"
        // overflow='hidden auto'
        width="100%"
        // padding="0 2px 15px 2px"
      >
        {messages?.messages.map((chat: IMessageIPFS, index: number) => {
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
      </MessageListCard>
    </Section>
  );
};

//styles
const MessageListCard = styled(Section)``;

//pagination scroll issue left
//socket
