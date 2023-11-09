import React, { useEffect, useState, useContext, useRef } from 'react';
import styled from 'styled-components';

import { MinimisedModalHeader } from './MinimisedModalHeader';
import { Modal } from './modal';
import type { ChatFeedsType} from '../../types';
import { PUSH_TABS } from '../../types';
import { SOCKET_TYPE } from '../../types';
import {
  ChatMainStateContext,
  ChatAndNotificationPropsContext,
  NotificationMainStateContext,
  ChatAndNotificationMainContext,
} from '../../context';
import { Section } from '../reusables/sharedStyling';
import useGetChatProfile from '../../hooks/useGetChatProfile';
import { chatLimit, device, requestLimit } from '../../config';
import useFetchRequests from '../../hooks/chatAndNotification/chat/useFetchRequests';
import useFetchChats from '../../hooks/chatAndNotification/chat/useFetchChats';
import {
  getAddress,
  getDefaultFeedObject,
  getNewChatUser,
  walletToPCAIP10,
} from '../../helpers';
import useFetchUserSubscriptions from '../../hooks/chatAndNotification/notifications/useFetchUserSubscriptions';
import useChatNotificationSocket from '../../hooks/chatAndNotification/useChatNotificationSocket';
import type { ChatMainStateContextType } from '../../context/chatAndNotification/chat/chatMainStateContext';
import type { IFeeds } from '@pushprotocol/restapi';
import useFetchChat from '../../hooks/chatAndNotification/chat/useFetchChat';

//make changes for users who dont have decryptedPgpPvtKey

