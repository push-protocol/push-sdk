// React + Web3 Essentials
import { ethers } from 'ethers';
import React, { useContext, useEffect, useRef, useState } from 'react';

// External Packages
import { CONSTANTS, IFeeds, IUser } from '@pushprotocol/restapi';
import styled from 'styled-components';

// Internal Compoonents
import {
  getAddress,
  getDomainIfExists,
  getNewChatUser,
  pCAIP10ToWallet,
  traceStackCalls,
  walletToPCAIP10,
} from '../../../helpers';
import { useChatData, usePushChatStream } from '../../../hooks';
import useFetchChat from '../../../hooks/chat/useFetchChat';
import useFetchMessageUtilities from '../../../hooks/chat/useFetchMessageUtilities';
import useGetGroupByIDnew from '../../../hooks/chat/useGetGroupByIDnew';
import usePushUser from '../../../hooks/usePushUser';
import { Button, Section, Span, Spinner } from '../../reusables';
import { ChatPreview } from '../ChatPreview';
import {
  displayDefaultUser,
  generateRandomNonce,
  transformChatItems,
  transformStreamToIChatPreviewPayload,
} from '../helpers';

// Internal Configs
import { ThemeContext } from '../theme/ThemeProvider';

// Assets

// Interfaces & Types
import {
  ChatPreviewListErrorCodes,
  Group,
  IChatPreviewListError,
  IChatPreviewListProps,
  IChatPreviewPayload,
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
  error: null | IChatPreviewListError;
}

interface IChatPreviewListMeta {
  selectedChatId?: string;
  badges: {
    [chatId: string]: number;
  };
}

// Constants
const CHAT_PAGE_LIMIT = 10;
const SCROLL_LIMIT = 25;

// Exported Interfaces & Types

