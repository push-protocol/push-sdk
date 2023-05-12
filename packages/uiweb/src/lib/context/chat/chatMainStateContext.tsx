import { IFeeds, IMessageIPFS } from '@pushprotocol/restapi';
import React, { createContext, useState } from 'react';
import { ChatFeedsType, PushTabs, PUSH_TABS, Web3NameListType } from '../../types';


export type ChatMainStateContextType = {
  selectedChatId: string | null;
  setSelectedChatId: (chatId: string | null) => void;
  chatsFeed: ChatFeedsType;
  setChatsFeed: (chatsFeed: ChatFeedsType) => void;
  setChatFeed: (id: string, newChatFeed: IFeeds) => void;
  requestsFeed: ChatFeedsType; // requestId -> feed obj
  setRequestsFeed: (requestsFeed: ChatFeedsType) => void;
  setRequestFeed: (id: string, newRequestFeed: IFeeds) => void;
  setWeb3Name: (id: string, web3Name: string) => void;
  chats: Map<string, IMessageIPFS[]>; // chatId -> chat messages array
  setChats: (chats: Map<string, IMessageIPFS[]>) => void;
  setChat: (key: string, newChat: IMessageIPFS[]) => void;
  web3NameList: Web3NameListType;
  setWeb3NameList: (web3NameList: Web3NameListType) => void;
  activeTab: PushTabs;
  setActiveTab: (tabName: PushTabs) => void;
  searchedChats: ChatFeedsType | null;
  setSearchedChats: (chats:ChatFeedsType | null) => void;

}

export const ChatMainStateContext = createContext<ChatMainStateContextType>({} as ChatMainStateContextType);

const ChatMainStateContextProvider = ({ children }: { children: React.ReactNode }) => {
const [web3NameList,setWeb3NameList]=useState<Web3NameListType>({})
const [chatsFeed,setChatsFeed] =useState<ChatFeedsType>({} as ChatFeedsType);
const [requestsFeed,setRequestsFeed] =useState<ChatFeedsType>({} as ChatFeedsType);
const [chats,setChats] = useState<Map<string, IMessageIPFS[]> >(new Map());
const [selectedChatId,setSelectedChatId] = useState<string | null>(null);
const [searchedChats,setSearchedChats] = useState<ChatFeedsType | null>(null);
const [activeTab,setTab] = useState<PushTabs>(PUSH_TABS.CHATS);


 const setChatFeed = (id: string,newChatFeed:IFeeds) => {
    setChatsFeed(prevChatsFeed => ({
        ...prevChatsFeed,
        [id]: newChatFeed 
    }));
 }
 const setRequestFeed = (id: string,newRequestFeed:IFeeds) => {
    setRequestsFeed(prevRequestsFeed => ({
        ...prevRequestsFeed,
        [id]: newRequestFeed 
    }));
 }
 const setWeb3Name = (id: string,web3Name:string) => {
  setWeb3NameList(prev => ({
      ...prev,
      [id]: web3Name 
  }));
}

 const setActiveTab = (tabName: PushTabs) => {
  setTab(tabName);
  setSelectedChatId(null);
}
 const setChat = (key:string,newChat:IMessageIPFS[]) => {
  const tempChats = new Map(chats);
  tempChats.set(key, newChat);
  setChats(tempChats);
 }


  return (

    <ChatMainStateContext.Provider value={{ 
        chatsFeed,
        requestsFeed,
        setRequestFeed,
        setChatsFeed,
        activeTab,
        setActiveTab,
        setRequestsFeed,
        setChatFeed ,
        searchedChats,
        setSearchedChats,
        chats,
        setChats,
        setChat,
        selectedChatId,
        setSelectedChatId,
        web3NameList,
        setWeb3NameList,
        setWeb3Name,
      }}>

      {children}
    </ChatMainStateContext.Provider>
  );
};

export default ChatMainStateContextProvider;
