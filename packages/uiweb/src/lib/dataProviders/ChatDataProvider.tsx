import { useState, ReactNode, useEffect } from 'react';
import { Constants, ENV } from '../config';
import {
  ChatDataContext,
  ChatMessagetype,
  IChatDataContextValues,
} from '../context/chatContext';
import { ThemeContext } from '../components/chat/theme/ThemeProvider';
import { IChatTheme, lightTheme } from '../components/chat/theme';

export interface IChatUIProviderProps {
  children: ReactNode;
  theme?: IChatTheme;
  customeTheme?: IChatTheme;
  account?: string | null;
  decryptedPgpPvtKey?: string | null;
  env?: ENV;
}

export const ChatUIProvider = ({
  children,
  account = null,
  theme,
  decryptedPgpPvtKey = null,
  env = Constants.ENV.PROD,
}: IChatUIProviderProps) => {
  const [accountVal, setAccountVal] = useState<string | null>(account);
  const [decryptedPgpPvtKeyVal, setDecryptedPgpPvtKeyVal] =
    useState<string | null>(decryptedPgpPvtKey);
  const [envVal, setEnvVal] = useState<ENV>(env);

useEffect(()=>{
    setAccountVal(account)
    setDecryptedPgpPvtKeyVal(decryptedPgpPvtKey)
},[decryptedPgpPvtKey])

  const value: IChatDataContextValues = {
    account: accountVal,
    setAccount: setAccountVal,
    decryptedPgpPvtKey: decryptedPgpPvtKeyVal,
    setDecryptedPgpPvtKey: setDecryptedPgpPvtKeyVal,
    env: envVal,
    setEnv: setEnvVal,
  };
  const PROVIDER_THEME = Object.assign({}, lightTheme, theme);
  return (
    <ThemeContext.Provider value={PROVIDER_THEME}>
      <ChatDataContext.Provider value={value}>
        {children}
      </ChatDataContext.Provider>
    </ThemeContext.Provider>
  );
};
