import React, { useContext, useEffect, useRef, useState } from 'react';

import {
  ChatPreviewListErrorCodes,
  IChatPreviewListError,
  IChatPreviewListProps,
  IChatPreviewPayload,
  IChatPreviewProps,
} from '../exportedTypes';

import { CONSTANTS, IFeeds, PushAPI, chat } from '@pushprotocol/restapi';
import moment from 'moment';
import styled from 'styled-components';

import { useChatData, usePushChatSocket } from '../../../hooks';
import { Button, Section, Span, Spinner } from '../../reusables';

import useGetChatProfile from '../../../hooks/useGetChatProfile';

import { ChatPreview } from '../ChatPreview';
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
  const {
    env,
    signer,
    account,
    pgpPrivateKey,
    setPgpPrivateKey,
    connectedProfile,
    setConnectedProfile,
  } = useChatData();
  const { fetchChatProfile } = useGetChatProfile();

  // State Management
  // set user
  const [user, setUser] = useState<PushAPI>();

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

  // set theme
  const theme = useContext(ThemeContext);

  // set ref
  const listInnerRef = useRef<HTMLDivElement>(null);

  // set stream hooks
  const {
    acceptedRequestMessage,
    messagesSinceLastConnection,
    groupInformationSinceLastConnection,
  } = usePushChatSocket();

  // Helper Functions
  // Generate random nonce
  const generateRandomNonce: () => string = () => {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for(let i = 0; i < 32; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  };

  // Transform chat payloads
  const transformChatItems: (items: IFeeds[]) => IChatPreviewPayload[] = (
    items: IFeeds[]
  ) => {
    // map but also filter to remove any duplicates which might creep in if stream sends a message
    const transformedItems: IChatPreviewPayload[] = items.map((item: IFeeds) => ({
      chatId: item.chatId,
      chatPic: item.groupInformation
        ? item.groupInformation.groupImage
        : item.profilePicture,
      chatSender: item.groupInformation
        ? item.groupInformation.groupName
        : item.did,
      chatGroup: item.groupInformation ? true : false,
      chatTimestamp: item.msg.timestamp,
      chatMsg: {
        messageType: item.msg.messageType,
        messageContent: item.msg.messageContent,
      },
    }))
    .filter(
      (item, index, self) =>
        index === self.findIndex((t) => t.chatId === item.chatId)
    );

    return transformedItems;
  };

  // Add to chat items
  const addChatItems: (items: IChatPreviewPayload[]) => void = (items: IChatPreviewPayload[]) => {
    const combinedItems: IChatPreviewPayload[] = [
      ...items,
      ...chatPreviewList.items,
    ].filter(
      (item, index, self) =>
        index === self.findIndex((t) => t.chatId === item.chatId)
    );

    setChatPreviewList((prev) => ({
      ...prev,
      items: combinedItems
    }));

    // increment badge for each item
    items.forEach((item) => {
      // only increment if not selected
      if (chatPreviewListMeta.selectedChatId !== item.chatId) {
        setBadge(item.chatId, chatPreviewListMeta.badges[item.chatId] ? chatPreviewListMeta.badges[item.chatId] + 1 : 1);
      }
    });
  };

  // Remove from chat items
  const removeChatItems: (items: string[]) => void = (items: string[]) => {
    const combinedItems: IChatPreviewPayload[] = [
      ...chatPreviewList.items
    ].filter(
      (item) => !items.includes(item.chatId)
    );

    setChatPreviewList((prev) => ({
      ...prev,
      items: combinedItems
    }));

    // remove badge for each item
    items.forEach((item) => {
      setBadge(item.chatId, 0);
    });
  };

  // Transform stream message
  const transformStreamMessage: (item: any) => void = async (
    item: any
  ) => {
    if (!user) {
      return;
    }

    // Really hacky approach, get list with page: 1 and limit: 1
    // only to move forward till stream and chat api responses are updated
    const type = options.listType
        ? options.listType
        : CONSTANTS.CHAT.LIST_TYPE.CHATS;
    const overrideAccount = options.overrideAccount
      ? options.overrideAccount
      : undefined;
  
    // Testing if we can use this,
    // Not really since no way to see if chat is coming from CHATS or REQUESTS
    // if (item.isGroup) {
    //   const response = await user?.chat.group.info(item.chatId);
    //   console.log('response', response);
    // } else {
    //   const response = await user?.profile.info({
    //     overrideAccount: item.fromCAIP10,
    //   });
    //   console.log('response', response);
    // }

    const latestMessage = await user?.chat
      .list(type, {
        overrideAccount: overrideAccount,
        page: 1,
        limit: 1,
      });

    if (!latestMessage) {
      return;
    }
    const transformedItems = transformChatItems(latestMessage);

    // modify the chat items
    addChatItems(transformedItems);
  }

  // Transform accepted request
  const transforAcceptedRequest: (item: any) => void = async (
    item: any
  ) => {
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
  }

  // Define Chat Preview List Meta Functions
  // Set selected badge
  const setSelectedBadge: (chatId: string) => void = (
    chatId: string
  ) => {
    // selected will reduce badge to 0
    setChatPreviewListMeta((prev) => ({
      selectedChatId: chatId,
      badges: {
        ...prev.badges,
        [chatId]: 0,
      },
    }));
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
  }

  // Reset badge
  const resetBadge: () => void = () => {
    // reset badge
    setChatPreviewListMeta({
      selectedChatId: undefined,
      badges: {},
    });
  }

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

    const createUser = async () => {
      const pushUser = await PushAPI.initialize(signer, {
        account: account,
        env: env,
      });

      if (!pgpPrivateKey) {
        const encryptionInfo = await pushUser.encryption.info();
        setPgpPrivateKey(encryptionInfo.decryptedPgpPrivateKey);
      }

      if (!connectedProfile) {
        const user = await fetchChatProfile({ profileId: account!, env });
        if (user) setConnectedProfile(user);
      }

      setUser(pushUser);
    };

    // only create user is signer or account is present
    if (signer || account) {
      createUser();
    }
  }, [account, signer, env]);

  // If push user changes | preloading
  useEffect(() => {
    if (!user) {
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
  }, [user, options.listType, options.overrideAccount]);

  // If reset is called
  useEffect(() => {
    if (!user) {
      return;
    }

    // reset badge as well
    resetBadge();

    const initializeChatList = async () => {
      // Load chat type from options, if not present, default to CHATS
      const type = options.listType
        ? options.listType
        : CONSTANTS.CHAT.LIST_TYPE.CHATS;
      const overrideAccount = options.overrideAccount
        ? options.overrideAccount
        : undefined;
      const newpage = 1;

      // store current nonce and page
      const currentNonce = chatPreviewList.nonce;

      user.chat
        .list(type, {
          overrideAccount: overrideAccount,
          page: newpage,
          limit: CHAT_PAGE_LIMIT,
        })
        .then((chats: IFeeds[]) => {
          // get and transform chats
          const transformedChats = transformChatItems(chats);
          console.log(`currentNonce: ${currentNonce}, chatPreviewList.nonce: ${chatPreviewList.nonce}`);

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
        })
        .catch((e) => {
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
            }
          });
        });
    };
    
    if (chatPreviewList.reset) {
      initializeChatList();
    }

  }, [chatPreviewList.reset]);

  // If loading becomes active
  useEffect(() => {
    const loadMoreChats = async () => {
      // Load chat type from options, if not present, default to CHATS
      const type = options.listType
        ? options.listType
        : CONSTANTS.CHAT.LIST_TYPE.CHATS;
      const overrideAccount = options.overrideAccount
        ? options.overrideAccount
        : undefined;
      const newpage = chatPreviewList.page + 1;

      // store current nonce and page
      const currentNonce = chatPreviewList.nonce;
      const currentPage = newpage;

      user?.chat
        .list(type, {
          overrideAccount: overrideAccount,
          page: newpage,
          limit: CHAT_PAGE_LIMIT,
        })
        .then((chats: IFeeds[]) => {
          // get and transform chats
          const transformedChats = transformChatItems(chats);
          
          // return if nonce doesn't match or if page plus 1 is not the same as new page
          if (currentNonce !== chatPreviewList.nonce || chatPreviewList.page + 1 !== currentPage) {
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
        })
        .catch((e) => {
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
            }
          }));
        });
    };

    if (chatPreviewList.loading || chatPreviewList.resume) {
      loadMoreChats();
    }
  }, [chatPreviewList.loading, chatPreviewList.resume]);

  // Listen to streams - incoming message
  useEffect(() => {
    if (
      Object.keys(messagesSinceLastConnection).length > 0 &&
      messagesSinceLastConnection.constructor === Object
    ) {
      console.log('Message since last connection', messagesSinceLastConnection);
      const transformedItems = transformStreamMessage(messagesSinceLastConnection);
    }
  }, [
    messagesSinceLastConnection
  ]);

  // Listen to streams - accepted message
  useEffect(() => {
    if (
      Object.keys(acceptedRequestMessage).length > 0 &&
      acceptedRequestMessage.constructor === Object
    ) {
      console.log('Accepted request message', acceptedRequestMessage);
    }
  }, [
    acceptedRequestMessage
  ]);

  // Listen to streams - group information change
  useEffect(() => {
    // if (
    //   Object.keys(groupInformationSinceLastConnection).length > 0 &&
    //   acceptedRequestMessage.constructor === Object
    // ) {
    //   console.log('Accepted request message', groupInformationSinceLastConnection);
    // }
  }, [
    groupInformationSinceLastConnection
  ]);

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
        setChatPreviewList((prev) => ({ ...prev, nonce: generateRandomNonce(), loading: true }));
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
            badge={chatPreviewListMeta.badges ? {count: chatPreviewListMeta.badges[item.chatId]} : {count: 0}}
            selected={chatPreviewListMeta.selectedChatId === item.chatId ? true : false}
            setSelected={setSelectedBadge} 
          />
        );
      })}

      {/* if errored out for any reason */}
      {chatPreviewList.errored && (
        <Section padding="10px" flexDirection="column">
          <Span margin="0 0 10px 0">{chatPreviewList.error?.message}</Span>
          <Button
            onClick={() => {
              const errorCode = chatPreviewList.error ? chatPreviewList.error.code : ChatPreviewListErrorCodes.CHAT_PREVIEW_LIST_PRELOAD_ERROR;
              
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
        </Section>
      )}

      {(chatPreviewList.preloading || chatPreviewList.loading) && !chatPreviewList.errored && (
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
