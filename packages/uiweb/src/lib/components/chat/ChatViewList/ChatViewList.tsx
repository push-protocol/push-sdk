// React + Web3 Essentials
import React, { useContext, useEffect, useRef, useState } from 'react';

// External Packages
import { IMessageIPFS, IMessageIPFSWithCID, IUser } from '@pushprotocol/restapi';
import moment from 'moment';
import { MdError } from 'react-icons/md';
import styled from 'styled-components';

// Internal Compoonents
import { chatLimit } from '../../../config';
import { appendUniqueMessages, dateToFromNowDaily, pCAIP10ToWallet, walletToPCAIP10 } from '../../../helpers';
import { useChatData, usePushChatStream } from '../../../hooks';
import useFetchChat from '../../../hooks/chat/useFetchChat';
import useFetchMessageUtilities from '../../../hooks/chat/useFetchMessageUtilities';
import { Section, Span, Spinner } from '../../reusables';
import { ChatViewBubble } from '../ChatViewBubble';
import { checkIfNewRequest, transformStreamToIMessageIPFSWithCID } from '../helpers';
import { ActionRequestBubble } from './ActionRequestBubble';
import { ENCRYPTION_KEYS, EncryptionMessage } from './MessageEncryption';

// Internal Configs
import { ThemeContext } from '../theme/ThemeProvider';

// Assets

// Interfaces & Types
import { Group, IChatViewListProps } from '../exportedTypes';
import { IChatTheme } from '../theme';
import { IChatInfoResponse } from '../types';

/**
 * @interface IThemeProps
 * this interface is used for defining the props for styled components
 */
interface IThemeProps {
  theme?: IChatTheme;
  blur: boolean;
}

interface IChatViewListInitialized {
  loading: boolean;
  chatInfo: IChatInfoResponse | null;
  isHidden: boolean;
  invalidChat: boolean;
}

// Constants
const CHAT_STATUS = {
  FIRST_CHAT: `This is your first conversation with recipient.\n Start the conversation by sending a message.`,
  INVALID_CHAT: 'Invalid chatId',
};

// Exported Interfaces & Types

