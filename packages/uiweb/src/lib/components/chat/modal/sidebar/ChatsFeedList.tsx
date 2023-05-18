
import useFetchChats from '../../../../hooks/chat/useFetchChats';
import React, { useEffect, useState, useContext, useRef } from 'react';

import { ChatMainStateContext, ChatPropsContext } from '../../../../context';
import { ChatList } from './ChatList';
import useFetchRequests from '../../../../hooks/chat/useFetchRequests';




export const ChatsFeedList= () => {
    const { chatsFeed } =
    useContext<any>(ChatMainStateContext);
    const pageRef = useRef<HTMLDivElement>(null);
    const [page, setPage] = useState<number>(1);
    const { decryptedPgpPvtKey, account, env } =
    useContext<any>(ChatPropsContext);
    const { fetchChats } = useFetchChats();

  
    const fetchChatList = async () => {
      await fetchChats();
    };
  
    useEffect(() => {
      if (decryptedPgpPvtKey) {
        fetchChatList();
      }
    }, [account, decryptedPgpPvtKey, env, page]);

    
  return (
    <ChatList chatsFeed={chatsFeed}/>
  );
};

//styles

//scrollbar design left
