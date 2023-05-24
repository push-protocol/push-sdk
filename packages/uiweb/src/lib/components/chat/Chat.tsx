import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';

import { MinimisedModalHeader } from './MinimisedModalHeader';
import { Modal } from './modal';
import { PUSH_TABS } from '../../types';
import { ChatMainStateContext, ChatPropsContext } from '../../context';
import { Section } from '../reusables/sharedStyling';
import useGetChatProfile from '../../hooks/chat/useGetChatProfile';

//make changes for users who dont have decryptedPgpPvtKey

export const Chat = () => {
  const {
    setChatsFeed,
    setRequestsFeed,
    setActiveTab,
    setSelectedChatId,
    setActiveSubTab,
    setNewChat,
    setSearchedChats,
    setChats,
    connectedProfile,
    setConnectedProfile,
  } = useContext<any>(ChatMainStateContext);
  const { decryptedPgpPvtKey, account, env } =
    useContext<any>(ChatPropsContext);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const { fetchChatProfile } = useGetChatProfile();

  useEffect(() => {
    let user ;
    if (account)
    {
      user = fetchChatProfile({ profileId: account });
      if(user)
      setConnectedProfile(user);

    }
  }, [connectedProfile]);

  useEffect(() => {
    setChatsFeed({});
    setConnectedProfile(undefined);
    setRequestsFeed({});
    setActiveTab(PUSH_TABS.CHATS);
    setSelectedChatId(null);
    setActiveSubTab(null);
    setSearchedChats(null);
    setNewChat(false);
    setChats(new Map());
  }, [account, decryptedPgpPvtKey, env]);

  const onMaximizeMinimizeToggle = () => {
    setModalOpen(!modalOpen);
  };

  return (
    <Container
      width="472px"
      flexDirection="column"
      maxHeight="600px"
      position="fixed"
      background="#fff"
      padding="24px 24px 0 24px"
      right="12px"
      bottom="18px"
      overflow="hidden"
    >
      <MinimisedModalHeader
        onMaximizeMinimizeToggle={onMaximizeMinimizeToggle}
        modalOpen={modalOpen}
      />
      {modalOpen && <Modal />}
    </Container>
  );
};

//styles

const Container = styled(Section)`
  border: 1px solid #dddddf;
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.08), 0px 0px 96px rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(5px);
  /* Note: backdrop-filter has minimal browser support */
  border-radius: 8px;
`;
