// React + Web3 Essentials
import React, { useContext, useEffect, useRef, useState } from 'react';

// External Packages
import { IMessageIPFS, IMessageIPFSWithCID, IUser } from '@pushprotocol/restapi';
import moment from 'moment';
import { MdError } from 'react-icons/md';
import { ToastContainer } from 'react-toastify';
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
import useToast from '../reusables/NewToast';
import { ApproveRequestBubble } from './ApproveRequestBubble';
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

  const [loading, setLoading] = useState<boolean>(true);

  const { chatId, limit = chatLimit, chatFilterList = [] } = options || {};
  const { user } = useChatData();
  const [chatInfo, setChatInfo] = useState<ChatInfoResponse | null>(null);
  const [groupInfo, setGroupInfo] = useState<Group | null>(null);
  const [userInfo, setUserInfo] = useState<IUser | null>(null);

  // const [chatStatusText, setChatStatusText] = useState<string>('');
  const [messages, setMessages] = useState<IMessageIPFSWithCID[]>([]);
  const { historyMessages, historyLoading: messageLoading } = useFetchMessageUtilities();
  const listInnerRef = useRef<HTMLDivElement>(null);
  const [isMember, setIsMember] = useState<boolean>(false);
  const { fetchChat } = useFetchChat();
  const { fetchUserProfile } = usePushUser();
  const { getGroupByIDnew } = useGetGroupByIDnew();
  const { fetchMemberStatus } = useGroupMemberUtilities();
  const chatViewListToast = useToast();

  // setup blur
  const [blur, setBlur] = useState<boolean>(false);

  //hack for stream not working
  const [chatStream, setChatStream] = useState<any>({}); // to track any new messages
  const [chatRequestStream, setChatRequestStream] = useState<any>({}); // to track any new messages

  const [chatAcceptStream, setChatAcceptStream] = useState<any>({}); // to track any new messages
  const [participantRemoveStream, setParticipantRemoveStream] = useState<any>({}); // to track if a participant is removed from group
  const [participantLeaveStream, setParticipantLeaveStream] = useState<any>({}); // to track if a participant leaves a group
  const [participantJoinStream, setParticipantJoinStream] = useState<any>({}); // to track if a participant joins a group

  const [groupUpdateStream, setGroupUpdateStream] = useState<any>({});

  // const {
  //   chatStream,
  //   groupUpdateStream,
  //   chatAcceptStream,
  //   participantJoinStream,
  //   participantLeaveStream,
  //   participantRemoveStream,
  // } = usePushChatStream();

  //event listeners
  // This should be invoked from data provider
  // usePushChatStream();

  useEffect(() => {
    window.addEventListener('chatStream', (e: any) => setChatStream(e.detail));
    window.addEventListener('chatRequestStream', (e: any) => setChatRequestStream(e.detail));
    window.addEventListener('chatAcceptStream', (e: any) => setChatAcceptStream(e.detail));
    window.addEventListener('participantRemoveStream', (e: any) => setParticipantRemoveStream(e.detail));
    window.addEventListener('participantLeaveStream', (e: any) => setParticipantLeaveStream(e.detail));
    window.addEventListener('participantJoinStream', (e: any) => setParticipantJoinStream(e.detail));
    window.addEventListener('groupUpdateStream', (e: any) => setGroupUpdateStream(e.detail));
    return () => {
      window.removeEventListener('chatStream', (e: any) => setChatStream(e.detail));
      window.removeEventListener('chatRequestStream', (e: any) => setChatRequestStream(e.detail));

      window.removeEventListener('chatAcceptStream', (e: any) => setChatAcceptStream(e.detail));
      window.removeEventListener('participantRemoveStream', (e: any) => setParticipantRemoveStream(e.detail));
      window.removeEventListener('participantLeaveStream', (e: any) => setParticipantLeaveStream(e.detail));
      window.removeEventListener('participantJoinStream', (e: any) => setParticipantJoinStream(e.detail));
      window.removeEventListener('groupUpdateStream', (e: any) => setGroupUpdateStream(e.detail));
    };
  }, []);
  const theme = useContext(ThemeContext);
  const dates = new Set();
  const { env } = useChatData();
  // useEffect(() => {
  //   setChatStatusText('');
  // }, [chatId, account, env, user]);

  // useEffect(() => {
  //   setChatInfo(null);
  //   setMessages([]);
  //   setGroupInfo(null);
  // }, [chatId, account, user, env]);

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
          (user &&
            !user.readmode() &&
            ((info?.meta?.group && status?.participant) ||
              (!info?.meta?.group && (info?.list === 'CHATS' || info?.list === 'REQUESTS')))) ||
          (info?.meta?.group && groupMeta?.isPublic)
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
  }, [chatId, user]);

  // When loading is done
  useEffect(() => {
    if (initialized.loading) return;

    (async function () {
      await getMessagesCall();
    })();
  }, [initialized.loading]);

  // useEffect(() => {
  //   (async () => {
  //     let GroupProfile;
  //     if (chatInfo && chatInfo?.meta?.group) {
  //       GroupProfile = await getGroupByIDnew({ groupId: chatId });
  //       if (GroupProfile) setGroupInfo(GroupProfile);
  //       else {
  //         setChatStatusText(ChatStatus.INVALID_CHAT);
  //       }
  //     }
  //   })();
  // }, [chatInfo]);

  //moniters stream changes
  useEffect(() => {
    if (Object.keys(chatAcceptStream || {}).length > 0 && chatAcceptStream.constructor === Object) {
      const updatedChatInfo = { ...(chatInfo as ChatInfoResponse) };
      if (updatedChatInfo) updatedChatInfo.list = 'CHATS';
      setChatInfo(updatedChatInfo);
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
    if (chatInfo && (item?.chatId == chatInfo?.chatId || checkIfNewRequest(item, chatId))) {
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

  // maybe not needed, retrieves messages
  // useEffect(() => {
  //   if (chatInfo) {
  //     (async function () {
  //       await getMessagesCall();
  //     })();
  //   }
  // }, [chatInfo, user?.readmode(), account, env, chatId]);

  useEffect(() => {
    if (messages && messages?.length && messages?.length <= limit) {
      // setChatStatusText('');
      scrollToBottom();
    }
  }, [messages]);

  // useEffect(() => {
  //   if (user && groupInfo) {
  //     (async () => {
  //       const status = await fetchMemberStatus({
  //         chatId: groupInfo.chatId!,
  //         accountId: user?.account || '',
  //       });
  //       if (status && typeof status !== 'string') {
  //         setIsMember(status?.participant);
  //       } else {
  //         console.error('Error in fetching account details, silently ignoring');
  //         setIsMember(false);
  //         //show toast
  //         // chatViewListToast.showMessageToast({
  //         //   toastTitle: 'Error',
  //         //   toastMessage: 'Error in fetching member details',
  //         //   toastType: 'ERROR',
  //         //   getToastIcon: (size) => <MdError size={size} color="red" />,
  //         // });
  //       }
  //     })();
  //   }
  // }, [groupInfo, chatInfo, chatAcceptStream, participantJoinStream, participantLeaveStream, participantRemoveStream]);

  // // To update blur based on group info
  // useEffect(() => {
  //   const checkPrivacy = async () => {
  //     const isPrivate = await isConversationPrivate();
  //     // console log with timestamp and chatid for debugging
  //     const timestamp = new Date().toISOString();
  //     console.log(
  //       `::ChatViewList::isConversationPrivate::timestamp: ${timestamp}::chatId: ${chatId}::isPrivate: ${isPrivate}`
  //     );
  //     setBlur(false);
  //   };

  //   checkPrivacy();
  // }, [groupInfo, user, chatStatusText, chatId]);

  // const isConversationPrivate = async () => {
  //   // if user is not logged in
  //   if (!user) {
  //     if (groupInfo && groupInfo?.isPublic) {
  //       return false;
  //     }

  //     return true;
  //   }
  //   // if user is in read mode
  //   else if (user.readmode()) {
  //     // if group is public or if it's dm and FIRST CHAT
  //     if (groupInfo && groupInfo?.isPublic) {
  //       return false;
  //     }

  //     if (!groupInfo && chatStatusText === ChatStatus.FIRST_CHAT) {
  //       return false;
  //     }

  //     return true;
  //   }
  //   // If user is logged in
  //   else {
  //     // user logged in, use API
  //     console.log('USERLOGGEDIN');
  //     user.chat
  //       .info(chatId)
  //       .then((chatInfo) => {
  //         console.log('CHATINFO', chatInfo);
  //         if (chatInfo.list === 'CHATS') {
  //           return false;
  //         } else if (!chatInfo.meta.group) {
  //           // normal dm
  //           return false;
  //         } else if (groupInfo && groupInfo?.isPublic) {
  //           return false;
  //         }

  //         return true;
  //       })
  //       .catch((e) => {
  //         console.error('::ChatViewList::isConversationPrivate::Error in fetching chat info', e);
  //         return true;
  //       });
  //   }

  //   // All other cases are private
  //   return true;
  // };

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
    if (messages && messages?.length) {
      reference = messages[0].link;
    }

    if (user) {
      const chatHistory = await historyMessages({
        limit: limit,
        chatId: chatId,
        reference,
      });
      if (chatHistory?.length) {
        if (messages && messages?.length) {
          const newChatViewList = appendUniqueMessages(messages, chatHistory.reverse(), true);
          setFilteredMessages(newChatViewList as IMessageIPFSWithCID[]);
        } else {
          setFilteredMessages(chatHistory.reverse() as IMessageIPFSWithCID[]);
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
        onScroll();
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
              blur={initialized.isHidden}
            >
              {messages &&
                messages?.map((chat: IMessageIPFS, index: number) => {
                  const dateNum = moment(chat.timestamp).format('L');
                  // TODO: This is a hack as chat.fromDID is converted with eip to match with user.account creating a bug for omnichain
                  const position =
                    pCAIP10ToWallet(chat.fromDID)?.toLowerCase() !== user?.account?.toLowerCase() ? 0 : 1;
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
                        />
                      </Section>
                    </>
                  );
                })}

              {initialized.chatInfo && initialized.chatInfo?.list === 'REQUESTS' && (
                <ApproveRequestBubble
                  groupInfo={initialized.groupInfo}
                  chatId={chatId}
                />
              )}
            </ChatViewListCardInner>
          }
        </>
      )}
      <ToastContainer />
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
