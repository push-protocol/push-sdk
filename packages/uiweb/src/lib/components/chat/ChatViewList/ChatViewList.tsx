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
import { IReactionsForChatMessages } from '../../../types';
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

const SCROLL_LIMIT = 25;

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

  const { chatId, limit = chatLimit, chatFilterList = [], setReplyPayload } = options || {};
  const { user, toast } = useChatData();

  // const [chatStatusText, setChatStatusText] = useState<string>('');
  const [messages, setMessages] = useState<IMessageIPFSWithCID[]>([]);
  const [reactions, setReactions] = useState<IReactionsForChatMessages>({});

  const { historyMessages, historyLoading: messageLoading } = useFetchMessageUtilities();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [stopPagination, setStopPagination] = useState<boolean>(false);
  const { fetchChat } = useFetchChat();

  // keep tab on singular action id, useful to ensure only one action takes place
  const [singularActionId, setSingularActionId] = useState<string | null | undefined>(null);

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
  // Which then calls await fetchChatMessages(); to fetch messages
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

  // When loading is done - fetch chat messages
  useEffect(() => {
    if (initialized.loading) return;

    (async function () {
      await fetchChatMessages();
    })();
  }, [initialized.loading]);

  // when chat messages are changed or chat reactions are changed
  useEffect(() => {
    const checkForScrollAndFetchMessages = async () => {
      if (
        !initialized.loading &&
        scrollRef &&
        scrollRef?.current &&
        scrollRef?.current?.parentElement &&
        !messageLoading &&
        !stopPagination
      ) {
        console.debug(
          'UIWeb::ChatViewList::useEffect[messages, reactions]::Checking if we need to load more chats::',
          messages,
          reactions,
          scrollRef.current.clientHeight,
          SCROLL_LIMIT,
          scrollRef.current.parentElement.clientHeight,
          scrollRef.current.clientHeight + SCROLL_LIMIT < scrollRef.current.parentElement.clientHeight
        );

        if (scrollRef.current.clientHeight + SCROLL_LIMIT < scrollRef.current.parentElement.clientHeight) {
          await fetchChatMessages();
        }
      }
    };

    // new messages are loaded, calculate new top and adjust since render is done
    if (scrollRef.current) {
      const content = scrollRef.current;

      const oldScrollHeight = parseInt(content.getAttribute('data-old-scroll-height') || '0', 10); // Old scroll height before messages are added
      const newScrollHeight = content.scrollHeight; // New scroll height after messages are added
      const scrollHeightDifference = newScrollHeight - oldScrollHeight; // Calculate how much the scroll height has increased plus some variance for spinner

      // Adjust the scroll position by the difference in scroll height to maintain the same view
      content.scrollTop += scrollHeightDifference;
    }

    // check and fetch messages
    checkForScrollAndFetchMessages();
  }, [messages]);

  // Smart Scrolling
  // Scroll to bottom if user hasn't scrolled or if scroll is at bottom
  // Else leave the scroll as it is
  // to get scroll lock
  const onScroll = async () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;

      let scrollLocked = scrollRef.current.getAttribute('data-scroll-locked') === 'true' ? true : false;
      const programmableScroll = scrollRef.current.getAttribute('data-programmable-scroll') === 'true' ? true : false;
      const programmableScrollTop = scrollRef.current.getAttribute('data-programmable-scroll-top') || 0;

      // user has scrolled away so scroll should not be locked
      if (programmableScroll === false) {
        scrollLocked = false;
      }

      // lock scroll if user is at bottom
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        // add 10 for variability
        scrollLocked = true;
      }

      // Turning it off as it overfills debug
      // console.debug(
      //   `UIWeb::ChatViewList::onScroll::scrollLocked ${new Date().toISOString()}`,
      //   scrollRef.current.scrollTop,
      //   scrollRef.current.clientHeight,
      //   scrollRef.current.scrollHeight,
      //   scrollLocked
      // );

      // update scroll-locked attribute
      scrollRef.current.setAttribute('data-scroll-locked', scrollLocked.toString());

      if (scrollTop === 0) {
        const content = scrollRef.current;
        const oldScrollHeight = content.scrollHeight; // Capture the old scroll height before new messages are added
        scrollRef.current.setAttribute('data-old-scroll-height', oldScrollHeight.toString());

        await fetchChatMessages();
      }
    }
  };

  // To enable smart scrolling when content height gets adjsuted
  const chatContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { height } = entry.contentRect;

        if (scrollRef.current && height !== 0) {
          const scrollLocked = scrollRef.current.getAttribute('data-scroll-locked') === 'true' ? true : false;

          // Turning it off as it overfills debug
          // console.debug(
          //   `UIWeb::ChatViewList::onScroll::scrollLocked Observer ${new Date().toISOString()}`,
          //   scrollRef.current.scrollTop,
          //   scrollRef.current.clientHeight,
          //   scrollRef.current.scrollHeight,
          //   scrollLocked
          // );

          if (height !== 0 && scrollLocked) {
            // update programmable-scroll attribute
            scrollRef.current.setAttribute('data-programmable-scroll', 'true');
            scrollRef.current?.scrollTo(0, scrollRef.current?.scrollHeight);

            // update programmable-scroll attribute after timeout of 1000ms for previews to render
            setTimeout(() => {
              if (scrollRef.current) {
                scrollRef.current.setAttribute('data-programmable-scroll', 'false');
              }
            }, 1000);
          }
        }
      }
    });

    if (chatContainerRef.current) {
      resizeObserver.observe(chatContainerRef.current);
    }

    return () => resizeObserver.disconnect(); // clean up
  }, [chatContainerRef.current]);

  // Change listtype to 'CHATS' and hidden to false when chatAcceptStream is received
  useEffect(() => {
    if (
      (Object.keys(chatAcceptStream || {}).length > 0 && chatAcceptStream.constructor === Object) ||
      (Object.keys(participantJoinStream || {}).length > 0 && participantJoinStream.constructor === Object)
    ) {
      // Always change hidden to false and list will be CHATS
      const updatedChatInfo = { ...(initialized.chatInfo as IChatInfoResponse) };
      if (updatedChatInfo) {
        updatedChatInfo.list = 'CHATS';
        if (updatedChatInfo?.meta) updatedChatInfo.meta.visibility = true;
      }

      // set initialized after chat accept animation is done
      const timer = setTimeout(() => {
        setInitialized({ ...initialized, chatInfo: updatedChatInfo, isHidden: false });
      }, 1000);

      return () => clearTimeout(timer);
    }

    return () => {
      //Empty return
    };
  }, [chatAcceptStream, participantJoinStream]);

  // Change listtype to 'UINITIALIZED' and hidden to true when participantRemoveStream or participantLeaveStream is received
  useEffect(() => {
    if (
      (Object.keys(participantRemoveStream || {}).length > 0 && participantRemoveStream.constructor === Object) ||
      (Object.keys(participantLeaveStream || {}).length > 0 && participantLeaveStream.constructor === Object)
    ) {
      // If not encrypted, then set hidden to false
      const updatedChatInfo = { ...(initialized.chatInfo as IChatInfoResponse) };
      if (updatedChatInfo) {
        updatedChatInfo.list = 'UNINITIALIZED';
        if (updatedChatInfo?.meta) updatedChatInfo.meta.visibility = false;
      }

      setInitialized({ ...initialized, chatInfo: updatedChatInfo, isHidden: true });
    }
  }, [participantRemoveStream, participantLeaveStream]);

  useEffect(() => {
    if (Object.keys(chatStream || {}).length > 0 && chatStream.constructor === Object) {
      transformSteamMessage(chatStream);
    }
  }, [chatStream]);

  useEffect(() => {
    if (Object.keys(chatRequestStream || {}).length > 0 && chatRequestStream.constructor === Object) {
      transformSteamMessage(chatRequestStream);
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
        filterChatMessages(newChatViewList);
      } else {
        filterChatMessages([transformedMessage]);
      }
    }
  };

  const fetchChatMessages = async () => {
    if (user && !stopPagination && !messageLoading) {
      const reference = messages && messages?.length ? messages[0].link : null;
      const chatHistory = await historyMessages({
        limit: limit,
        chatId: chatId,
        reference,
      });

      if (chatHistory && chatHistory?.length) {
        const reversedChatHistory = chatHistory?.reverse();
        if (messages && messages?.length) {
          const newChatViewList = appendUniqueMessages(messages, reversedChatHistory, true);
          filterChatMessages(newChatViewList as IMessageIPFSWithCID[]);
        } else {
          filterChatMessages(reversedChatHistory as IMessageIPFSWithCID[]);
        }
      }

      // check and stop pagination if user is readmode and chatInfo visibility is false
      if (
        (user && user.readmode() && initialized.chatInfo?.meta?.visibility === false) ||
        initialized.chatInfo?.meta?.group === false
      ) {
        // not a public group
        setStopPagination(true);
      }

      // check and stop pagination if all chats are fetched
      if (!chatHistory || chatHistory?.length < limit) {
        setStopPagination(true);
      }
    }
  };

  const processChatReactions = (messageList: Array<IMessageIPFSWithCID>) => {
    const reactionMessages = reactions;

    for (const message of messageList) {
      if (message.messageType === 'Reaction') {
        const reaction = message as IMessageIPFSWithCID;

        // TODO: This should be present as an interface in the restapi package
        const reference = (reaction as any).messageObj?.reference ?? '';

        if (!reactionMessages[reference]) {
          reactionMessages[reference] = [];
        }
        // Push the reaction directly into the array
        reactionMessages[reference].push(reaction);
      }
    }

    return reactionMessages;
  };

  const filterChatMessages = (messageList: Array<IMessageIPFSWithCID>) => {
    // filter duplicates
    const uniqueMessagesList = messageList.filter((msg) => !chatFilterList.includes(msg.cid));

    // remove reactions into reactions
    const reactionMessages = processChatReactions(uniqueMessagesList);

    console.debug(
      `UIWeb::ChatViewList::filterChatMessages::uniqueMessageList::${new Date().toISOString()}`,
      uniqueMessagesList
    );
    console.debug(
      `UIWeb::ChatViewList::filterChatMessages::reactionMessages::${new Date().toISOString()}`,
      reactionMessages
    );

    if (uniqueMessagesList && uniqueMessagesList.length) {
      setMessages([...uniqueMessagesList]);
    }

    if (reactionMessages && reactionMessages.length) {
      // deep copy to update
      setReactions(JSON.parse(JSON.stringify(reactionMessages)));
    }
  };

  type RenderDataType = {
    chat: IMessageIPFS;
    dateNum: string;
    uid: string;
  };
  const renderDate = ({ chat, dateNum, uid }: RenderDataType) => {
    const timestampDate = dateToFromNowDaily(chat.timestamp as number);
    dates.add(dateNum);
    return (
      <Span
        key={uid}
        margin="15px 0"
        fontSize={theme.fontSize?.timestamp}
        fontWeight={theme.fontWeight?.timestamp}
        color={theme.textColor?.timestamp}
        textAlign="center"
        zIndex={uid}
      >
        {timestampDate}
      </Span>
    );
  };

  return (
    <ChatViewListCard
      key={user?.uid}
      data-scroll-locked="true"
      data-programmable-scroll="false"
      blur={false}
      overflow="auto"
      flexDirection="column"
      ref={scrollRef}
      width="100%"
      height="auto"
      justifyContent="start"
      padding="0 2px"
      theme={theme}
      onScroll={(e) => {
        e.stopPropagation();
        if (!stopPagination) onScroll();
      }}
      onClick={() => {
        // cancel any singular action
        setSingularActionId(null);
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
              key={`section-chatview-${user?.uid}`}
              flexDirection="column"
              justifyContent="start"
              width="100%"
              ref={chatContainerRef}
              blur={initialized.isHidden && initialized?.chatInfo?.list !== 'REQUESTS'}
            >
              {messages &&
                messages?.map((chat: IMessageIPFS, index: number) => {
                  // If message is a reaction, then skip it
                  if (chat?.messageType === 'Reaction') return null;

                  const dateNum = moment(chat.timestamp).format('L');
                  // TODO: This is a hack as chat.fromDID is converted with eip to match with user.account creating a bug for omnichain
                  const position =
                    pCAIP10ToWallet(chat.fromDID)?.toLowerCase() !== pCAIP10ToWallet(user?.account ?? '')?.toLowerCase()
                      ? 0
                      : 1;

                  // define zIndex, really big number minus 1
                  const uid = `${999999999 - index}`;

                  return (
                    <>
                      {dates.has(dateNum) ? null : renderDate({ chat, dateNum, uid: uid })}
                      <Section
                        justifyContent={position ? 'end' : 'start'}
                        key={`section-${user?.uid}-${uid}-${index}`}
                        zIndex={uid}
                        margin={
                          position ? theme.margin?.chatBubbleSenderMargin : theme.margin?.chatBubbleReceiverMargin
                        }
                      >
                        {/* TODO: Remove decryptedMessagePayload in v2 component */}
                        <ChatViewBubble
                          key={`chatbubble-${user?.uid}-${uid}-${index}`}
                          decryptedMessagePayload={chat}
                          chatPayload={chat}
                          chatReactions={reactions[(chat as any).cid] || []}
                          setReplyPayload={setReplyPayload}
                          showChatMeta={initialized.chatInfo?.meta?.group ?? false}
                          chatId={chatId}
                          actionId={(chat as any).cid}
                          singularActionId={singularActionId}
                          setSingularActionId={setSingularActionId}
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
const ChatViewListCard = styled(Section) <IThemeProps>`
  &::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.scrollbarColor};
    border-radius: 10px;
  }

  &::-webkit-scrollbar {
    width: 5px;
  }

  overscroll-behavior: contain;
`;

const ChatViewListCardInner = styled(Section) <IThemeProps>`
  filter: ${(props) => (props.blur ? 'blur(12px)' : 'none')};
`;