// Exported Functions
export const ChatPreviewList: React.FC<IChatPreviewListProps> = (options: IChatPreviewListProps) => {
  // get hooks
  const { user } = useChatData();
  const { fetchUserProfile } = usePushUser();
  const { getGroupByIDnew } = useGetGroupByIDnew();
  const { fetchLatestMessage, fetchChatList } = useFetchMessageUtilities();

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
    if (!options?.prefillChatPreviewList) {
      console.debug(
        'UIWeb::ChatPreviewList::loadMoreChats:: Resetting state',
        user,
        options?.prefillChatPreviewList,
        options?.searchParamter,
        options.listType,
        options.overrideAccount
      );

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
    }
  }, [user, options?.prefillChatPreviewList, options?.searchParamter, options.listType, options.overrideAccount]);

  // If loading becomes active
  useEffect(() => {
    if (!user) {
      return;
    }

    if (!options.prefillChatPreviewList) {
      if (chatPreviewList.reset) {
        loadMoreChats(true);

        // reset badge as well
        resetBadge();
      } else if (chatPreviewList.loading || chatPreviewList.resume) {
        loadMoreChats(false);
      }
    }
  }, [chatPreviewList.loading, chatPreviewList.resume, chatPreviewList.reset, chatPreviewList.nonce]);

  //load more chats
  const loadMoreChats = async (restart = false) => {
    // Load chat type from options, if not present, default to CHATS
    const { type, overrideAccount } = getTypeAndAccount();
    const nextpage = restart ? 1 : chatPreviewList.page + 1;

    // store current nonce and page
    const currentNonce = chatPreviewList.nonce;

    if (type === CONSTANTS.CHAT.LIST_TYPE.CHATS || type === CONSTANTS.CHAT.LIST_TYPE.REQUESTS) {
      const chatList = await fetchChatList({
        type,
        page: nextpage,
        limit: CHAT_PAGE_LIMIT,
        overrideAccount,
      });

      console.debug(
        `UIWeb::ChatPreviewList::loadMoreChats:: Fetched type - ${type} - nextpage - ${nextpage} - currentNonce - ${currentNonce} - chatList - ${chatList}`
      );

      if (chatList) {
        // get and transform chats
        const transformedChats = transformChatItems(chatList);

        // return if nonce doesn't match or if page plus 1 is not the same as new page
        if (currentNonce !== chatPreviewList.nonce || chatPreviewList.page + 1 !== nextpage) {
          return;
        }

        setChatPreviewList((prev) => ({
          nonce: generateRandomNonce(),
          items: restart
            ? transformedChats
            : [...prev.items, ...transformedChats].filter(
                (item, index, self) => index === self.findIndex((t) => t.chatId === item.chatId)
              ),
          page: nextpage,
          loading: false,
          loaded: transformedChats.length < CHAT_PAGE_LIMIT ? true : false,
          reset: false,
          resume: false,
          errored: false,
          error: null,
        }));
        if (options?.onPaging) {
          options.onPaging([...chatPreviewList.items, ...transformedChats]);
        }
      } else {
        // return if nonce doesn't match or if page plus 1 is not the same as new page
        if (currentNonce !== chatPreviewList.nonce || chatPreviewList.page + 1 !== nextpage) {
          return;
        }

        // if reload is true
        const error = restart
          ? {
              code: ChatPreviewListErrorCodes.CHAT_PREVIEW_LIST_PRELOAD_ERROR,
              message: 'No chats found',
            }
          : {
              code: ChatPreviewListErrorCodes.CHAT_PREVIEW_LIST_LOAD_ERROR,
              message: 'Unable to load more chats',
            };

        setChatPreviewList((prev) => ({
          ...prev,
          nonce: generateRandomNonce(),
          reset: false,
          resume: false,
          errored: true,
          error: error,
        }));
      }
    }
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
          console.debug('UIWeb::ChatPreviewList::incrementing badge', item);
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

  //Transform group creation stream
  const transformGroupCreationStream: (item: any) => void = async (item: any) => {
    const transformedItem: IChatPreviewPayload = {
      chatId: item?.chatId,
      chatPic: item?.meta.image,
      chatParticipant: item?.meta.name,
      chatGroup: true,
      chatTimestamp: undefined,
      chatMsg: {
        messageMeta: '',
        messageType: '',
        messageContent: '',
      },
    };
    addChatItems([transformedItem], false);
  };

  // Transform stream message
  const transformStreamMessage: (item: any) => void = async (item: any) => {
    if (!user) {
      return;
    }

    // transform the item to IChatPreviewPayload
    const modItem = transformStreamToIChatPreviewPayload(item);

    // now check if this message is already present in the list
    const chatItem = chatPreviewList.items.find((chatItem) => chatItem.chatId === modItem.chatId);

    // if chat item is present, take pfp an group name if request
    if (chatItem) {
      modItem.chatPic = chatItem.chatPic;
      modItem.chatParticipant = chatItem.chatParticipant;
    } else {
      // if not present, fetch profile
      if (!modItem.chatGroup) {
        const profile = await user.profile.info({
          overrideAccount: modItem.chatParticipant,
        });
        modItem.chatPic = profile.picture;
      } else {
        const profile = await user.chat.group.info(modItem.chatId!);
        modItem.chatPic = profile.groupImage;
        modItem.chatParticipant = profile.groupName;
      }
    }

    // modify the chat items
    addChatItems([modItem], true);
  };

  // Transform accepted request
  const transformAcceptedRequest: (item: any) => void = async (item: any) => {
    if (!user) {
      return;
    }

    // if we are on requests tab then remove the chat item
    if (options.listType === CONSTANTS.CHAT.LIST_TYPE.REQUESTS) {
      removeChatItems([item.chatId]);
    } else {
      // pass it as transform stream message to add
      transformStreamMessage(item);
    }
  };

  // get type and override account
  const getTypeAndAccount = () => {
    const type = options.listType ? options.listType : CONSTANTS.CHAT.LIST_TYPE.CHATS;
    const overrideAccount = options.overrideAccount ? options.overrideAccount : undefined;
    return { type, overrideAccount };
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
    if (options?.prefillChatPreviewList && options?.prefillChatPreviewList.length) {
      setChatPreviewList({
        nonce: generateRandomNonce(),
        items: options?.prefillChatPreviewList.map((list) => list.chatPreviewPayload),
        page: 1,
        loading: false,
        loaded: false,
        reset: false,
        resume: false,
        errored: false,
        error: null,
      });
    }
  }, [options?.prefillChatPreviewList]);

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

  useEffect(() => {
    if (
      chatPreviewList.page !== 0 &&
      listInnerRef &&
      listInnerRef?.current &&
      listInnerRef?.current?.parentElement &&
      !chatPreviewList.loading
    ) {
      console.debug(
        'UIWeb::ChatPreviewList::useEffect[chatPreviewList.items]::Checking if we need to load more chats::',
        chatPreviewList,
        listInnerRef.current.clientHeight,
        SCROLL_LIMIT,
        listInnerRef.current.parentElement.clientHeight,
        listInnerRef.current.clientHeight + SCROLL_LIMIT < listInnerRef.current.parentElement.clientHeight
      );

      if (chatPreviewList.loaded) {
        return;
      }

      if (listInnerRef.current.clientHeight + SCROLL_LIMIT < listInnerRef.current.parentElement.clientHeight) {
        // set loading to true
        setChatPreviewList((prev) => ({
          ...prev,
          nonce: generateRandomNonce(),
          loading: true,
        }));
      }
    }
  }, [chatPreviewList.items]);

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
      if (options.listType === CONSTANTS.CHAT.LIST_TYPE.CHATS) {
        transformStreamMessage(chatStream);
      }
    }
  }, [chatStream]);

  // When group is created
  useEffect(() => {
    if (Object.keys(groupCreateStream).length > 0 && groupCreateStream.constructor === Object) {
      if (options.listType === CONSTANTS.CHAT.LIST_TYPE.CHATS && groupCreateStream.origin === 'self') {
        transformGroupCreationStream(groupCreateStream);
      } else if (options.listType === CONSTANTS.CHAT.LIST_TYPE.REQUESTS && groupCreateStream.origin === 'other') {
        transformGroupCreationStream(groupCreateStream);
      }
    }
  }, [groupCreateStream]);

  // When chat request comes in
  useEffect(() => {
    if (Object.keys(chatRequestStream || {}).length > 0 && chatRequestStream.constructor === Object) {
      if (options.listType === CONSTANTS.CHAT.LIST_TYPE.CHATS && chatRequestStream.origin === 'self') {
        transformStreamMessage(chatRequestStream);
      } else if (options.listType === CONSTANTS.CHAT.LIST_TYPE.REQUESTS && chatRequestStream.origin === 'other') {
        transformStreamMessage(chatRequestStream);
      }
    }
  }, [chatRequestStream]);

  // When chat accept comes in
  useEffect(() => {
    if (Object.keys(chatAcceptStream || {}).length > 0 && chatAcceptStream.constructor === Object) {
      transformAcceptedRequest(chatAcceptStream);
    }
  }, [chatAcceptStream]);

  // When chat reject comes in, this applies for groups as well
  // chat should be removed from both sender and receiver
  useEffect(() => {
    if (Object.keys(chatRejectStream || {}).length > 0 && chatRejectStream.constructor === Object) {
      removeChatItems([chatRejectStream.chatId]);
    }
  }, [chatRejectStream]);

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
          <Span margin="0 0 10px 0">{chatPreviewList.error?.message}</Span>
          {!!(
            chatPreviewList.error?.code !== ChatPreviewListErrorCodes.CHAT_PREVIEW_LIST_INVALID_SEARCH_ERROR &&
            chatPreviewList.error?.code !== ChatPreviewListErrorCodes.CHAT_PREVIEW_LIST_INSUFFICIENT_INPUT
          ) && (
            <Button
              onClick={() => {
                const errorCode = chatPreviewList.error
                  ? chatPreviewList.error.code
                  : ChatPreviewListErrorCodes.CHAT_PREVIEW_LIST_PRELOAD_ERROR;

                setChatPreviewList((prev) => ({
                  ...prev,
                  items: errorCode === ChatPreviewListErrorCodes.CHAT_PREVIEW_LIST_PRELOAD_ERROR ? [] : prev.items,
                  page: errorCode === ChatPreviewListErrorCodes.CHAT_PREVIEW_LIST_PRELOAD_ERROR ? 0 : prev.page,
                  loading: errorCode === ChatPreviewListErrorCodes.CHAT_PREVIEW_LIST_LOAD_ERROR ? true : false,
                  reset: errorCode === ChatPreviewListErrorCodes.CHAT_PREVIEW_LIST_PRELOAD_ERROR ? true : false,
                  resume: errorCode === ChatPreviewListErrorCodes.CHAT_PREVIEW_LIST_LOAD_ERROR ? true : false,
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