// Exported Functions
export const ChatViewList: React.FC<IChatViewListProps> = (options: IChatViewListProps) => {
  // setup loading state
  const [initialized, setInitialized] = useState<IChatViewListInitialized>({
    loading: true,
    chatInfo: null,
    isHidden: false,
    invalidChat: false,
  });

  const { chatId, limit = chatLimit, chatFilterList = [] } = options || {};
  const { user, toast } = useChatData();

  // const [chatStatusText, setChatStatusText] = useState<string>('');
  const [messages, setMessages] = useState<IMessageIPFSWithCID[]>([]);
  const { historyMessages, historyLoading: messageLoading } = useFetchMessageUtilities();
  const listInnerRef = useRef<HTMLDivElement>(null);
  const [stopPagination, setStopPagination] = useState<boolean>(false);
  const { fetchChat } = useFetchChat();

  // for stream
  const {
    chatStream,
    chatAcceptStream,
    chatRequestStream,
    participantJoinStream,
    participantLeaveStream,
    participantRemoveStream,
  } = useChatData();

  const theme = useContext(ThemeContext);
  const dates = new Set();

  // Primary Hook that fetches and sets ChatInfo which then fetches and sets UserInfo
  // Which then calls await getMessagesCall(); to fetch messages
  useEffect(() => {
    (async () => {
      if (!user) return;
      if (chatId) {
        const info = await user.chat.info(chatId);
        console.debug('UIWeb::components::ChatViewList::useEffect::fetchChat', info);
        // if readmode, then only public true is considered
        let hidden = false;
        if (user && user.readmode()) {
          //check if encrypted is false, only true for public groups
          hidden = !info?.meta?.groupInfo?.public ?? true;
        } else if (user && info?.meta) {
          // visibility is automatically defined
          hidden = !info?.meta?.visibility;
        } else if (!info?.meta) {
          // TODO: Hack because chat.info doesn't return meta for UNINITIALIZED chats
          // Assuming this only happens for UNINITIALIZED chats which is a dm
          // Just return false for this for now
          hidden = false;
        } else {
          // for everything else, set hidden to true
          hidden = true;
        }

        // Finally initialize the component
        setInitialized({
          loading: false,
          chatInfo: Object.keys(info || {}).length ? (info as IChatInfoResponse) : null,
          isHidden: hidden,
          invalidChat: info === undefined ? true : false,
        });
      }
    })();

    // cleanup
    return () => {
      setInitialized({
        loading: true,
        chatInfo: null,
        isHidden: false,
        invalidChat: false,
      });
    };
  }, [chatId, user]);

  // When loading is done
  useEffect(() => {
    if (initialized.loading) return;

    (async function () {
      await getMessagesCall();
    })();
  }, [initialized.loading]);

  // Change listtype to 'CHATS' and hidden to false when chatAcceptStream is received
  useEffect(() => {
    if (Object.keys(chatAcceptStream || {}).length > 0 && chatAcceptStream.constructor === Object) {
      // Always change hidden to false and list will be CHATS
      const updatedChatInfo = { ...(initialized.chatInfo as IChatInfoResponse) };
      if (updatedChatInfo) updatedChatInfo.list = 'CHATS';

      // set initialized after chat accept animation is done
      const timer = setTimeout(() => {
        setInitialized({ ...initialized, chatInfo: updatedChatInfo, isHidden: false });
      }, 1000);

      return () => clearTimeout(timer);
    }

    return () => {};
  }, [chatAcceptStream, participantJoinStream]);

  // Change listtype to 'UINITIALIZED' and hidden to true when participantRemoveStream or participantLeaveStream is received
  useEffect(() => {
    if (Object.keys(participantRemoveStream || {}).length > 0 && participantRemoveStream.constructor === Object) {
      // If not encrypted, then set hidden to false
      const updatedChatInfo = { ...(initialized.chatInfo as IChatInfoResponse) };
      if (updatedChatInfo) updatedChatInfo.list = 'UNINITIALIZED';

      setInitialized({ ...initialized, chatInfo: updatedChatInfo, isHidden: true });
    }
  }, [participantRemoveStream, participantLeaveStream]);

  useEffect(() => {
    if (Object.keys(chatStream || {}).length > 0 && chatStream.constructor === Object) {
      transformSteamMessage(chatStream);
      // setChatStatusText('');
      scrollToBottom();
    }
  }, [chatStream]);

  useEffect(() => {
    if (Object.keys(chatRequestStream || {}).length > 0 && chatRequestStream.constructor === Object) {
      transformSteamMessage(chatRequestStream);
      // setChatStatusText('');
      scrollToBottom();
    }
  }, [chatRequestStream]);

  const transformSteamMessage = (item: any) => {
    if (!user) {
      return;
    }

    if (initialized.chatInfo && (item?.chatId === initialized.chatInfo?.chatId || checkIfNewRequest(item, chatId))) {
      const transformedMessage = transformStreamToIMessageIPFSWithCID(item);
      if (messages && messages.length) {
        const newChatViewList = appendUniqueMessages(messages, [transformedMessage], false);
        setFilteredMessages(newChatViewList);
      } else {
        setFilteredMessages([transformedMessage]);
      }
    }
  };

  useEffect(() => {
    if (messages && messages?.length && messages?.length <= limit) {
      // setChatStatusText('');
      scrollToBottom();
    }
  }, [messages]);

  //methods
  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      if (listInnerRef.current) {
        listInnerRef.current.scrollTop = listInnerRef.current.scrollHeight;
      }
    });
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
        content.scrollTop = newScroll - oldScroll;
      }
    }
  };

  const getMessagesCall = async () => {
    let reference = null;
    let stopFetchingChats = false;
    if (messages && messages?.length) {
      reference = messages[0].link;
      if (!reference) {
        stopFetchingChats = true;
        setStopPagination(stopFetchingChats);
      }
    }

    if (user && !stopFetchingChats) {
      const chatHistory = await historyMessages({
        limit: limit,
        chatId: chatId,
        reference,
      });

      if (chatHistory?.length) {
        const reversedChatHistory = chatHistory?.reverse();
        if (messages && messages?.length) {
          const newChatViewList = appendUniqueMessages(messages, reversedChatHistory, true);
          setFilteredMessages(newChatViewList as IMessageIPFSWithCID[]);
        } else {
          setFilteredMessages(reversedChatHistory as IMessageIPFSWithCID[]);
        }
      }
    }
  };

  const setFilteredMessages = (messageList: Array<IMessageIPFSWithCID>) => {
    const updatedMessageList = messageList.filter((msg) => !chatFilterList.includes(msg.cid));

    if (updatedMessageList && updatedMessageList.length) {
      setMessages([...updatedMessageList]);
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
      blur={false}
      overflow="hidden scroll"
      flexDirection="column"
      ref={listInnerRef}
      width="100%"
      height="100%"
      justifyContent="start"
      padding="0 2px"
      theme={theme}
      onScroll={(e) => {
        e.stopPropagation();
        if (!stopPagination) onScroll();
      }}
    >
      <Section
        margin="5px 0 10px 0"
        minWidth="150px"
        minHeight="20px"
      >
        {initialized.loading && (
          <EncryptionMessage
            id={ENCRYPTION_KEYS.LOADING}
            className="skeleton"
          />
        )}

        {!initialized.loading &&
          (initialized.chatInfo?.meta?.encrypted ? (
            <EncryptionMessage id={ENCRYPTION_KEYS.ENCRYPTED} />
          ) : user && user.readmode() ? (
            <EncryptionMessage id={ENCRYPTION_KEYS.PREVIEW} />
          ) : (
            <EncryptionMessage
              id={initialized.chatInfo?.meta?.group ? ENCRYPTION_KEYS.NO_ENCRYPTED_GROUP : ENCRYPTION_KEYS.NO_ENCRYPTED}
            />
          ))}
      </Section>

      {initialized.loading ? <Spinner color={theme.spinnerColor} /> : ''}
      {!initialized.loading && (
        <>
          {/* Loading section and information about the chat */}
          <Section
            margin="10px 0 0 0"
            flexDirection="column"
          >
            {initialized.invalidChat && (
              <Span
                fontSize="13px"
                color={theme.textColor?.encryptionMessageText}
                fontWeight="400"
              >
                {CHAT_STATUS.INVALID_CHAT}
              </Span>
            )}

            {messageLoading ? <Spinner color={theme.spinnerColor} /> : ''}
          </Section>

          {
            <ChatViewListCardInner
              flexDirection="column"
              justifyContent="start"
              width="100%"
              blur={initialized.isHidden}
            >
              {messages &&
                messages?.map((chat: IMessageIPFS, index: number) => {
                  const dateNum = moment(chat.timestamp).format('L');
                  // TODO: This is a hack as chat.fromDID is converted with eip to match with user.account creating a bug for omnichain
                  const position =
                    pCAIP10ToWallet(chat.fromDID)?.toLowerCase() !== pCAIP10ToWallet(user?.account ?? '')?.toLowerCase()
                      ? 0
                      : 1;
                  return (
                    <>
                      {dates.has(dateNum) ? null : renderDate({ chat, dateNum })}
                      <Section
                        justifyContent={position ? 'end' : 'start'}
                        margin={
                          position ? theme.margin?.chatBubbleSenderMargin : theme.margin?.chatBubbleReceiverMargin
                        }
                        key={index}
                      >
                        <ChatViewBubble
                          decryptedMessagePayload={chat}
                          key={index}
                          isGroup={initialized.chatInfo?.meta?.group ?? false}
                        />
                      </Section>
                    </>
                  );
                })}

              {initialized.chatInfo && initialized.chatInfo?.list === 'REQUESTS' && (
                <ActionRequestBubble chatInfo={initialized.chatInfo} />
              )}
            </ChatViewListCardInner>
          }
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

  overscroll-behavior: contain;
  scroll-behavior: smooth;
`;

const ChatViewListCardInner = styled(Section)<IThemeProps>`
  filter: ${(props) => (props.blur ? 'blur(6px)' : 'none')};
`;
