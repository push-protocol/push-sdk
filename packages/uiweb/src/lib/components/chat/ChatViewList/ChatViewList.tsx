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
import useGetGroupByIDnew from '../../../hooks/chat/useGetGroupByIDnew';
import useGroupMemberUtilities from '../../../hooks/chat/useGroupMemberUtilities';
import usePushUser from '../../../hooks/usePushUser';
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
import { ChatInfoResponse } from '../types';

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
  chatInfo: ChatInfoResponse | null;
  groupInfo: Group | null;
  isParticipant: boolean;
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
    groupInfo: null,
    isParticipant: false,
    isHidden: false,
    invalidChat: false,
  });

  const { chatId, limit = chatLimit, chatFilterList = [] } = options || {};
  const { user, toast } = useChatData();
  const [groupInfo, setGroupInfo] = useState<Group | null>(null);

  // const [chatStatusText, setChatStatusText] = useState<string>('');
  const [messages, setMessages] = useState<IMessageIPFSWithCID[]>([]);
  const { historyMessages, historyLoading: messageLoading } = useFetchMessageUtilities();
  const listInnerRef = useRef<HTMLDivElement>(null);
  const [stopPagination, setStopPagination] = useState<boolean>(false);
  const { fetchChat } = useFetchChat();
  const { getGroupByIDnew } = useGetGroupByIDnew();
  const { fetchMemberStatus } = useGroupMemberUtilities();

  // for stream
  const {
    chatStream,
    chatAcceptStream,
    chatRequestStream,
    participantJoinStream,
    participantLeaveStream,
    participantRemoveStream,
    groupUpdateStream,
  } = useChatData();

  const theme = useContext(ThemeContext);
  const dates = new Set();

  // Primary Hook that fetches and sets ChatInfo which then fetches and sets UserInfo or GroupInfo
  // Which then calls await getMessagesCall(); to fetch messages
  useEffect(() => {
    (async () => {
      if (!user) return;
      if (chatId) {
        const info = await fetchChat({ chatId: chatId });

        // get group info
        let groupMeta;
        if (info && info?.meta?.group) {
          groupMeta = await getGroupByIDnew({ groupId: chatId });
        }

        // get member status
        const status = await fetchMemberStatus({
          chatId: chatId,
          accountId: user?.account || '',
        });

        // also find out if chat is encrypted
        let hidden = false;
        if (
          user &&
          !user.readmode() &&
          ((info?.meta?.group && status?.participant) ||
            (!info?.meta?.group && (info?.list === 'CHATS' || info?.list === 'REQUESTS')) ||
            (info?.meta?.group && groupMeta?.isPublic))
        ) {
          hidden = false;
        } else {
          hidden = true;
        }

        // Finally initialize the component
        setInitialized({
          loading: false,
          chatInfo: Object.keys(info || {}).length ? (info as ChatInfoResponse) : null,
          groupInfo: groupMeta ? groupMeta : null,
          isParticipant: status?.participant ?? false,
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
        groupInfo: null,
        isParticipant: false,
        isHidden: false,
        invalidChat: false,
      });
    };
  }, [chatId, user, chatAcceptStream, participantJoinStream, participantLeaveStream, participantRemoveStream]);

  // When loading is done
  useEffect(() => {
    if (initialized.loading) return;

    (async function () {
      await getMessagesCall();
    })();
  }, [initialized.loading]);

  //moniters stream changes
  useEffect(() => {
    if (Object.keys(chatAcceptStream || {}).length > 0 && chatAcceptStream.constructor === Object) {
      const updatedChatInfo = { ...(initialized.chatInfo as ChatInfoResponse) };
      if (updatedChatInfo) updatedChatInfo.list = 'CHATS';
      setInitialized({ ...initialized, chatInfo: updatedChatInfo });
    }
  }, [chatAcceptStream]);

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

  useEffect(() => {
    if (Object.keys(groupUpdateStream || {}).length > 0 && groupUpdateStream.constructor === Object)
      transformGroupDetails(groupUpdateStream);
  }, [groupUpdateStream]);

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
  const transformGroupDetails = (item: any): void => {
    if (groupInfo?.chatId === item?.chatId) {
      const updatedGroupInfo = groupInfo;
      if (updatedGroupInfo) {
        updatedGroupInfo.groupName = item?.meta?.name;
        updatedGroupInfo.groupDescription = item?.meta?.description;
        updatedGroupInfo.groupImage = item?.meta?.image;
        updatedGroupInfo.groupCreator = item?.meta?.owner;
        updatedGroupInfo.isPublic = !item?.meta?.private;
        updatedGroupInfo.rules = item?.meta?.rules;
        setGroupInfo(updatedGroupInfo);
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
    setTimeout(() => {
      if (listInnerRef.current) {
        listInnerRef.current.scrollTop = listInnerRef.current.scrollHeight + 100;
      }
    }, 0);
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
          ((user && user.pgpPublicKey) || (initialized.groupInfo && !initialized.groupInfo?.isPublic) ? (
            <EncryptionMessage id={ENCRYPTION_KEYS.ENCRYPTED} />
          ) : user && user.readmode() ? (
            <EncryptionMessage id={ENCRYPTION_KEYS.PREVIEW} />
          ) : (
            <EncryptionMessage id={groupInfo ? ENCRYPTION_KEYS.NO_ENCRYPTED_GROUP : ENCRYPTION_KEYS.NO_ENCRYPTED} />
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
            <Span
              fontSize="13px"
              color={theme.textColor?.encryptionMessageText}
              fontWeight="400"
            >
              {messages &&
                messages.length === 0 &&
                !messageLoading &&
                !groupInfo &&
                !initialized.invalidChat &&
                CHAT_STATUS.FIRST_CHAT}
              {initialized.invalidChat && CHAT_STATUS.INVALID_CHAT}
            </Span>

            {messageLoading ? <Spinner color={theme.spinnerColor} /> : ''}
          </Section>

          {
            <ChatViewListCardInner
              flexDirection="column"
              justifyContent="start"
              width="100%"
              blur={false}
            >
              {messages &&
                messages?.map((chat: IMessageIPFS, index: number) => {
                  const dateNum = moment(chat.timestamp).format('L');
                  // TODO: This is a hack as chat.fromDID is converted with eip to match with user.account creating a bug for omnichain
                  const position =
                    pCAIP10ToWallet(chat.fromDID)?.toLowerCase() !== pCAIP10ToWallet(user?.account!)?.toLowerCase()
                      ? 0
                      : 1;
                  return (
                    <>
                      {dates.has(dateNum) ? null : renderDate({ chat, dateNum })}
                      <Section
                        justifyContent={position ? 'end' : 'start'}
                        margin="7px"
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
