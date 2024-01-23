import React, { useContext, useEffect, useRef, useState } from 'react';

import {
  ChatPreviewListErrorCodes,
  Group,
  IChatPreviewListError,
  IChatPreviewListProps,
  IChatPreviewPayload,
} from '../exportedTypes';

import { CONSTANTS, IFeeds, IUser } from '@pushprotocol/restapi';
import { ethers } from 'ethers';
import styled from 'styled-components';

import { useChatData, usePushChatStream } from '../../../hooks';
import useChatProfile from '../../../hooks/chat/useChatProfile';
import useFetchMessageUtilities from '../../../hooks/chat/useFetchMessageUtilities';
import useGetGroupByIDnew from '../../../hooks/chat/useGetGroupByIDnew';
import { Button, Section, Span, Spinner } from '../../reusables';
import { ChatPreview } from '../ChatPreview';

import { getAddress, pCAIP10ToWallet } from '../../../helpers';
import {
  generateRandomNonce,
  transformChatItems,
  transformStreamToIChatPreviewPayload,
} from '../helpers';
import { IChatTheme } from '../theme';
import { ThemeContext } from '../theme/ThemeProvider';

// Define Interfaces
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
  preloading: boolean; //if wallet is not connected
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

// Define Constants
const CHAT_PAGE_LIMIT = 10;

