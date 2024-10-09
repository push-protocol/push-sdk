// React + Web3 Essentials
import React, { useContext, useEffect, useRef, useState } from 'react';

// External Packages
import styled from 'styled-components';

// Internal Compoonents
import { deriveChatId, getDomainIfExists, pCAIP10ToWallet } from '../../../helpers';
import { useChatData } from '../../../hooks';
import useFetchChat from '../../../hooks/chat/useFetchChat';
import useGetGroupByIDnew from '../../../hooks/chat/useGetGroupByIDnew';
import { Button, Section, Span, Spinner } from '../../reusables';
import { ChatPreview } from '../ChatPreview';
import { generateRandomNonce, getChatParticipantDisplayName, transformStreamToIChatPreviewPayload } from '../helpers';

// Internal Configs
import { ThemeContext } from '../theme/ThemeProvider';

// Assets

// Interfaces & Types
import {
  ChatPreviewSearchListErrorCodes,
  IChatPreviewPayload,
  IChatPreviewSearchListError,
  IChatPreviewSearchListProps,
} from '../exportedTypes';
import { IChatTheme } from '../theme';

/**
 * @interface IThemeProps
 * this interface is used for defining the props for styled components
 */
interface IThemeProps {
  theme?: IChatTheme;
  blur: boolean;
}

interface IChatPreviewList {
  nonce: string;
  items: IChatPreviewPayload[];
  page: number;
  loading: boolean; //when scrolling for more index
  loaded: boolean;
  reset: boolean; //if chat has an error & we need to reload everything
  resume: boolean; //if chat has an error & we need to resume loading
  errored: boolean;
  error: null | IChatPreviewSearchListError;
}

interface IChatPreviewListMeta {
  selectedChatId?: string;
  badges: {
    [chatId: string]: number;
  };
}

// Constants
const SCROLL_LIMIT = 25;

// Exported Interfaces & Types

