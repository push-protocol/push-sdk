import { createContext, useState } from 'react';
import type { PushSubTabs, PushTabs } from '../../types';
import { PUSH_TABS } from '../../types';

export type ChatAndNotificationMainContextType = {
  activeTab: PushTabs;
  setActiveTab: (tabName: PushTabs) => void;
  activeSubTab: PushSubTabs | null;
  setActiveSubTab: (tabName: PushSubTabs) => void;
  newChat: boolean;
  setNewChat: (flag: boolean) => void;
  pushChatNotificationSocket: any; 
  setPushChatNotificationSocket: (pushChatNotificationSocket: any) => void;
};

// MainContext
export const ChatAndNotificationMainContext = createContext<ChatAndNotificationMainContextType>(
  {} as ChatAndNotificationMainContextType
);

const ChatAndNotificationMainContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeTab, setTab] = useState<PushTabs>(PUSH_TABS.CHATS);
  const [activeSubTab, setSubTab] = useState<PushSubTabs | null>(null);
  const [newChat,setNewChat]=useState<boolean>(false);
  const [pushChatNotificationSocket,setPushChatNotificationSocket] = useState<any>(null);


  const setActiveTab = (tabName: PushTabs) => {
    setNewChat(false);
    setSubTab(null);
    setTab(tabName);
  };
  const setActiveSubTab = (tabName: PushSubTabs) => {
    setNewChat(false);
    setSubTab(tabName);
  };

  return (
    <ChatAndNotificationMainContext.Provider value={{ 
        newChat,
        setNewChat,
        activeTab,
        setActiveTab,
        setActiveSubTab,
        activeSubTab,
        pushChatNotificationSocket,
        setPushChatNotificationSocket
      }}>
      {children}
    </ChatAndNotificationMainContext.Provider>
  )
};

export default ChatAndNotificationMainContextProvider;