export const ChatPreviewList: React.FC<IChatPreviewListProps> = (
  options: IChatPreviewListProps
) => {
  // get hooks
  const { env, signer, account, pushUser } = useChatData();
  const { fetchChatProfile } = useChatProfile();
  const { getGroupByIDnew } = useGetGroupByIDnew();
  const { fetchLatestMessage, fetchChatList } = useFetchMessageUtilities();

  // set chat preview list
  const [chatPreviewList, setChatPreviewList] = useState<IChatPreviewList>({
    nonce: 'INITIAL_NONCE',
    items: [],
    page: 1,
    preloading: true,
    loading: false,
    loaded: false,
    reset: false,
    resume: false,
    errored: false,
    error: null,
  });

  // set chat preview list meta
  const [chatPreviewListMeta, setChatPreviewListMeta] =
    useState<IChatPreviewListMeta>({
      selectedChatId: undefined,
      badges: {},
    });

  // set theme
  const theme = useContext(ThemeContext);

  // set ref
  const listInnerRef = useRef<HTMLDivElement>(null);

  const { chatStream, chatRequestStream, chatAcceptStream, groupMetaStream } =
    usePushChatStream();

  // Helper Functions

  // Add to chat items
  const addChatItems: (items: IChatPreviewPayload[]) => void = (
    items: IChatPreviewPayload[]
  ) => {
    const combinedItems: IChatPreviewPayload[] = [
      ...items,
      ...chatPreviewList.items,
    ].filter(
      (item, index, self) =>
        index === self.findIndex((t) => t.chatId === item.chatId)
    );

    setChatPreviewList((prev) => ({
      ...prev,
      items: combinedItems,
    }));

    // increment badge for each item
    items.forEach((item) => {
      // only increment if not selected
      if (chatPreviewListMeta.selectedChatId !== item.chatId) {
        setBadge(
          item.chatId!,
          chatPreviewListMeta.badges[item.chatId!]
            ? chatPreviewListMeta.badges[item.chatId!] + 1
            : 1
        );
      }
    });
  };

  // Remove from chat items
  const removeChatItems: (items: string[]) => void = (items: string[]) => {
    const combinedItems: IChatPreviewPayload[] = [
      ...chatPreviewList.items,
    ].filter((item) => !items.includes(item.chatId!));

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
    if (!pushUser) {
      return;
    }

    console.debug('Transforming stream message', item);

    // transform the item to IChatPreviewPayload
    const modItem = transformStreamToIChatPreviewPayload(item);

    // now check if this message is already present in the list
    const chatItem = chatPreviewList.items.find(
      (chatItem) => chatItem.chatId === modItem.chatId
    );

    // if chat item is present, take pfp an group name if request
    if (chatItem) {
      modItem.chatPic = chatItem.chatPic;
      modItem.chatParticipant = chatItem.chatParticipant;
    } else {
      // if not present, fetch profile
      if (!modItem.chatGroup) {
        const profile = await pushUser.profile.info({
          overrideAccount: modItem.chatParticipant,
        });
        modItem.chatPic = profile.picture;
      } else {
        const profile = await pushUser.chat.group.info(modItem.chatId!);
        modItem.chatPic = profile.groupImage;
        modItem.chatParticipant = profile.groupName;
      }
    }
    // modify the chat items
    addChatItems([modItem]);
  };

  // Transform accepted request
  const transformAcceptedRequest: (item: any) => void = async (item: any) => {
    if (!pushUser) {
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
    const type = options.listType
      ? options.listType
      : CONSTANTS.CHAT.LIST_TYPE.CHATS;
    const overrideAccount = options.overrideAccount
      ? options.overrideAccount
      : undefined;
    return { type, overrideAccount };
  };

  //Initialise chat
  const initializeChatList = async () => {
    // Load chat type from options, if not present, default to CHATS
    const { type, overrideAccount } = getTypeAndAccount();
    const newpage = 1;

    // store current nonce and page
    const currentNonce = chatPreviewList.nonce;
    if (type === 'SEARCH') {
      await handleSearch(currentNonce);
    } else {
      const chatList = await fetchChatList({
        type,
        page: newpage,
        limit: CHAT_PAGE_LIMIT,
        overrideAccount,
      });
      if (chatList) {
        // get and transform chats
        const transformedChats = transformChatItems(chatList);
        console.debug(
          `currentNonce: ${currentNonce}, chatPreviewList.nonce: ${chatPreviewList.nonce}`
        );

        // return if nonce doesn't match or if page is not 1
        if (
          currentNonce !== chatPreviewList.nonce ||
          chatPreviewList.page !== 1
        ) {
          return;
        }

        setChatPreviewList((prev) => ({
          nonce: generateRandomNonce(),
          items: transformedChats,
          page: 1,
          preloading: false,
          loading: false,
          loaded: false,
          reset: false,
          resume: false,
          errored: false,
          error: null,
        }));
      } else {
        // return if nonce doesn't match
        console.debug(
          `Errored: currentNonce: ${currentNonce}, chatPreviewList.nonce: ${chatPreviewList.nonce}`
        );
        if (currentNonce !== chatPreviewList.nonce) {
          return;
        }

        setChatPreviewList({
          nonce: generateRandomNonce(),
          items: [],
          page: 1,
          preloading: false,
          loading: false,
          loaded: false,
          reset: false,
          resume: false,
          errored: true,
          error: {
            code: ChatPreviewListErrorCodes.CHAT_PREVIEW_LIST_PRELOAD_ERROR,
            message: 'No chats found',
          },
        });
      }
    }
  };

  //load more chats
  const loadMoreChats = async () => {
    // Load chat type from options, if not present, default to CHATS
    const { type, overrideAccount } = getTypeAndAccount();
    const newpage = chatPreviewList.page + 1;

    // store current nonce and page
    const currentNonce = chatPreviewList.nonce;
    const currentPage = newpage;

    if (
      type === CONSTANTS.CHAT.LIST_TYPE.CHATS ||
      type === CONSTANTS.CHAT.LIST_TYPE.REQUESTS
    ) {
      const chatList = await fetchChatList({
        type,
        page: newpage,
        limit: CHAT_PAGE_LIMIT,
        overrideAccount,
      });
      if (chatList) {
        // get and transform chats
        const transformedChats = transformChatItems(chatList);

        // return if nonce doesn't match or if page plus 1 is not the same as new page
        if (
          currentNonce !== chatPreviewList.nonce ||
          chatPreviewList.page + 1 !== currentPage
        ) {
          return;
        }

        setChatPreviewList((prev) => ({
          nonce: generateRandomNonce(),
          items: [...prev.items, ...transformedChats],
          page: newpage,
          preloading: false,
          loading: false,
          loaded: transformedChats.length < CHAT_PAGE_LIMIT ? true : false,
          reset: false,
          resume: false,
          errored: false,
          error: null,
        }));
      } else {
        // return if nonce doesn't match or if page plus 1 is not the same as new page
        if (
          currentNonce !== chatPreviewList.nonce ||
          chatPreviewList.page + 1 !== newpage
        ) {
          return;
        }

        setChatPreviewList((prev) => ({
          ...prev,
          nonce: generateRandomNonce(),
          reset: false,
          resume: false,
          errored: true,
          error: {
            code: ChatPreviewListErrorCodes.CHAT_PREVIEW_LIST_LOAD_ERROR,
            message: 'Unable to load more chats',
          },
        }));
      }
    }
  };

  // Define Chat Preview List Meta Functions
  // Set selected badge
  const setSelectedBadge: (chatId: string) => void = (chatId: string) => {
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
      options.onChatSelected(chatId);
    }
  };

  // Set badge
  const setBadge: (chatId: string, num: number) => void = (
    chatId: string,
    num: number
  ) => {
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

  // If account, env or signer changes
  useEffect(() => {
    setChatPreviewList({
      nonce: generateRandomNonce(),
      items: [],
      page: 1,
      preloading: true,
      loading: false,
      loaded: false,
      reset: false,
      resume: false,
      errored: false,
      error: null,
    });
    resetBadge();
  }, [account, signer, env]);

  // If push user changes | preloading
  useEffect(() => {
    if (!pushUser) {
      return;
    }

    // reset the entire state
    setChatPreviewList({
      nonce: generateRandomNonce(),
      items: [],
      page: 1,
      preloading: true,
      loading: false,
      loaded: false,
      reset: true,
      resume: false,
      errored: false,
      error: null,
    });
  }, [
    options?.searchParamter,
    pushUser,
    options.listType,
    options.overrideAccount,
  ]);

  // If reset is called
  useEffect(() => {
    if (!pushUser) {
      return;
    }

    // reset badge as well
    resetBadge();

    if (chatPreviewList.reset) {
      initializeChatList();
    }
  }, [chatPreviewList.reset]);

  // If loading becomes active
  useEffect(() => {
    if (chatPreviewList.loading || chatPreviewList.resume) {
      loadMoreChats();
    }
  }, [chatPreviewList.loading, chatPreviewList.resume]);

  // If badges count change
  useEffect(() => {
    // Count all badges object that are greater than 0
    const count = Object.values(chatPreviewListMeta.badges).reduce(
      (acc, cur) => acc > 0 ? 1 + cur : cur,
      0
    );

    // Call onBadgeCountChange if present
    if (options?.onUnreadCountChange) {
      options.onUnreadCountChange(count);
    }
  }, [chatPreviewListMeta.badges]);

  // Define stream objects
  useEffect(() => {
    if (
      Object.keys(chatStream).length > 0 &&
      chatStream.constructor === Object
    ) {
      console.debug('Chat stream', chatStream);
      if (options.listType === CONSTANTS.CHAT.LIST_TYPE.CHATS) {
        transformStreamMessage(chatStream);
      }
    }
  }, [chatStream]);

  useEffect(() => {
    if (
      Object.keys(chatRequestStream).length > 0 &&
      chatRequestStream.constructor === Object
    ) {
      console.debug('Chat request stream', chatRequestStream);
      if (options.listType === CONSTANTS.CHAT.LIST_TYPE.REQUESTS) {
        transformStreamMessage(chatRequestStream);
      }
    }
  }, [chatRequestStream]);

  useEffect(() => {
    if (
      Object.keys(chatAcceptStream).length > 0 &&
      chatAcceptStream.constructor === Object
    ) {
      console.debug('Chat accept stream', chatAcceptStream);
      transformAcceptedRequest(chatAcceptStream);
    }
  }, [chatAcceptStream]);

  //search method for a chatId
  const handleSearch = async (currentNonce: string) => {
    let error;
    let searchedChat: IChatPreviewPayload = {
      chatId: undefined,
      chatPic: null,
      chatParticipant: '',
      chatGroup: false,
      chatTimestamp: undefined,
      chatMsg: {
        messageType: '',
        messageContent: '',
      },
    };
    //check if searchParamter is there
    try {
      if (options?.searchParamter) {
        let formattedChatId: string | null = options?.searchParamter;
        let userProfile: IUser | null = null;
        let groupProfile: Group;

        //check if ens then convert to address
        if (formattedChatId.includes('.')) {
          const address = await getAddress(formattedChatId, env)!;
          if (address) formattedChatId = pCAIP10ToWallet(address);
          else {
            error = {
              code: ChatPreviewListErrorCodes.CHAT_PREVIEW_LIST_INVALID_SEARCH_ERROR,
              message: 'Invalid search',
            };
          }
        }
        if (!error) {
          if (await ethers.utils.isAddress(formattedChatId)) {
            //fetch  profile
            userProfile = await fetchChatProfile({
              profileId: formattedChatId,
            });
          } else {
            //fetch group info
            groupProfile = await getGroupByIDnew({ groupId: formattedChatId });
          }
          if (!userProfile && !groupProfile) {
            error = {
              code: ChatPreviewListErrorCodes.CHAT_PREVIEW_LIST_INVALID_SEARCH_ERROR,
              message: 'Invalid search',
            };
          } else {
            searchedChat = {
              ...searchedChat,
              chatId: formattedChatId!,
              chatGroup: !!groupProfile,
              chatPic:
                (userProfile?.profile?.picture ?? groupProfile?.groupImage) ||
                null,
              chatParticipant: formattedChatId!,
            };
            //fetch latest chat
            const latestMessage = await fetchLatestMessage({
              chatId: formattedChatId,
            });
            if (latestMessage) {
              searchedChat = {
                ...searchedChat,
                chatMsg: {
                  messageType: latestMessage[0]?.messageType,
                  messageContent: latestMessage[0]?.messageContent,
                },
                chatTimestamp: latestMessage[0]?.timestamp,
              };
            }

            // return if nonce doesn't match or if page is not 1
            if (
              currentNonce !== chatPreviewList.nonce ||
              chatPreviewList.page !== 1
            ) {
              return;
            }
            setChatPreviewList((prev) => ({
              nonce: generateRandomNonce(),
              items: [...[searchedChat]],
              page: 1,
              preloading: false,
              loading: false,
              loaded: false,
              reset: false,
              resume: false,
              errored: false,
              error: null,
            }));
          }
        }
      } else {
        error = {
          code: ChatPreviewListErrorCodes.CHAT_PREVIEW_LIST_INSUFFICIENT_INPUT,
          message: 'Insufficient input for search',
        };
      }
      if (error) {
        setChatPreviewList({
          nonce: generateRandomNonce(),
          items: [],
          page: 1,
          preloading: false,
          loading: false,
          loaded: false,
          reset: false,
          resume: false,
          errored: true,
          error: error,
        });
      }
    } catch (e) {
      // return if nonce doesn't match
      console.debug(
        `Errored: currentNonce: ${currentNonce}, chatPreviewList.nonce: ${chatPreviewList.nonce}`
      );
      if (currentNonce !== chatPreviewList.nonce) {
        return;
      }

      setChatPreviewList({
        nonce: generateRandomNonce(),
        items: [],
        page: 1,
        preloading: false,
        loading: false,
        loaded: false,
        reset: false,
        resume: false,
        errored: true,
        error: {
          code: ChatPreviewListErrorCodes.CHAT_PREVIEW_LIST_PRELOAD_ERROR,
          message: 'Error in searching',
        },
      });
    }
  };
  // Attach scroll listener
  const onScroll = async () => {
    const element = listInnerRef.current;

    if (element) {
      const windowHeight = element.clientHeight;
      const scrollHeight = element.scrollHeight;
      const scrollTop = element.scrollTop;
      const scrollBottom = scrollHeight - scrollTop - windowHeight;
      if (
        scrollBottom <= 20 &&
        !chatPreviewList.preloading &&
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

  // Helper functions

  // Render
  return (
    <ChatPreviewListContainer
      ref={listInnerRef}
      theme={theme}
      onScroll={onScroll}
    >
      {/* do actual chat previews */}
      {chatPreviewList.items.map((item: IChatPreviewPayload) => {
        return (
          <ChatPreview
            chatPreviewPayload={item}
            badge={
              chatPreviewListMeta.badges
                ? { count: chatPreviewListMeta.badges[item.chatId!] }
                : { count: 0 }
            }
            selected={
              chatPreviewListMeta.selectedChatId === item.chatId ? true : false
            }
            setSelected={setSelectedBadge}
          />
        );
      })}

      {/* if errored out for any reason */}
      {chatPreviewList.errored && (
        <Section padding="10px" flexDirection="column">
          <Span margin="0 0 10px 0">{chatPreviewList.error?.message}</Span>
          {!!(
            chatPreviewList.error?.code !==
              ChatPreviewListErrorCodes.CHAT_PREVIEW_LIST_INVALID_SEARCH_ERROR &&
            chatPreviewList.error?.code !==
              ChatPreviewListErrorCodes.CHAT_PREVIEW_LIST_INSUFFICIENT_INPUT
          ) && (
            <Button
              onClick={() => {
                const errorCode = chatPreviewList.error
                  ? chatPreviewList.error.code
                  : ChatPreviewListErrorCodes.CHAT_PREVIEW_LIST_PRELOAD_ERROR;

                setChatPreviewList((prev) => ({
                  ...prev,
                  items:
                    errorCode ===
                    ChatPreviewListErrorCodes.CHAT_PREVIEW_LIST_PRELOAD_ERROR
                      ? []
                      : prev.items,
                  page:
                    errorCode ===
                    ChatPreviewListErrorCodes.CHAT_PREVIEW_LIST_PRELOAD_ERROR
                      ? 1
                      : prev.page,
                  preloading:
                    errorCode ===
                    ChatPreviewListErrorCodes.CHAT_PREVIEW_LIST_PRELOAD_ERROR
                      ? true
                      : false,
                  loading:
                    errorCode ===
                    ChatPreviewListErrorCodes.CHAT_PREVIEW_LIST_LOAD_ERROR
                      ? true
                      : false,
                  reset:
                    errorCode ===
                    ChatPreviewListErrorCodes.CHAT_PREVIEW_LIST_PRELOAD_ERROR
                      ? true
                      : false,
                  resume:
                    errorCode ===
                    ChatPreviewListErrorCodes.CHAT_PREVIEW_LIST_LOAD_ERROR
                      ? true
                      : false,
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

      {(chatPreviewList.preloading || chatPreviewList.loading) &&
        !chatPreviewList.errored && (
          <Section padding="10px" flexDirection="column">
            <Spinner color={theme.spinnerColor} />
          </Section>
        )}
    </ChatPreviewListContainer>
  );
};

//styles
const ChatPreviewListContainer = styled(Section)<IThemeProps>`
  height: inherit;
  overflow: hidden scroll;
  flex-direction: column;
  width: 100%;
  justify-content: start;
  padding: 0 2px;

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
