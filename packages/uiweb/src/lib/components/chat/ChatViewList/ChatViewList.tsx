import React, { useContext, useEffect, useRef, useState } from 'react';

import {
  IFeeds,
  IMessageIPFS,
  IMessageIPFSWithCID,
  IUser,
} from '@pushprotocol/restapi';
import moment from 'moment';
import styled from 'styled-components';

import { chatLimit } from '../../../config';
import {
  appendUniqueMessages,
  checkIfIntent,
  checkIfSameChat,
  dateToFromNowDaily,
  getDefaultFeedObject,
  getNewChatUser,
  pCAIP10ToWallet,
  walletToPCAIP10,
} from '../../../helpers';
import { useChatData, usePushChatSocket } from '../../../hooks';
import useFetchMessageUtilities from '../../../hooks/chat/useFetchMessageUtilities';
import { Section, Span, Spinner } from '../../reusables';
import { ChatViewBubble } from '../ChatViewBubble';
import { Group, IChatViewListProps, MessageIPFS } from '../exportedTypes';
import { IChatTheme } from '../theme';
import { ThemeContext } from '../theme/ThemeProvider';

import useFetchChat from '../../../hooks/chat/useFetchChat';
import useGetChatProfile from '../../../hooks/useGetChatProfile';
import { ApproveRequestBubble } from './ApproveRequestBubble';
import { ENCRYPTION_KEYS, EncryptionMessage } from './MessageEncryption';
import useGroupMemberUtilities from '../../../hooks/chat/useGroupMemberUtilities';
import { MdError } from 'react-icons/md';
import { ChatInfoResponse } from 'packages/restapi/src/lib/chat';
import useUserProfile from '../../../hooks/useUserProfile';
import useGetGroupByIDnew from '../../../hooks/chat/useGetGroupByIDnew';

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
  const { account, user } = useChatData();
  const [chatInfo, setChatInfo] = useState<ChatInfoResponse | null>(null);
  const [groupInfo, setGroupInfo] = useState<Group | null>(null);
  const [userInfo, setUserInfo] = useState<IUser | null>(null);

  const [chatStatusText, setChatStatusText] = useState<string>('');
  const [messages, setMessages] = useState<IMessageIPFSWithCID[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { historyMessages, historyLoading: messageLoading } =
    useFetchMessageUtilities();
  const listInnerRef = useRef<HTMLDivElement>(null);
  const [isMember, setIsMember] = useState<boolean>(false);
  const { fetchChat } = useFetchChat();
  const { fetchUserProfile } = useUserProfile();
  const { getGroupByIDnew } = useGetGroupByIDnew();
  const { fetchMemberStatus } = useGroupMemberUtilities();

  const { messagesSinceLastConnection, groupInformationSinceLastConnection } =
    usePushChatSocket();
  const theme = useContext(ThemeContext);
  const dates = new Set();
  const { env } = useChatData();

  useEffect(() => {
    setChatStatusText('');
  }, [chatId, account, env]);

  useEffect(() => {
    setChatInfo(null);
    setMessages([]);
    setGroupInfo(null);
  }, [chatId, account, user, env]);

  //need to make a common method for fetching chatFeed to ruse in messageInput
  useEffect(() => {
    (async () => {
      if (!user) return;
      const chat = await fetchChat({ chatId: chatId });
      if (Object.keys(chat || {}).length) {
        setChatInfo(chat as ChatInfoResponse);
      }
      // else {
      //   let newChatFeed;
      //   let group;
      //   const result = await getNewChatUser({
      //     searchText: chatId,
      //     fetchChatProfile,
      //     env,
      //   });
      //   if (result) {
      //     newChatFeed = getDefaultFeedObject({ user: result });
      //   } else {
      //     group = await getGroup({ searchText: chatId });
      //     if (group) {
      //       newChatFeed = getDefaultFeedObject({ groupInformation: group });
      //     }
      //   }
      //   if (newChatFeed) {
      //     if (!newChatFeed?.groupInformation) {
      //       setChatStatusText(ChatStatus.FIRST_CHAT);
      //     }
      //     setConversationHash(newChatFeed.threadhash as string);
      //     setChatFeed(newChatFeed);
      //   } else {
      //     setChatStatusText(ChatStatus.INVALID_CHAT);
      //   }
      // }
      setLoading(false);
    })();
  }, [chatId, user, account, env]);

  useEffect(() => {
    (async () => {
      if (chatInfo && !chatInfo?.meta?.group) {
        const UserProfile = await fetchUserProfile({
          profileId: chatId,
          env,
          user,
        });
        setUserInfo(UserProfile);
      } else if (chatInfo && chatInfo?.meta?.group){
        const GroupProfile = await getGroupByIDnew({ groupId: chatId });
        setGroupInfo(GroupProfile);
      }
    })();
  }, [chatInfo]);

  //moniters socket changes
  // useEffect(() => {
  //   if (checkIfSameChat(messagesSinceLastConnection, account!, chatId)) {
  //     const updatedChatFeed = chatFeed;
  //     updatedChatFeed.msg = messagesSinceLastConnection;
  //     if (!Object.keys(messages || {}).length) {

  //       setFilteredMessages([
  //         messagesSinceLastConnection,
  //       ] as IMessageIPFSWithCID[]);
  //       setConversationHash(messagesSinceLastConnection.cid);
  //     } else {
  //       const newChatViewList = appendUniqueMessages(
  //         messages as Messagetype,
  //         [messagesSinceLastConnection],
  //         false
  //       );
  //       setFilteredMessages(newChatViewList as IMessageIPFSWithCID[]);
  //     }
  //     setChatStatusText('');
  //     setChatFeed(updatedChatFeed);
  //     scrollToBottom();
  //   }
  // }, [messagesSinceLastConnection]);

  // // remove  fetching group once stream comes
  // useEffect(() => {
  //   if (Object.keys(groupInformationSinceLastConnection || {}).length) {
  //     if (
  //       chatFeed?.groupInformation?.chatId.toLowerCase() ===
  //       groupInformationSinceLastConnection.chatId.toLowerCase()
  //     ) {
  //       (async()=>{
  //         const updateChatFeed = chatFeed;
  //         const group:IGroup | undefined =  await getGroup({ searchText: chatId });
  //         if (group || !!Object.keys(group || {}).length){
  //           updateChatFeed.groupInformation = group! as GroupDTO ;

  //           setChatFeed(updateChatFeed);
  //         }

  //       })();

  //     }
  //   }
  // }, [groupInformationSinceLastConnection]);

  useEffect(() => {
    if (chatInfo) {
      (async function () {
        await getMessagesCall();
      })();
    }
  }, [chatInfo, user?.readmode(), account, env, chatId]);

  useEffect(() => {
    if (messages && messages?.length && messages?.length <= limit) {
      setChatStatusText('');
      scrollToBottom();
    }
  }, [messages]);

  useEffect(() => {
    if (user && account && groupInfo) {
      (async () => {
        const status = await fetchMemberStatus({
          chatId: groupInfo?.chatId!,
          accountId: account,
        });
        if (status && typeof status !== 'string') {
          setIsMember(status?.participant);
        } else {
          //show toast
          // groupInfoToast.showMessageToast({
          //   toastTitle: 'Error',
          //   toastMessage: 'Error in fetching member details',
          //   toastType: 'ERROR',
          //   getToastIcon: (size) => <MdError size={size} color="red" />,
          // });
        }
      })();
    }
  }, [account, groupInfo]);

  //methods
  const scrollToBottom = () => {
    console.debug('scroll to bottom');
    setTimeout(() => {
      if (listInnerRef.current) {
        listInnerRef.current.scrollTop =
          listInnerRef.current.scrollHeight + 100;
      }
    }, 0);
  };

  const onScroll = async () => {
    console.debug('on scroll');
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
      reference = messages[0].cid;
    }

    if ((user && !user?.readmode() && !groupInfo) || groupInfo) {
      console.debug('reference', reference);
      const chatHistory = await historyMessages({
        limit: limit,
        chatId,
        reference,
      });
      console.debug(chatHistory);
      if (chatHistory?.length) {
        if (messages && messages?.length) {
          const newChatViewList = appendUniqueMessages(
            messages,
            chatHistory,
            true
          );
          setMessages(newChatViewList as IMessageIPFSWithCID[]);
        } else {
          setMessages(chatHistory as IMessageIPFSWithCID[]);
        }
      }
    }
  };

  // const setFilteredMessages = (messageList: Array<IMessageIPFSWithCID>) => {
  //   const updatedMessageList = messageList.filter(
  //     (msg) => !chatFilterList.includes(msg.cid)
  //   );

  //   if (updatedMessageList && updatedMessageList.length) {
  //     setMessages({
  //       messages: updatedMessageList,
  //       lastThreadHash: updatedMessageList[0].link,
  //     });
  //   }
  // };
