import { useContext } from "react";
import { ChatDataContext } from "../../context";
import { IChatDataContextValues } from "../../context/chatContext";

export const useChatData = (): IChatDataContextValues => {
  const context = useContext(ChatDataContext);
  if (!context) {
    throw new Error('useSpaceData must be used within a ChatDataProvider');
  }
  return context;
}