import React, {useState} from "react";
import { ENV } from "../config";
import { ChatDataContext, IChatDataContextValues } from "../context/chatContext";

export interface IChatUIProviderProps {
    children: React.ReactNode;
}

export const ChatUIProvider = ({ children }: IChatUIProviderProps) => {
    // will replace the default values with the ChatUI
    const [account, setAccount] = useState<string>("");
    const [pgpPrivateKey, setPgpPrivateKey] = useState<string>("");
    const [env, setEnv] = useState<ENV>(ENV.DEV);

    const value: IChatDataContextValues = {
        account,
        setAccount,
        pgpPrivateKey,
        setPgpPrivateKey,
        env,
        setEnv,
    };

    return (
        <ChatDataContext.Provider value={value}>
            {children}
        </ChatDataContext.Provider>
    )
}