console.debug(userInfo,groupInfo)
  const ifBlurChat = () => {
    return !!(
      groupInfo &&
      user &&
      !groupInfo?.isPublic &&
      ((!isMember && user?.readmode()) || !user?.readmode())
    );
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
      justifyContent="start"
      padding="0 2px"
      theme={theme}
      blur={ifBlurChat()}
      onScroll={(e) => {
        console.debug('on scroll');

        // e.stopPropagation();
        // onScroll();
      }}
    >
      {loading ? <Spinner color={theme.spinnerColor} /> : ''}
      {!loading && (
        <>
          {
          ((userInfo&&userInfo.publicKey) || (groupInfo && !groupInfo?.isPublic)) ? (
            <EncryptionMessage id={ENCRYPTION_KEYS.ENCRYPTED} />
          ) : (
            <EncryptionMessage
              id={
                groupInfo
                  ? ENCRYPTION_KEYS.NO_ENCRYPTED_GROUP
                  : ENCRYPTION_KEYS.NO_ENCRYPTED
              }
            />
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

          {
            <>
              <Section
                flexDirection="column"
                justifyContent="start"
                width="100%"
              >
                {messages &&
                  messages?.map((chat: IMessageIPFS, index: number) => {
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
                        <Section
                          justifyContent={position ? 'end' : 'start'}
                          margin="7px"
                        >
                          <ChatViewBubble
                            decryptedMessagePayload={chat}
                            key={index}
                          />
                        </Section>
                      </>
                    );
                  })}
              </Section>
              {chatInfo && chatInfo?.list === 'REQUESTS' && (
                <ApproveRequestBubble groupInfo={groupInfo} chatId={chatId} />
              )}
            </>
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
  ${({ blur }) =>
    blur &&
    `
  filter: blur(12px);
  `}
  overscroll-behavior: contain;
  scroll-behavior: smooth;
`;