// Exported Functions
export const ChatPreviewSearchList: React.FC<IChatPreviewSearchListProps> = (options: IChatPreviewSearchListProps) => {
  // get hooks
  const { user } = useChatData();
  const { getGroupByIDnew } = useGetGroupByIDnew();

  // set chat preview list
  const [chatPreviewList, setChatPreviewList] = useState<IChatPreviewList>({
    nonce: 'INITIAL_NONCE',
    items: [],
    page: 0,
    loading: false,
    loaded: false,
    reset: false,
    resume: false,
    errored: false,
    error: null,
  });

  // set chat preview list meta
  const [chatPreviewListMeta, setChatPreviewListMeta] = useState<IChatPreviewListMeta>({
    selectedChatId: undefined,
    badges: {},
  });

  // set theme
  const theme = useContext(ThemeContext);
  const { fetchChat } = useFetchChat();

  // set ref
  const listInnerRef = useRef<HTMLDivElement>(null);

  // setup stream
  const { chatStream, chatAcceptStream, chatRequestStream, chatRejectStream, groupCreateStream } = useChatData();

  // If push user changes or if options param changes
  useEffect(() => {
    if (!user) {
      return;
    }

    // reset the entire state and call loading
    setChatPreviewList({
      nonce: generateRandomNonce(),
      items: [],
      page: 0,
      loading: true,
      loaded: false,
      reset: true,
      resume: false,
      errored: false,
      error: null,
    });
  }, [user, options?.searchParamter]);

  // If loading becomes active
  useEffect(() => {
    if (!user) {
      return;
    }

    let timerId: NodeJS.Timeout;

    if (chatPreviewList.reset) {
      timerId = setTimeout(() => {
        loadMoreChats(true);
        resetBadge();
      }, 500);
    }

    // Cleanup timer
    return () => clearTimeout(timerId);
  }, [chatPreviewList.reset, chatPreviewList.nonce]);

  //load more chats
  const loadMoreChats = async (restart = false) => {
    // Load chat type from options, if not present, default to CHATS
    const nextpage = restart ? 1 : chatPreviewList.page + 1;

    // store current nonce and page
    const currentNonce = chatPreviewList.nonce;

    let error = {
      code: ChatPreviewSearchListErrorCodes.CHAT_PREVIEW_LIST_INVALID_SEARCH_ERROR,
      message: 'Invalid search',
    };

    let resolved = false;
    let searchedChat: IChatPreviewPayload = {
      chatId: undefined,
      chatPic: null,
      chatParticipant: '',
      chatGroup: false,
      chatTimestamp: undefined,
      chatMsg: {
        messageMeta: '',
        messageType: '',
        messageContent: '',
      },
    };

    //check if searchParamter is there
    if (options?.searchParamter && options?.searchParamter.length > 3) {
      console.debug(
        'UIWeb::components::ChatPreviewSearchList::loadMoreChats::starting search',
        options.searchParamter,
        chatPreviewList.nonce
      );

      const formattedChatId: string | null = options?.searchParamter;
      let derivedChatId = formattedChatId;

      // Check if the chatId is ENS / Web3 Name
      if (getDomainIfExists(formattedChatId)) {
        // resolve web3 name
        derivedChatId = await deriveChatId(formattedChatId, user);
      }

      // Fetch chat info
      try {
        const chatInfo = await fetchChat({ chatId: derivedChatId });
        if (chatInfo) {
          console.debug(
            'UIWeb::components::ChatPreviewSearchList::loadMoreChats::chatInfo',
            chatInfo,
            chatPreviewList.nonce
          );

          if (chatInfo?.meta?.group) {
            const groupInfo = await getGroupByIDnew({
              groupId: derivedChatId,
            });
            if (groupInfo) {
              searchedChat = {
                ...searchedChat,
                chatId: derivedChatId,
                chatParticipant: groupInfo?.groupName,
                chatGroup: true,
                chatPic: groupInfo?.groupImage || null,
                chatMsg: {
                  messageMeta: 'Text',
                  messageType: 'Text',
                  messageContent: chatInfo?.list === 'CHATS' ? 'Resume Conversation!' : 'Join Group!',
                },
              };

              resolved = true;
            }
          } else {
            const userProfile = await user?.info({ overrideAccount: chatInfo.recipient });
            console.debug('UIWeb::components::ChatPreviewSearchList::loadMoreChats::userProfile', userProfile);
            searchedChat = {
              ...searchedChat,
              chatId: derivedChatId,
              chatParticipant: getChatParticipantDisplayName(derivedChatId, formattedChatId),
              chatGroup: false,
              chatPic: userProfile?.profile?.picture || null,
              chatMsg: {
                messageMeta: 'Text',
                messageType: 'Text',
                messageContent: chatInfo?.list === 'CHATS' ? 'Resume Chat!' : 'Start Chat!',
              },
            };
            resolved = true;
          }
        } else {
          error = {
            code: ChatPreviewSearchListErrorCodes.CHAT_PREVIEW_LIST_INVALID_SEARCH_ERROR,
            message: 'Invalid search',
          };
        }
      } catch (e) {
        error = {
          code: ChatPreviewSearchListErrorCodes.CHAT_PREVIEW_LIST_INVALID_SEARCH_ERROR,
          message: 'Invalid search',
        };
      }
    } else if (!options?.searchParamter) {
      // Search is empty, simply resolve
      resolved = true;
    } else {
      error = {
        code: ChatPreviewSearchListErrorCodes.CHAT_PREVIEW_LIST_INSUFFICIENT_INPUT,
        message: 'Enter at least 4 characters to search',
      };
    }

    // return if nonce doesn't match
    if (currentNonce !== chatPreviewList.nonce) {
      // resolved result
      console.debug(
        'UIWeb::components::ChatPreviewSearchList::loadMoreChats::Resolved search but nonce mismatch',
        chatPreviewList.nonce,
        searchedChat,
        resolved
      );

      return;
    }

    // resolved result
    console.debug(
      'UIWeb::components::ChatPreviewSearchList::loadMoreChats::Resolved search result',
      chatPreviewList.nonce,
      searchedChat,
      resolved
    );

    // finally set the chat preview list
    setChatPreviewList((prev) => ({
      ...prev,
      items: resolved ? [searchedChat] : [],
      page: 1,
      loading: false,
      loaded: false,
      reset: false,
      resume: false,
      errored: resolved ? false : true,
      error: resolved ? null : error,
    }));
  };

  // Helper Functions

  // Add to chat items
  const addChatItems: (items: IChatPreviewPayload[], incrementBadge?: boolean) => void = (
    items: IChatPreviewPayload[],
    incrementBadge?: boolean
  ) => {
    const combinedItems: IChatPreviewPayload[] = [...items, ...chatPreviewList.items].filter(
      (item, index, self) => index === self.findIndex((t) => t.chatId === item.chatId)
    );

    setChatPreviewList((prev) => ({
      ...prev,
      items: [...combinedItems],
    }));
    if (incrementBadge) {
      // increment badge for each item
      items.forEach((item) => {
        // only increment if not selected
        if (chatPreviewListMeta.selectedChatId !== item.chatId) {
          console.debug('UIWeb::components::ChatPreviewSearchList::incrementing badge', item);
          setBadge(
            item.chatId!,
            chatPreviewListMeta.badges[item.chatId!] ? chatPreviewListMeta.badges[item.chatId!] + 1 : 1
          );
        }
      });
    }
  };

  // Remove from chat items
  const removeChatItems: (items: string[]) => void = (items: string[]) => {
    const combinedItems: IChatPreviewPayload[] = [...chatPreviewList.items].filter(
      (item) => !items.includes(item.chatId!)
    );

    setChatPreviewList((prev) => ({
      ...prev,
      items: combinedItems,
    }));

    // remove badge for each item
    items.forEach((item) => {
      setBadge(item!, 0);
    });
  };

  // Transform stream message
  const transformStreamMessage: (item: any) => void = async (item: any) => {
    if (!user) {
      return;
    }

    // transform the item to IChatPreviewPayload
    const modItem = transformStreamToIChatPreviewPayload(item);

    // now check if this message is already present in the list
    // in this case, also check for address lookup
    // If found, then swizzle chat id with this new one
    const chatItem = chatPreviewList.items.find(
      (chatItem) =>
        chatItem.chatId === modItem.chatId ||
        pCAIP10ToWallet(chatItem.chatId ?? '') === pCAIP10ToWallet(modItem.chatParticipant ?? '')
    );

    // only proceed if chat item is present as this is searched
    if (chatItem) {
      // Override chat id
      modItem.chatId = chatItem.chatId;
      modItem.chatPic = chatItem.chatPic;
      modItem.chatParticipant = chatItem.chatParticipant;

      // modify the chat items
      addChatItems([modItem], true);
    }
  };

  // Transform accepted request
  const transformAcceptedRequest: (item: any) => void = async (item: any) => {
    if (!user) {
      return;
    }

    // pass it as transform stream message to add
    transformStreamMessage(item);
  };

  // Define Chat Preview List Meta Functions
  // Set selected badge
  const setSelectedBadge: (chatId: string, chatParticipant: string) => void = (
    chatId: string,
    chatParticipant: string
  ) => {
    // selected will reduce badge to 0
    setChatPreviewListMeta((prev) => ({
      selectedChatId: chatId,
      badges: {
        ...prev.badges,
        [chatId]: 0,
      },
    }));

    // call onChatSelected if present
    if (options?.onChatSelected) {
      options.onChatSelected(chatId, chatParticipant);
    }
  };

  // Set badge
  const setBadge: (chatId: string, num: number) => void = (chatId: string, num: number) => {
    // increment badge
    setChatPreviewListMeta((prev) => ({
      ...prev,
      badges: {
        ...prev.badges,
        [chatId]: prev.badges ? num : 0,
      },
    }));
  };

  // Reset badge
  const resetBadge: () => void = () => {
    // reset badge
    setChatPreviewListMeta({
      selectedChatId: undefined,
      badges: {},
    });
  };

  // Effects
  useEffect(() => {
    if (options?.onLoading) {
      options?.onLoading({
        preload: chatPreviewList.page === 0,
        loading: chatPreviewList.loading,
        finished: chatPreviewList.loaded,
        paging: chatPreviewList.page > 0,
      });
    }
  }, [chatPreviewList.loading, chatPreviewList.loaded, chatPreviewList.page]);

  // If badges count change
  useEffect(() => {
    // Count all badges object that are greater than 0
    const count = Object.values(chatPreviewListMeta.badges).reduce((acc, cur) => (acc > 0 ? 1 + cur : cur), 0);

    // Call onBadgeCountChange if present
    if (options?.onUnreadCountChange) {
      options.onUnreadCountChange(count);
    }
  }, [chatPreviewListMeta.badges]);

  // If conversation count change
  useEffect(() => {
    // Call onConversationCountChange if present
    if (options?.onChatsCountChange) {
      options.onChatsCountChange(chatPreviewList.items.length);
    }
  }, [chatPreviewList.items]);

  // Define stream objects
  // When chat comes in
  useEffect(() => {
    if (Object.keys(chatStream || {}).length > 0 && chatStream.constructor === Object) {
      transformStreamMessage(chatStream);
    }
  }, [chatStream]);

  // When chat accept comes in
  useEffect(() => {
    if (Object.keys(chatAcceptStream || {}).length > 0 && chatAcceptStream.constructor === Object) {
      transformAcceptedRequest(chatAcceptStream);
    }
  }, [chatAcceptStream]);

  // When chat request comes in
  useEffect(() => {
    if (Object.keys(chatRequestStream || {}).length > 0 && chatRequestStream.constructor === Object) {
      transformStreamMessage(chatRequestStream);
    }
  }, [chatRequestStream]);

  //search method for a chatId

  // Attach scroll listener
  const onScroll = async () => {
    const element = listInnerRef.current;

    if (element) {
      const windowHeight = element.clientHeight;
      const scrollHeight = element.scrollHeight;
      const scrollTop = element.scrollTop;
      const scrollBottom = scrollHeight - scrollTop - windowHeight;
      if (
        scrollBottom <= SCROLL_LIMIT &&
        !chatPreviewList.loading &&
        !chatPreviewList.loaded &&
        !chatPreviewList.reset &&
        !chatPreviewList.errored
      ) {
        // set loading to true
        setChatPreviewList((prev) => ({
          ...prev,
          nonce: generateRandomNonce(),
          loading: true,
        }));
      }
    }
  };

  // Render
  return (
    <ChatPreviewListContainer
      key={user?.uid}
      padding={theme.padding?.chatPreviewListPadding}
      margin={theme.margin?.chatPreviewListMargin}
      blur={false}
      ref={listInnerRef}
      theme={theme}
      onScroll={!options?.prefillChatPreviewList ? onScroll : undefined}
    >
      {/* do actual chat previews */}
      {chatPreviewList.items.map((item: IChatPreviewPayload, index: number) => {
        return (
          <ChatPreview
            key={`${user?.uid}-${item.chatId}`}
            chatPreviewPayload={item}
            badge={
              options?.prefillChatPreviewList && options?.prefillChatPreviewList[index].badge
                ? options?.prefillChatPreviewList[index].badge
                : chatPreviewListMeta.badges
                ? { count: chatPreviewListMeta.badges[item.chatId!] }
                : { count: 0 }
            }
            selected={
              options?.prefillChatPreviewList && options?.prefillChatPreviewList[index].selected
                ? options?.prefillChatPreviewList[index].selected
                : chatPreviewListMeta.selectedChatId === item.chatId
                ? true
                : false
            }
            setSelected={
              options?.prefillChatPreviewList && options?.prefillChatPreviewList[index].setSelected
                ? options?.prefillChatPreviewList[index].setSelected
                : setSelectedBadge
            }
            readmode={user?.readmode()}
          />
        );
      })}

      {/* if errored out for any reason */}
      {chatPreviewList.errored && (
        <Section
          padding="10px"
          flexDirection="column"
        >
          <SearchError theme={theme}>{chatPreviewList.error?.message}</SearchError>

          {!!(chatPreviewList.error?.code !== ChatPreviewSearchListErrorCodes.CHAT_PREVIEW_LIST_INSUFFICIENT_INPUT) && (
            <Button
              onClick={() => {
                const errorCode = chatPreviewList.error
                  ? chatPreviewList.error.code
                  : ChatPreviewSearchListErrorCodes.CHAT_PREVIEW_LIST_INVALID_SEARCH_ERROR;

                setChatPreviewList((prev) => ({
                  ...prev,
                  items: [],
                  page: 0,
                  loading: errorCode === ChatPreviewSearchListErrorCodes.CHAT_PREVIEW_LIST_LOAD_ERROR ? true : false,
                  reset:
                    errorCode === ChatPreviewSearchListErrorCodes.CHAT_PREVIEW_LIST_INVALID_SEARCH_ERROR ? true : false,
                  resume: errorCode === ChatPreviewSearchListErrorCodes.CHAT_PREVIEW_LIST_LOAD_ERROR ? true : false,
                  errored: false,
                }));
              }}
              background="rgb(226,8,128)"
              color="#fff"
              borderRadius="16px"
              padding="4px 12px"
            >
              Refresh
            </Button>
          )}
        </Section>
      )}

      {chatPreviewList.loading && !chatPreviewList.errored && (
        <Section
          padding="10px"
          flexDirection="column"
        >
          <Spinner color={theme.spinnerColor} />
        </Section>
      )}
    </ChatPreviewListContainer>
  );
};

//styles
const ChatPreviewListContainer = styled(Section)<IThemeProps>`
  height: auto;
  overflow: hidden auto;
  flex-direction: column;
  width: 100%;
  justify-content: start;
  box-sizing: border-box;
  // padding: 0 2px;

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

const SearchError = styled(Span)`
  margin: 10px 10px 20px 10px;
  background: ${(props) => props.theme.backgroundColor?.searchInputBackground || 'transparent'};
  color: ${(props) => props.theme.textColor?.searchInputText || 'transparent'};
  border-radius: 20px;
  justify-content: center;
  align-self: center;
  padding: 12px 18px;
  text-transform: uppercase;
  letter-spacing: normal;
  font-size: 10px;
  font-weight: 500;
`;
