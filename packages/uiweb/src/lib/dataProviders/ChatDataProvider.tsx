import { useState, ReactNode } from 'react';
import { Constants, ENV } from '../config';
import {
  ChatDataContext,
  IChatDataContextValues,
} from '../context/chatContext';
import { ThemeContext } from '../components/chat/theme/ThemeProvider';
import { CHAT_THEME_OPTIONS, ChatThemeOptions, IChatTheme, getCustomChatTheme } from '../components/chat/theme';

export interface IChatUIProviderProps {
  children: ReactNode;
  theme?: ChatThemeOptions;
  themeOverride?: Partial<IChatTheme>;
  account?: string | null;
  pgpPrivateKey?: string | null;
  env?: ENV;
}

export const ChatUIProvider = ({
  children,
  account = null,
  theme,
  pgpPrivateKey = null,
  env = Constants.ENV.PROD,
}: IChatUIProviderProps) => {
  const [accountVal, setAccountVal] = useState<string | null>(account);
  const [pgpPrivateKeyVal, setPgpPrivateKeyVal] =
    useState<string | null>(pgpPrivateKey);
  const [envVal, setEnvVal] = useState<ENV>(env);

  const value: IChatDataContextValues = {
    account: accountVal,
    setAccount: setAccountVal,
    pgpPrivateKey: pgpPrivateKeyVal,
    setPgpPrivateKey: setPgpPrivateKeyVal,
    env: envVal,
    setEnv: setEnvVal,
  };


   const PROVIDER_THEME = getCustomChatTheme(theme);

  return (
    <ThemeContext.Provider value={PROVIDER_THEME}>
      <ChatDataContext.Provider value={value}>
        {children}
      </ChatDataContext.Provider>
    </ThemeContext.Provider>
  );
};
