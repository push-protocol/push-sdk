import { createContext, useState } from 'react';
import type { PushSubTabs, PushTabs } from '../../types';
import { PUSH_TABS } from '../../types';

export type MainContextType = {
  activeTab: PushTabs;
  setActiveTab: (tabName: PushTabs) => void;
  activeSubTab: PushSubTabs | null;
  setActiveSubTab: (tabName: PushSubTabs) => void;
  newChat: boolean;
  setNewChat: (flag: boolean) => void;
};

export const MainContext = createContext<MainContextType>(
  {} as MainContextType
);

const MainContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeTab, setTab] = useState<PushTabs>(PUSH_TABS.CHATS);
  const [activeSubTab, setSubTab] = useState<PushSubTabs | null>(null);
  const [newChat,setNewChat]=useState<boolean>(false);

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
    <MainContext.Provider value={{ 
        newChat,
        setNewChat,
        activeTab,
        setActiveTab,
        setActiveSubTab,
        activeSubTab,
      }}>
      {children}
    </MainContext.Provider>
  )
};

export default MainContextProvider;