export const ChatAndNotification = () => {
  const { setNewChat, setActiveTab, setActiveSubTab } = useContext<any>(
    ChatAndNotificationMainContext
  );
  const {
    setChatsFeed,
    setRequestsFeed,
    setSelectedChatId,
    setSearchedChats,
    chats,
    setConnectedProfile,
    requestsFeed,
    chatsFeed,
    selectedChatId,
    setFinishedFetchingChats,
    setFinishedFetchingRequests,
    setChats
  } = useContext<ChatMainStateContextType>(ChatMainStateContext);
  const { setInboxNotifsFeed, setSpamNotifsFeed,setFinishedFetchingInbox,setFinishedFetchingSpam } = useContext<any>(
    NotificationMainStateContext
  );
  const {
    decryptedPgpPvtKey,
    account,
    env,
    activeChosenTab,
    activeChat,
    onClose,
  } = useContext<any>(ChatAndNotificationPropsContext);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const { fetchChatProfile } = useGetChatProfile();
  const { fetchRequests } = useFetchRequests();
  const { fetchChats } = useFetchChats();
  const { fetchChat } = useFetchChat();
  const modalRef = useRef<HTMLDivElement>(null);
  const { fetchUserSubscriptions } = useFetchUserSubscriptions();
  useChatNotificationSocket({});

  useChatNotificationSocket({ socketType: SOCKET_TYPE.CHAT });

  useEffect(() => {
    setChatsFeed({});
    setRequestsFeed({});
    setInboxNotifsFeed({});
    setSpamNotifsFeed({});
    setFinishedFetchingInbox(false);
    setFinishedFetchingSpam(false);
    setFinishedFetchingChats(false);
    setFinishedFetchingRequests(false);
    // set active tab if present
    if (activeChosenTab) {
      setActiveTab(activeChosenTab);
      setModalOpen(true);
    }
    else{
      setActiveTab(PUSH_TABS.CHATS);
    }
    setActiveSubTab(null);
    setChats(new Map());
    setNewChat(false);
  }, [account, env, activeChosenTab]);

  //make a helper for the function
  const fetchRequestList = async () => {
    const feeds = await fetchRequests({ page: 1, requestLimit });
    const firstFeeds: ChatFeedsType = { ...feeds };
    setRequestsFeed(firstFeeds);
  };

  useEffect(() => {
    if (Object.keys(requestsFeed).length) {
      return;
    }
    if (decryptedPgpPvtKey) {
      fetchRequestList();
    }
  }, [fetchRequests, decryptedPgpPvtKey, env]);

  const fetchChatList = async () => {
    const feeds = await fetchChats({ page: 1, chatLimit });
    const firstFeeds: ChatFeedsType = { ...feeds };
    setChatsFeed(firstFeeds);
  };

  useEffect(() => {
    if (Object.keys(chatsFeed).length) {
      return;
    }
    if (decryptedPgpPvtKey) {
      fetchChatList();
    }
  }, [fetchChats, env, account]);

  useEffect(() => {
    (async () => {
      let user;
      if (account) {
        user = await fetchChatProfile({ profileId: account ,env});

        if (user) setConnectedProfile(user);
      }
    })();
  }, [account]);

  useEffect(() => {
    (async () => {
      fetchUserSubscriptions();
    })();
  }, [env, account]);

  useEffect(() => {
    (async () => {
      if (activeChat) {
        const address = await getAddress(activeChat, env);
        if (address) {
          setModalOpen(true);
          setSelectedChatId(walletToPCAIP10(address).toLowerCase());
          let selectedChat = chatsFeed[walletToPCAIP10(address).toLowerCase()] || requestsFeed[walletToPCAIP10(address).toLowerCase()];
          if (!selectedChat) {
            selectedChat = (await fetchChat({
              recipientAddress: walletToPCAIP10(address),
            })) as IFeeds;
            if (!Object.keys(selectedChat|| {}).length) {
              const result = await getNewChatUser({
                searchText: address,
                fetchChatProfile,
                env,
              });

              if (result) {
                selectedChat = getDefaultFeedObject({ user: result });
              }
            }

          }
          setSearchedChats({
            [selectedChat.did.toLowerCase() ?? selectedChat.chatId]: selectedChat,
          });

        }
        else{
          setSearchedChats(null);
          setSelectedChatId(null);
        }
      } else {

        setSelectedChatId(null);
        setSearchedChats(null);
      }
      // setChats(new Map())
    })();
  }, [activeChat,env,account]);


  const onMaximizeMinimizeToggle = () => {
    setModalOpen(!modalOpen);
  };



  useEffect(() => {
    const modalElement = modalRef.current;
    if (!modalElement) return;

    const handleScroll = (event: WheelEvent) => {
      const { scrollTop, scrollHeight, clientHeight } = modalElement;
      const isScrolledToBottom = scrollTop + clientHeight >= scrollHeight;

      // If scrolled to the bottom of the modal, prevent further scrolling
      if (isScrolledToBottom && event.deltaY > 0) {
        // event.preventDefault();
        event.stopPropagation();
      }
    };

    modalElement.addEventListener('wheel', handleScroll);

    // Cleanup the event listener when the component unmounts
    return () => {
      modalElement.removeEventListener('wheel', handleScroll);
    };
  }, []);


  return (
    <Container
      width="470px"
      flexDirection="column"
      maxHeight="600px"
      position="fixed"
      background="#fff"
      right="12px"
      bottom="18px"
      className='modal'
      overflow="hidden"
      ref={modalRef}

      // onMouseEnter={() => toggleOverflow('hidden')}
      // onMouseLeave={() => toggleOverflow('auto')}
    >
      <MinimisedModalHeader
        onMaximizeMinimizeToggle={onClose ?? onMaximizeMinimizeToggle}
        modalOpen={modalOpen}
      />
      {modalOpen && <Modal />}
    </Container>
  );
};

//styles

const Container = styled(Section)`
  border: 1px solid #dddddf;
  padding:0 20px 0 21px;
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.08), 0px 0px 96px rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(5px);
  /* Note: backdrop-filter has minimal browser support */
  border-radius: 8px;
  // @media ${device.mobileL} {
  //   width: 350px;
  // }
  @media ${device.mobileL} {
    width: 330px;
    padding: 0px 12px 0 12px;
  }
`;
