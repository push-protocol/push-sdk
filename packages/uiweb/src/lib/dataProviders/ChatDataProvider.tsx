import { useState, ReactNode } from "react";
import { ENV } from "../config";
import { ChatDataContext, IChatDataContextValues } from "../context/chatContext";

export interface IChatUIProviderProps {
    children: ReactNode;
    // theme: IChatTheme
    account: string;
    pgpPrivateKey: string;
    env: ENV;
}

export const ChatUIProvider = ({ children, account, pgpPrivateKey, env }: IChatUIProviderProps) => {
    // will replace the default values with the ChatUI
    const [accountVal, setAccountVal] = useState<string>(account);
    const [pgpPrivateKeyVal, setPgpPrivateKeyVal] = useState<string>(pgpPrivateKey);
    const [envVal, setEnvVal] = useState<ENV>(env);

    const value: IChatDataContextValues = {
        accountVal,
        setAccountVal,
        pgpPrivateKeyVal,
        setPgpPrivateKeyVal,
        envVal,
        setEnvVal,
    };

    return (
        <ChatDataContext.Provider value={value}>
            {children}
        </ChatDataContext.Provider>
    )
}