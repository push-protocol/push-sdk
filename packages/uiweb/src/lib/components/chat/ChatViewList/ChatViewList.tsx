import React, { useContext, useEffect, useRef, useState } from 'react';

import {
  GroupDTO,
  IFeeds,
  IMessageIPFS,
  IMessageIPFSWithCID,
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
import { Group, IChatViewListProps } from '../exportedTypes';
import { IGroup, Messagetype } from '../../../types';
import { IChatTheme } from '../theme';
import { ThemeContext } from '../theme/ThemeProvider';

import useFetchChat from '../../../hooks/chat/useFetchChat';
import useGetGroup from '../../../hooks/chat/useGetGroup';
import useGetChatProfile from '../../../hooks/useGetChatProfile';
import { ApproveRequestBubble } from './ApproveRequestBubble';
import { ENCRYPTION_KEYS, EncryptionMessage } from './MessageEncryption';
import useGroupMemberUtilities from '../../../hooks/chat/useGroupMemberUtilities';
import { MdError } from 'react-icons/md';
import { ChatInfoResponse } from 'packages/restapi/src/lib/chat';

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
  const { pgpPrivateKey, account,user, connectedProfile, setConnectedProfile } =
    useChatData();
  const [chatFeed, setChatFeed] = useState<IFeeds>({} as IFeeds);
  const [chatInfo, setChatInfo] = useState<ChatInfoResponse>({} as ChatInfoResponse);
  const [groupInfo, setGroupInfo] = useState<Group>({} as Group);

  const [chatStatusText, setChatStatusText] = useState<string>('');
  const [messages, setMessages] = useState<Messagetype>();
  const [loading, setLoading] = useState<boolean>(true);
  const [conversationHash, setConversationHash] = useState<string>();
  const { historyMessages, historyLoading: messageLoading } =
  useFetchMessageUtilities();
  const listInnerRef = useRef<HTMLDivElement>(null);
  const [isMember, setIsMember] = useState<boolean>(false);
  const { fetchChat } = useFetchChat();
  const { fetchChatProfile } = useGetChatProfile();
  const { fetchMemberStatus} = useGroupMemberUtilities();
  const { getGroup } = useGetGroup();

  const { messagesSinceLastConnection, groupInformationSinceLastConnection } =
    usePushChatSocket();
  const theme = useContext(ThemeContext);
  const dates = new Set();
  const { env } = useChatData();

  useEffect(() => {
    setChatStatusText('');
  }, [chatId, account, env]);

  useEffect(() => {
    (async () => {
      if (!connectedProfile && account) {
        const user = await fetchChatProfile({ profileId: account!, env });
        if (user) setConnectedProfile(user);
      }
    })();
  }, [account]);
  useEffect(() => {
    setConversationHash(undefined);
    setChatFeed({} as IFeeds);
    setMessages(undefined);
 
   
  }, [chatId, account, pgpPrivateKey, env]);

  //need to make a common method for fetching chatFeed to ruse in messageInput
  useEffect(() => {
    (async () => {
      if (!user) return;
      const chat = await fetchChat({ chatId:chatId });
      if (Object.keys(chat || {}).length) {
        // setConversationHash(chat?.threadhash as string);
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

      if(chatInfo){
console.debug(chatInfo)
        // if()

      }
      
   
    })();

  }, [chatInfo]);
  //moniters socket changes
  useEffect(() => {
    if (checkIfSameChat(messagesSinceLastConnection, account!, chatId)) {
      const updatedChatFeed = chatFeed;
      updatedChatFeed.msg = messagesSinceLastConnection;
      if (!Object.keys(messages || {}).length) {

        setFilteredMessages([
          messagesSinceLastConnection,
        ] as IMessageIPFSWithCID[]);
        setConversationHash(messagesSinceLastConnection.cid);
      } else {
        const newChatViewList = appendUniqueMessages(
          messages as Messagetype,
          [messagesSinceLastConnection],
          false
        );
        setFilteredMessages(newChatViewList as IMessageIPFSWithCID[]);
      }
      setChatStatusText('');
      setChatFeed(updatedChatFeed);
      scrollToBottom();
    }
  }, [messagesSinceLastConnection]);

  // remove  fetching group once stream comes 
  useEffect(() => {
    if (Object.keys(groupInformationSinceLastConnection || {}).length) {
      if (
        chatFeed?.groupInformation?.chatId.toLowerCase() ===
        groupInformationSinceLastConnection.chatId.toLowerCase()
      ) {
        (async()=>{
          const updateChatFeed = chatFeed;
          const group:IGroup | undefined =  await getGroup({ searchText: chatId });
          if (group || !!Object.keys(group || {}).length){
            updateChatFeed.groupInformation = group! as GroupDTO ;
          
            setChatFeed(updateChatFeed);
          }
         
        })();
       
      }
    }
  }, [groupInformationSinceLastConnection]);

  useEffect(() => {
    if (conversationHash) {
      (async function () {
        await getMessagesCall();
      })();
    }
  }, [conversationHash, pgpPrivateKey, account, env,chatFeed, chatId]);



  useEffect(() => {
    if (
      conversationHash &&
      Object.keys(messages || {}).length &&
      messages?.messages.length &&
      messages?.messages.length <= limit
    ) {
      setChatStatusText('');
      scrollToBottom();
    }
  }, [messages]);

  // useEffect(()=>{

  //   if(chatFeed &&  !chatFeed?.groupInformation?.isPublic && account)
  //   {
  //     chatFeed?.groupInformation?.members.forEach((acc) => {
  //       if (
  //         acc.wallet.toLowerCase() === walletToPCAIP10(account!).toLowerCase()
  //       ) {
  //         setIsMember(true);
  //       }
  //     });
  //   }
  // },[account,chatFeed])
  useEffect(() => {
    if (account && chatFeed?.chatId) {
      (async () => {
        const status = await fetchMemberStatus({
          chatId: chatFeed?.chatId!,
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
  }, [account,chatFeed]);

  //methods
  const scrollToBottom = () => {
    setTimeout(()=>{
      if (listInnerRef.current) {
        listInnerRef.current.scrollTop = listInnerRef.current.scrollHeight +100;

      }
    },0)
  
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
    let threadHash = null;
    if (!messages) {
      threadHash = conversationHash;
    } else {
      threadHash = messages?.lastThreadHash;
    }
    if (
      threadHash &&
      ((account && pgpPrivateKey&& chatFeed && !chatFeed?.groupInformation) ||
        (chatFeed && chatFeed?.groupInformation))
    ) {
      
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

  const ifBlurChat = () =>{
  
    return !!(
      chatFeed &&
      chatFeed?.groupInformation &&
      !chatFeed?.groupInformation?.isPublic &&
      ((!isMember && pgpPrivateKey) || (!pgpPrivateKey))
    );
  }

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
      blur={
        ifBlurChat()
      }
      onScroll={(e) => {
        e.stopPropagation();
        onScroll();
      }}
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
            <EncryptionMessage
              id={
                chatFeed?.groupInformation
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
                          <Section
                            justifyContent={position ? 'end' : 'start'}
                            margin="7px"
                          >
                            <ChatViewBubble decryptedMessagePayload={chat} key={index} />
                          </Section>
                        </>
                      );
                    }
                  )}
              </Section>
              {!!Object.keys(chatFeed || {}).length &&
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

