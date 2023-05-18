
import useFetchRequests from '../../../../hooks/chat/useFetchRequests';
import React, { useEffect, useState, useContext, useRef } from 'react';

import { ChatMainStateContext, ChatPropsContext } from '../../../../context';
import { ChatList } from './ChatList';




export const RequestsFeedList= () => {
    const { requestsFeed } =
    useContext<any>(ChatMainStateContext);
    const { decryptedPgpPvtKey, account, env } =
    useContext<any>(ChatPropsContext);

  const pageRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState<number>(1);


  const { fetchRequests } = useFetchRequests();

  const fetchRequestList = async () => {
    await fetchRequests();
  };

  useEffect(() => {
    if (decryptedPgpPvtKey) {
      fetchRequestList();
    }
  }, [account, decryptedPgpPvtKey, env, page]);
  return (
    <ChatList chatsFeed={requestsFeed}/>
  );
};

//styles

//scrollbar design left
