import type { IFeeds, IMessageIPFS, IUser } from '@pushprotocol/restapi';
import React, { createContext, useContext, useState } from 'react';
import { getData } from '../../helpers/chat/localStorage';
import type { ChatFeedsType, PushSubTabs, PushTabs, Web3NameListType } from '../../types';
import { PUSH_SUB_TABS, PUSH_TABS } from '../../types';
import ChatPropsContext from './chatPropsContext';

type ChatMessagetype = { messages: IMessageIPFS[]; lastThreadHash: string | null };

export type ChatMainStateContextType = {
  selectedChatId: string | null;
  setSelectedChatId: (chatId: string | null) => void;
  newChat: boolean;
  setNewChat: (flag: boolean) => void;
  chatsFeed: ChatFeedsType;
  setChatsFeed: (chatsFeed: ChatFeedsType) => void;
  setChatFeed: (id: string, newChatFeed: IFeeds) => void;
  requestsFeed: ChatFeedsType; // requestId -> feed obj
  setRequestsFeed: (requestsFeed: ChatFeedsType) => void;
  setRequestFeed: (id: string, newRequestFeed: IFeeds) => void;
  setWeb3Name: (id: string, web3Name: string) => void;
  chats: Map<string, ChatMessagetype>; // chatId -> chat messages array
  setChats: (chats: Map<string, ChatMessagetype>) => void;
  setChat: (key: string, newChat: ChatMessagetype) => void;
  web3NameList: Web3NameListType;
  setWeb3NameList: (web3NameList: Web3NameListType) => void;
  activeTab: PushTabs;
  setActiveTab: (tabName: PushTabs) => void;
  connectedProfile: IUser | undefined;
  setConnectedProfile: (connectedProfile: IUser) => void;
  activeSubTab: PushSubTabs | null;
  setActiveSubTab: (tabName: PushSubTabs) => void;
  searchedChats: ChatFeedsType | null;
  setSearchedChats: (chats:ChatFeedsType | null) => void;
  pushChatSocket: any; // replace any with the actual type of socket connection
  setPushChatSocket: (pushChatSocket: any) => void;
}

export const ChatMainStateContext = createContext<ChatMainStateContextType>({} as ChatMainStateContextType);

const ChatMainStateContextProvider = ({ children }: { children: React.ReactNode }) => {
const [web3NameList,setWeb3NameList]=useState<Web3NameListType>({})
const [newChat,setNewChat]=useState<boolean>(false);
const [connectedProfile,setConnectedProfile]=useState<IUser | undefined>(undefined);
const [chatsFeed,setChatsFeed] =useState<ChatFeedsType>({} as ChatFeedsType);
const [requestsFeed,setRequestsFeed] =useState<ChatFeedsType>({} as ChatFeedsType);
const [chats,setChats] = useState<Map<string, ChatMessagetype> >(new Map());
const [selectedChatId,setSelectedChatId] = useState<string | null>(null);
const [searchedChats,setSearchedChats] = useState<ChatFeedsType | null>(null);
const [activeTab,setTab] = useState<PushTabs>(PUSH_TABS.CHATS);
const [activeSubTab,setSubTab] = useState<PushSubTabs | null>(null);
const [pushChatSocket,setPushChatSocket] = useState<any>(null);



 const setChatFeed = (id: string,newChatFeed:IFeeds) => {
  //  getData
  // setData({key:LOCAL_STORAGE_KEYS.CHATS,value:n});
    setChatsFeed(prevChatsFeed => ({
      [id]: newChatFeed ,
        ...prevChatsFeed,
       
    }));
 }
 const setRequestFeed = (id: string,newRequestFeed:IFeeds) => {
    setRequestsFeed(prevRequestsFeed => ({
      [id]: newRequestFeed ,
        ...prevRequestsFeed,
   
    }));
 }
 const setWeb3Name = (id: string,web3Name:string) => {
  setWeb3NameList(prev => ({
      ...prev,
      [id]: web3Name 
  }));
}

 const setActiveTab = (tabName: PushTabs) => {
  setNewChat(false)
  setSubTab(null);
  setTab(tabName);

}
const setActiveSubTab = (tabName: PushSubTabs) => {
  setNewChat(false)
  setSubTab(tabName);

}
 const setChat = (key:string,newChat:ChatMessagetype) => {
  const tempChats = new Map(chats);
  tempChats.set(key, newChat);
  setChats(tempChats);
 }


  return (

    <ChatMainStateContext.Provider value={{ 
        chatsFeed,
        requestsFeed,
        newChat,
        setNewChat,
        setRequestFeed,
        setChatsFeed,
        activeTab,
        setActiveTab,
        setRequestsFeed,
        setChatFeed ,
        searchedChats,
        connectedProfile,
        setConnectedProfile,
        setSearchedChats,
        chats,
        setChats,
        setChat,
        selectedChatId,
        setSelectedChatId,
        web3NameList,
        setWeb3NameList,
        setWeb3Name,
        setActiveSubTab,
        activeSubTab,
        pushChatSocket,
        setPushChatSocket
      }}>

      {children}
    </ChatMainStateContext.Provider>
  );
};

export default ChatMainStateContextProvider;
