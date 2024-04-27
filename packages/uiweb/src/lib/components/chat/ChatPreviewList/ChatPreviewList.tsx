// React + Web3 Essentials
import { ethers } from 'ethers';
import React, { useContext, useEffect, useRef, useState } from 'react';

// External Packages
import { CONSTANTS, IFeeds, IUser } from '@pushprotocol/restapi';
import styled from 'styled-components';

// Internal Compoonents
import { getAddress, getNewChatUser, pCAIP10ToWallet, traceStackCalls, walletToPCAIP10 } from '../../../helpers';
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
  const [chatPreviewListMeta, setChatPreviewListMeta] = useState<IChatPreviewListMeta>({
    selectedChatId: undefined,
    badges: {},
  });

  //hack to fix stream
  // const [chatStream, setChatStream] = useState<any>({}); // to track any new messages
  // const [chatAcceptStream, setChatAcceptStream] = useState<any>({}); // to track any new messages
  // const [chatRequestStream, setChatRequestStream] = useState<any>({}); // any message in request
  // const [groupCreateStream, setGroupCreateStream] = useState<any>({}); // any message in request

  // set theme
  const theme = useContext(ThemeContext);
  const { fetchChat } = useFetchChat();

  // set ref
  const listInnerRef = useRef<HTMLDivElement>(null);

  // setup stream
  const { chatStream, chatAcceptStream, chatRequestStream, groupCreateStream } = useChatData();

  // event listeners
  // This should be invoked from data provider
  // usePushChatStream();

  // useEffect(() => {
  //   // window.addEventListener('chatStream', (e: any) => setChatStream(e.detail));
  //   window.addEventListener('chatAcceptStream', (e: any) => setChatAcceptStream(e.detail));
  //   window.addEventListener('chatRequestStream', (e: any) => setChatRequestStream(e.detail));
  //   window.addEventListener('groupCreateStream', (e: any) => setGroupCreateStream(e.detail));
  //   return () => {
  //     // window.removeEventListener('chatStream', (e: any) =>
  //     //   setChatStream(e.detail)
  //     // );
  //     window.removeEventListener('chatAcceptStream', (e: any) => setChatAcceptStream(e.detail));
  //     window.removeEventListener('chatRequestStream', (e: any) => setChatRequestStream(e.detail));
  //     window.removeEventListener('groupCreateStream', (e: any) => setGroupCreateStream(e.detail));
  //   };
  // }, []);

  // If push user changes or if options param changes
  useEffect(() => {
    if (!user) {
      return;
    }

    // reset the entire state
    if (!options?.prefillChatPreviewList) {
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
    }
  }, [user, options?.prefillChatPreviewList, options?.searchParamter, options.listType, options.overrideAccount]);

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
          console.debug('::ChatPreviewList::incrementing badge', item.chatId);
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
    console.debug('Transforming stream message', modItem);

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
        console.debug(`currentNonce: ${currentNonce}, chatPreviewList.nonce: ${chatPreviewList.nonce}`);

        // return if nonce doesn't match or if page is not 1
        if (currentNonce !== chatPreviewList.nonce || chatPreviewList.page !== 1) {
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

        if (options?.onPreload) {
          options.onPreload(transformedChats);
        }
      } else {
        // return if nonce doesn't match
        console.debug(`Errored: currentNonce: ${currentNonce}, chatPreviewList.nonce: ${chatPreviewList.nonce}`);
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

    if (type === CONSTANTS.CHAT.LIST_TYPE.CHATS || type === CONSTANTS.CHAT.LIST_TYPE.REQUESTS) {
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
        if (currentNonce !== chatPreviewList.nonce || chatPreviewList.page + 1 !== currentPage) {
          return;
        }

        setChatPreviewList((prev) => ({
          nonce: generateRandomNonce(),
          items: [...prev.items, ...transformedChats].filter(
            (item, index, self) => index === self.findIndex((t) => t.chatId === item.chatId)
          ),
          page: newpage,
          preloading: false,
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
        if (currentNonce !== chatPreviewList.nonce || chatPreviewList.page + 1 !== newpage) {
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
        preloading: false,
        loading: false,
        loaded: false,
        reset: false,
        resume: false,
        errored: false,
        error: null,
      });
    }
  }, [options?.prefillChatPreviewList]);

  // // This is initialize function, only called if user changes (user?.account, user.env, etc are not required for update)
  // useEffect(() => {
  //   if (!user) {
  //     return;
  //   }

  //   if (!options?.prefillChatPreviewList) {
  //     setChatPreviewList({
  //       nonce: generateRandomNonce(),
  //       items: [],
  //       page: 1,
  //       preloading: true,
  //       loading: false,
  //       loaded: false,
  //       reset: false,
  //       resume: false,
  //       errored: false,
  //       error: null,
  //     });
  //     resetBadge();
  //   }
  // }, [user, options?.prefillChatPreviewList]);

  useEffect(() => {
    if (options?.onLoading) {
      options?.onLoading({
        preload: chatPreviewList.preloading,
        loading: chatPreviewList.loading,
        finished: chatPreviewList.loaded,
        paging: chatPreviewList.loading || chatPreviewList.resume,
      });
    }
  }, [chatPreviewList.loading, chatPreviewList.preloading, chatPreviewList.loaded, chatPreviewList.resume]);

  useEffect(() => {
    if (
      listInnerRef &&
      listInnerRef?.current &&
      listInnerRef?.current?.parentElement &&
      !chatPreviewList.preloading &&
      (options.listType === CONSTANTS.CHAT.LIST_TYPE.CHATS || options.listType === CONSTANTS.CHAT.LIST_TYPE.REQUESTS) &&
      !options?.prefillChatPreviewList
    ) {
      if (listInnerRef.current.clientHeight + SCROLL_LIMIT > listInnerRef.current.parentElement.clientHeight) {
        // set loading to true
        setChatPreviewList((prev) => ({
          ...prev,
          nonce: generateRandomNonce(),
          loading: true,
        }));
      }
    }
  }, [chatPreviewList.preloading]);

  // If reset is called
  useEffect(() => {
    if (!user) {
      return;
    }

    // reset badge as well
    resetBadge();
    if (chatPreviewList.reset && !options?.prefillChatPreviewList) {
      initializeChatList();
    }
  }, [chatPreviewList.reset, user?.readmode()]);

  // If loading becomes active
  useEffect(() => {
    if ((chatPreviewList.loading || chatPreviewList.resume) && !options.prefillChatPreviewList) {
      loadMoreChats();
    }
  }, [chatPreviewList.loading, chatPreviewList.resume]);

  // If badges count change
  useEffect(() => {
    // Count all badges object that are greater than 0
    const count = Object.values(chatPreviewListMeta.badges).reduce((acc, cur) => (acc > 0 ? 1 + cur : cur), 0);

    // Call onBadgeCountChange if present
    if (options?.onUnreadCountChange) {
      options.onUnreadCountChange(count);
    }
  }, [chatPreviewListMeta.badges]);

  // Define stream objects
  useEffect(() => {
    if (Object.keys(chatStream || {}).length > 0 && chatStream.constructor === Object) {
      if (options.listType === CONSTANTS.CHAT.LIST_TYPE.CHATS) {
        transformStreamMessage(chatStream);
      }
    }
  }, [chatStream]);

  useEffect(() => {
    if (Object.keys(groupCreateStream).length > 0 && groupCreateStream.constructor === Object) {
      if (options.listType === CONSTANTS.CHAT.LIST_TYPE.CHATS && groupCreateStream.origin === 'self') {
        transformGroupCreationStream(groupCreateStream);
      } else if (options.listType === CONSTANTS.CHAT.LIST_TYPE.REQUESTS && groupCreateStream.origin === 'other') {
        transformGroupCreationStream(groupCreateStream);
      }
    }
  }, [groupCreateStream]);

  useEffect(() => {
    if (Object.keys(chatRequestStream || {}).length > 0 && chatRequestStream.constructor === Object) {
      if (options.listType === CONSTANTS.CHAT.LIST_TYPE.CHATS && chatRequestStream.origin === 'self') {
        transformStreamMessage(chatRequestStream);
      } else if (options.listType === CONSTANTS.CHAT.LIST_TYPE.REQUESTS && chatRequestStream.origin === 'other') {
        transformStreamMessage(chatRequestStream);
      }
    }
  }, [chatRequestStream]);
  console.debug(chatStream, 'chat preview list chat stream event');
  useEffect(() => {
    if (Object.keys(chatAcceptStream || {}).length > 0 && chatAcceptStream.constructor === Object) {
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
      if (options?.searchParamter)
        if (options?.searchParamter) {
          let formattedChatId: string | null = options?.searchParamter;
          let userProfile: IUser | undefined = undefined;
          let groupProfile: Group;

          if (formattedChatId.includes('.')) {
            const address = await getAddress(formattedChatId, user ? user.env : CONSTANTS.ENV.PROD);
            if (address) formattedChatId = pCAIP10ToWallet(address);
            else {
              error = {
                code: ChatPreviewListErrorCodes.CHAT_PREVIEW_LIST_INVALID_SEARCH_ERROR,
                message: 'Invalid search',
              };
            }
          }
          if (pCAIP10ToWallet(formattedChatId) === pCAIP10ToWallet(user?.account || '')) {
            error = {
              code: ChatPreviewListErrorCodes.CHAT_PREVIEW_LIST_INVALID_SEARCH_ERROR,
              message: 'Invalid search',
            };
          }

          if (!error) {
            const chatInfo = await fetchChat({ chatId: formattedChatId });

            if (chatInfo && chatInfo?.meta?.group)
              groupProfile = await getGroupByIDnew({
                groupId: formattedChatId,
              });
            else if (user?.account)
              formattedChatId = pCAIP10ToWallet(
                chatInfo?.participants.find((address) => address != walletToPCAIP10(user?.account)) || formattedChatId
              );

            //fetch  profile
            if (!groupProfile) {
              userProfile = await getNewChatUser({
                searchText: formattedChatId,
                env: user?.env ? user?.env : CONSTANTS.ENV.PROD,
                fetchChatProfile: fetchUserProfile,
                user,
              });
            }

            if (!userProfile && !groupProfile) {
              error = {
                code: ChatPreviewListErrorCodes.CHAT_PREVIEW_LIST_INVALID_SEARCH_ERROR,
                message: 'Invalid search',
              };
            } else {
              searchedChat = {
                ...searchedChat,
                chatId: chatInfo?.chatId || formattedChatId,
                chatGroup: !!groupProfile,
                chatPic: (userProfile?.profile?.picture ?? groupProfile?.groupImage) || null,
                chatParticipant: groupProfile ? groupProfile?.groupName : formattedChatId!,
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
              if (currentNonce !== chatPreviewList.nonce || chatPreviewList.page !== 1) {
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
      console.debug(e);
      console.debug(`Errored: currentNonce: ${currentNonce}, chatPreviewList.nonce: ${chatPreviewList.nonce}`);
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
        scrollBottom <= SCROLL_LIMIT &&
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

  // Render
  return (
    <ChatPreviewListContainer
      key={user?.uid}
      ref={listInnerRef}
      theme={theme}
      onScroll={!options?.prefillChatPreviewList ? onScroll : undefined}
    >
      {/* do actual chat previews */}
      {chatPreviewList.items.map((item: IChatPreviewPayload, index: number) => {
        return (
          <ChatPreview
            key={item.chatId}
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
                  page: errorCode === ChatPreviewListErrorCodes.CHAT_PREVIEW_LIST_PRELOAD_ERROR ? 1 : prev.page,
                  preloading: errorCode === ChatPreviewListErrorCodes.CHAT_PREVIEW_LIST_PRELOAD_ERROR ? true : false,
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

      {(chatPreviewList.preloading || chatPreviewList.loading) && !chatPreviewList.errored && (
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
  height: inherit;
  overflow: hidden scroll;
  flex-direction: column;
  width: 100%;
  justify-content: start;
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
